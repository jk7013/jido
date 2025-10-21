# Jido – 엔터프라이즈 기준 정합성 체크 & 수정 지시서 (for Cursor)

> 목적: 오늘 대화 이후 확정된 **원칙/설계**를 레포에 반영하고,
> 커서가 이전 정리에서 놓친/엇나간 부분을 **정확히 수정**하도록 하는 실행 지시서.
>
> 기준: **보안 최우선**, **듀얼 모드(폐쇄망/온라인)**, **v1=단건 실행 중심**, **트레이싱 표준화(trace/span)**.

---

## 0) TL;DR (무엇이 바뀌나?)
- **DB 기본**: SQLite → **PostgreSQL 기본** (SQLite는 로컬 개발 전용)
- **MLflow 위치**: 필수가 아님. **Jido DB가 기본**, MLflow/Loki는 **옵션 싱크**
- **v1 스코프**: 단건 실행 + 트레이스/로그 + 프롬프트 에디터/버전 + GitLab/CSV (배치/평가 자동화는 **v2**)
- **Connections(연결) 마법사**: UI에서 키·URL·템플릿(`{{prompt}}`)·JSONPath로 설정/테스트/저장
- **트레이싱 스키마**: `executions`(trace) / `execution_steps`(span) **필수 확정**
- **보안/듀얼 모드**: OFFLINE egress 차단, 키 암호화 저장, Allowlist, 컨테이너 하드닝 등 **문서화 & 기본값 적용**

---

## 1) 아키텍처 결정(ADR 요약)
1. **Dual-Mode 지원**: 같은 코드, 설정만 다르게 (OFFLINE/ONLINE)
2. **데이터 저장소**: PostgreSQL(기본) + stdout JSON 로그
3. **관측 연동(옵션)**: MLflow(미러링), Loki/Grafana(로그 검색)
4. **트레이싱 표준**: trace_id(요청) + span(단계) 저장
5. **보안 기본값**: 비루트, read-only, cap_drop:[ALL], 키 암호화, PII 마스킹

> 커서는 `/docs/adr/`에 ADR 파일 6개 생성: `dual-mode`, `db-choice`, `tracing-model`, `logging-policy`, `container-security`, `release-profiles`.

---

## 2) 페이지(파일) 구조 – 최종안
```
/src/pages
├─ Welcome.tsx               # 온보딩(“연결 만들기”)
├─ Connections.tsx           # 연결 목록/상태/편집
├─ Connections.New.tsx       # 연결 마법사(Provider→키→API템플릿/붙여넣기→변수추출→테스트)
├─ Dashboard.tsx             # 싱글/AB 토글, 실행/결과 요약, “프롬프트 작성” 버튼
├─ PromptEditor.tsx          # 풀스크린 에디터 (Prompt/Parameters/Variables)
├─ RunResult.tsx             # 결과 상세(가공/원문 토글, 메타 배지)
├─ TraceViewer.tsx           # 단계별 로그(워터폴), trace_id 복사
├─ History.tsx               # 실행 히스토리 목록
├─ History.Detail.tsx        # 실행 상세(결과+트레이스+이전 대비 Diff)
└─ Settings.tsx              # Allowlist, 레이트리밋, 비용 캡, OFFLINE 스위치
```

### 전역 모달(페이지 아님)
```
/src/components/git/CommitDialog.tsx   # GitLab 커밋 모달(전역 재사용)
```

---

## 3) DB 스키마(v1 확정)
- **prompts**(id, name, description, created_at)
- **prompt_versions**(id, prompt_id, version, template, variables_json, normalized_text, created_at)
- **executions**(id=trace_id, prompt_version_id, input_json, output_json, model, params_json, tokens_in, tokens_out, latency_ms, cost_usd, status, created_at)
- **execution_steps**(id=span_id, trace_id, parent_span_id, name, type, status, latency_ms, meta, created_at)
- **connections**(id, name, provider, base_url, default_model, api_key_encrypted, headers_json, variables_json, extract_jsonpath, scope, owner_id, status, last_checked_at, created_at, updated_at)

