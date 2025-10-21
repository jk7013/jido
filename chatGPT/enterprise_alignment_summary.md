# 🏢 Jido 엔터프라이즈 기준 정합성 적용 요약

본 문서는 `cursor/jido_엔터프라이즈_기준_정합성_체크_수정_지시서_for_cursor.md` 지시서를 기반으로, 레포에 반영된 변경사항과 다음 과제를 요약합니다.

## ✅ 이번에 반영한 내용

### 1) ADR 6건 생성 (`docs/adr/`)

- 001-dual-mode.md: OFFLINE/ONLINE 듀얼 모드 원칙
- 002-db-choice.md: 기본 DB=PostgreSQL, SQLite=로컬 개발
- 003-tracing-model.md: executions + execution_steps 트레이싱 모델
- 004-logging-policy.md: stdout JSON 로그 + PII 마스킹
- 005-container-security.md: 비루트, read_only, cap_drop: [ALL]
- 006-release-profiles.md: dev/staging/prod 프로필

### 2) 문서 보강 (`docs/`)

- API_SPEC.md: /runs, /traces, /connections, /exports 계약 및 에러/로그 표준
- DB_SCHEMA.md: 5개 테이블 스키마/인덱스/규칙(UTC, UUID, jsonb)
- SECURITY.md: 듀얼 모드/하드닝/시크릿/감사 정책

### 3) 보안 하드닝 Compose

- docker-compose.override.yml: backend/postgres 내부 네트워크, read_only, cap_drop: [ALL], OFFLINE_MODE=true

## 🔁 변경 방향(원칙)

- DB 기본은 PostgreSQL, SQLite는 로컬만
- MLflow/Loki는 옵션 미러링(기본 저장소=Jido DB)
- 모든 요청 trace_id 발급, 응답에 X-Trace-Id
- 표준 에러 포맷: {error_code, message, trace_id, hint}
- 로그 최소 필드 고정: ts, level, trace_id, endpoint, model, tokens_in, tokens_out, latency_ms, status

## 📌 다음 실행 과제(To-Do)

- DB 마이그레이션(5 테이블) 및 샘플 시드
- /connections API: 생성/목록/테스트 + 서버측 암호화(재표시 금지)
- /runs 실행 API: trace_id 생성, executions/steps 저장, 에러 표준 적용
- 프론트 라우트(10개) 스캐폴딩 + 전역 CommitDialog 포털 배선
- Connections.New 1~2단계(UI): 키/붙여넣기/변수 추출/테스트 호출
- Dashboard 상단: Connection 선택 + 실행 버튼 연결
- JSON 로거 및 마스킹 필터 공통화
- /exports/csv 엔드포인트 및 버튼/토스트 연동
- Allowlist/레이트리밋/비용캡(백엔드·UI) 반영
- 에러 힌트 사전(401/403/429/5xx) 작성 및 매핑
- TraceViewer 워터폴, History 목록/상세 + Diff
- CI: 오프라인 egress=0 테스트, SBOM/Trivy/Secret scan

## 🔗 원본 지시서

- `cursor/jido_엔터프라이즈_기준_정합성_체크_수정_지시서_for_cursor.md`

본 요약은 ChatGPT가 프로젝트의 엔터프라이즈 기준을 빠르게 파악하고, 다음 액션을 체계적으로 진행할 수 있도록 합니다.