> 시간은 **UTC**, 키는 **UUID**, 본문은 **jsonb**. 인덱스: 조회 기준(예: executions.prompt_version_id+created_at desc, execution_steps.trace_id+created_at 등).

---

## 4) API 계약(초안)
### 4.1 Runs
- `POST /runs`
  - 입력: `{ input_text, prompt_version_id?, connection_id?, model?, params? }`
  - 출력: `{ trace_id, output_text, model, tokens_in, tokens_out, latency_ms, created_at }`
  - 에러 표준: `{ error_code, message, trace_id, hint }`
- `GET /runs/:trace_id` – 결과/원문 반환
- `GET /traces/:trace_id` – 단계별 로그(span 리스트)

### 4.2 Connections
- `POST /connections` – 생성(키는 서버측 암호화 저장, 재표시 금지)
- `POST /connections/:id/test` – 5s 타임아웃, 429/5xx 백오프 2회
- `GET /connections` – 목록(상태/최근 점검시간 포함)

### 4.3 Exports
- `POST /exports/csv` – 실행 결과 CSV 내보내기(UTC, 파라미터 해시 포함)

---

## 5) 보안 & 듀얼 모드 – 문서에 고정
- **OFFLINE_MODE=true**: 외부 egress 차단(허용 도메인만 통신)
- **컨테이너 하드닝**: 비루트, `read_only: true`, `cap_drop: [ALL]`, internal network
- **비밀/키**: 이미지 포함 금지, 서버측 **암호화 저장**, Body/Headers 평문키 **차단**
- **로그 정책**: JSON 구조 로그, **PII 마스킹**, 원문 기본 비저장(필요 시 샘플링)
- **레이트리밋/비용캡**: 연결별 RPM·월간 비용 상한
- **감사 로그**: 연결/프롬프트/실행의 생성·수정·삭제·테스트 기록

---

## 6) 트레이싱 & 로깅 – 구현 규칙
- 모든 요청은 **trace_id** 생성 → 응답 헤더 `X-Trace-Id`
- `executions` 1행 + `execution_steps` N행 기록(분류/검색/LLM 등)
- stdout JSON 로그 필드(최소): `ts, level, trace_id, endpoint, model, tokens_in, tokens_out, latency_ms, status`
- 실패 시 표준 에러 + **hint**(예: 401→키/권한, 429→쿼터/리밋)
- (옵션) **멀티 싱크**: MlflowSink/LokiSink 플래그로 비동기 미러링

---

## 7) Connections – Custom HTTP(Postman형) 규칙
- 에디터에 JSON/HTTP 원문 붙여넣기 → `{{var}}` 자동 추출 → 기본값 입력
- 응답 텍스트 추출은 **JSONPath** 지정(예: `$.choices[0].message.content`)
- **키 전용 입력 필드** 제공(암호화 저장). Body/Headers의 평문키 탐지 시 **차단**
- 허용 도메인(Allowlist) 검사, 5s 타임아웃/백오프, 레이트리밋/비용캡 적용

---

## 8) 프론트 UX 체크리스트
- 대시보드 상단: **Connection 선택**, 싱글/AB 토글, “프롬프트 작성” 버튼
- 에디터: Prompt/Parameters/Variables 탭 + **미리보기** + Lint + 단축키(Cmd/Ctrl+S, Cmd/Ctrl+Enter)
- 결과: **가공/원문 토글**, 메타 배지(모델/토큰/지연/비용), trace_id 복사
- 로그/트레이스: 워터폴, 단계별 메타, 실패 원인 hint
- GitLab 모달: 전역 재사용, 로딩/재시도/브랜치 선택, 성공 토스트(SHA)
- CSV 내보내기: 고정 컬럼 + UTC + 파라미터 해시 포함

---

## 9) 커서가 수정해야 할 부분 (Diff 지시)
1) **DB 선택 문구 수정**: "SQLite 기본" → **"PostgreSQL 기본, SQLite=로컬 개발"**
2) **v1 스코프 정리**: 평가 자동화/배치는 **v2 섹션으로 이동**
3) **MLflow 표기 낮춤**: 기본 저장소는 **Jido DB**, MLflow는 **옵션 미러링**
4) **스키마 문단 추가**: `executions`/`execution_steps`/`connections` 상세 표 포함
5) **Connections 문단 신설**: 마법사 흐름, Custom HTTP, JSONPath, 키 암호화/차단 규칙
6) **보안/듀얼 모드 섹션**: OFFLINE/ONLINE 스위치와 하드닝·마스킹 문구 추가
7) **라우팅 표 갱신**: 상기 10개 페이지 기준으로 파일/경로 명시
8) **API 문서 보강**: `/connections`, `/runs`, `/traces`, `/exports` 계약 추가
9) **로그/에러 표준**: JSON 로그 필드 + `{error_code, message, trace_id, hint}` 고정

---

## 10) PR 체크리스트(반드시 통과)
- OFFLINE_MODE=true에서 **egress=0** 확인(오프라인 테스트 잡 포함)
- 컨테이너: **비루트**, `read_only: true`, `cap_drop: [ALL]`, **internal network only**
- 키/시크릿: **이미지 미포함**, **서버측 암호화 저장**, Body/Headers 평문키 **차단**, 재표시 **금지**
- DB: 5 테이블 마이그 적용(`prompts/prompt_versions/executions/execution_steps/connections`), `executions.id == trace_id` 일관, **UTC timestamptz** 저장, 주요 인덱스 생성
- 로그: **JSON 구조** + **PII 마스킹**, `trace_id`로 전 구간 추적 가능, 표준 에러 포맷 `{error_code, message, trace_id, hint}` 준수
- 페이지: 10개 라우팅 연결, **CommitDialog 전역 모달** 동작, 접근성(포커스 링/단축키) 기본
- API: `/runs` 응답에 **tokens/latency/trace_id** 포함, `/connections`/`/traces`/`/exports` 계약 준수, **타임아웃/백오프** 기본값 적용
- 보안/네트워크: **Allowlist**(허용 도메인만), ONLINE 모드에서 **CORS/TLS/레이트리밋/비용캡** 설정
- 문서: **ADR/README/SECURITY/OPERATIONS** 업데이트, **5분 가이드** 통과
- CI: 빌드/테스트/SBOM(syft)/취약점 스캔(Trivy)/시크릿 스캔 통과

## 11) 바로 실행 과제(커서)
- `/docs/adr/*` 6건 생성 및 README에서 링크
- DB 마이그레이션 업데이트(5 테이블) & 샘플 시드
- `/connections` API: 생성/목록/테스트 + **서버측 암호화** 구현(재표시 금지)
- `/runs` 단건 실행: trace_id 생성, **executions/steps** 저장, 표준 에러 포맷 적용
- 프론트 라우트 10개 스캐폴딩 + **CommitDialog 전역 포털** 배선
- `Connections.New` 1~2단계(UI): Provider/키/붙여넣기 + 변수 자동 추출 + **테스트 호출**
- `Dashboard` 상단: **Connection 선택 드롭다운** + 실행 버튼 연결
- JSON 로거 필드 고정(`ts, level, trace_id, endpoint, model, tokens_in, tokens_out, latency_ms, status`) + 마스킹 필터
- CSV 내보내기: `/exports/csv` 엔드포인트 + 버튼/토스트
- 보안 설정: **Allowlist/레이트리밋/비용캡** 백엔드·UI 반영
- 에러 힌트 사전 작성(401/403/429/5xx) → 표준 에러에 매핑
- `TraceViewer` 워터폴 구현(단계별 latency/상태/메타)
- `History` 목록/상세 구현(이전 실행과 Diff 표시)
- CI 파이프라인: 오프라인 egress=0 테스트 잡 추가, SBOM/Trivy/시크릿 스캔

---

### 메모
- 시간은 **UTC 저장**, UI에서 현지 변환.
- 비용/토큰 표기는 추후 벤더별 정밀화 가능(현재는 usageMetadata 기반).
- 평가셋 전수/AB 자동평가는 **v2**에서 러너/큐 도입 후 진행.

