# Jido – 엔터프라이즈 정합성 보완 패치 지시서 (for Cursor)
> 목적: `enterprise_alignment_summary.md`와 ADR 반영 이후, 엔터프라이즈 기준에서 **누락되거나 미흡한 보안·감사·차단 요소**를 일괄 보완한다.  
> 사용: Cursor에서 이 파일을 열고 **섹션별로 복붙** → 커밋 메시지 규칙에 맞춰 PR 생성.

---

## 0) 적용 범위
- 레포 기준 디렉터리 예시
  - `docs/adr/`
  - `docs/API_SPEC.md`, `docs/DB_SCHEMA.md`, `docs/SECURITY.md`
  - `chatGPT/enterprise_alignment_summary.md`
  - `compose/` (`docker-compose.*.yml`)
  - `backend/` (FastAPI/LangGraph)
  - `frontend/`
- 모드: **OFFLINE / ONLINE** 듀얼 모드 모두.

---

## 1) 블로킹 수정 4종 (즉시 적용)
### 1-1) PowerShell 인코딩 (UTF-8 고정)
`chatGPT/enterprise_alignment_summary.md` 생성 스크립트의 인코딩을 UTF-8로 고정.
```powershell
# (fix) UTF-8로 저장
Set-Content -Path "chatGPT/enterprise_alignment_summary.md" -Encoding utf8 -Value @"
# 🏢 Jido 엔터프라이즈 기준 정합성 적용 요약
... (본문 동일) ...
"@
```
> 사유: `-Encoding Unicode`는 UTF-16LE로 Git/CI/에디터에서 깨짐 가능.

### 1-2) `/connections` 비밀키 저장 정책 명문화 + 구현 고도화
- 문서화: `docs/SECURITY.md` 및 `docs/API_SPEC.md`에 **단방향 재표시 금지**와 **Envelope Encryption** 명시.
- 구현 요지:
  - 앱 계층 **AES-GCM(256)** 로 암복호화, DB는 바이트만 보관.
  - 키 관리: **OFFLINE=파일 기반 키링**, **ONLINE=KMS(대체불가 시 HSM)**.
  - 키는 **런타임에만 메모리 로드**, 환경변수 직접 저장 금지.
- DB 제약(예시) – `docs/DB_SCHEMA.md` 및 마이그레이션에 추가:
```sql
ALTER TABLE connections
  ADD CONSTRAINT chk_enc_blob CHECK (octet_length(enc_blob) BETWEEN 64 AND 8192);
CREATE INDEX idx_connections_last_used ON connections(last_used_at);
```

### 1-3) Egress(외부 통신) 완전 차단 테스트
- 테스트용 Compose 추가: `compose/docker-compose.offline-test.yml`
```yaml
services:
  api:
    build: ../backend
    network_mode: "none"
    environment:
      - MODE=OFFLINE
    command: ["pytest","-q","tests/offline_smoke"]
```
- CI 파이프라인 단계 추가: **외부 호출 발생 시 실패** 기준 명시 (`curl`/DNS 시도 감지).

### 1-4) Export 레드랙션 강제
- `docs/API_SPEC.md`에 명시: **/exports/csv는 항상 마스킹 적용본만 제공**, 원문/시크릿/토큰 등 **민감 필드 포함 금지**.
- 백엔드 공통 레드랙터를 Export 경로에도 **강제 적용**.

---

## 2) 권장 개선 8종 (우선순위 高)
### 2-1) Trace ID 스펙 명문화
- 규정: **UUIDv7** 사용, 클라이언트 `X-Trace-Id` 미제공 시 서버 생성/주입.
- `docs/API_SPEC.md`에 글로벌 헤더 및 밸리데이션 규칙 추가.
```md
**Global Headers**
- `X-Trace-Id` (optional): 제공 시 유효성 검사 후 승계. 미제공 시 서버 생성.
```

### 2-2) 에러 표준 + 힌트 사전
- 포맷 유지: `{error_code, message, trace_id, hint}`
- 에러코드 테이블(예): `AUTH_401`, `FORBIDDEN_403`, `RATE_429`, `LLM_TIMEOUT`, `LLM_5XX`, `EXPORT_MASK_VIOLATION`
- 힌트 매핑 JSON 추가: `backend/config/error_hints.json`

### 2-3) DB 스키마 5종 확정
```sql
-- prompts
-- executions
-- execution_steps
-- connections
-- audit_logs
```
- 제약/인덱스/용량가드/UTC 기본 등 상세는 `docs/DB_SCHEMA.md`에 반영.

### 2-4) 레이트리밋 & 비용 캡 (서버/프론트 동시 강제)
- 서버: 사용자/IP 토큰버킷 + 월별 비용 상한 초과 시 하드 스톱.
- 프론트: 비용 캡 근접시 배너/토스트 + 실행 버튼 비활성화.

### 2-5) 컨테이너 하드닝 보강
- `security_opt: ["no-new-privileges:true", "seccomp:default"]`
- `ulimits`(nproc/nofile), `mem/cpu` 리밋, `drop NET_RAW`
- 헬스체크 `/healthz` 필수.

### 2-6) 로그 필드 고정 + 샘플
```json
{"ts":"2025-10-20T11:00:00Z","level":"info","trace_id":"01J9...","route":"/runs","model":"gpt-x","model_provider":"openai","tokens_in":512,"tokens_out":128,"latency_ms":842,"status":"success"}
```

### 2-7) Export/History 보존 정책
- 기본 90일, OFFLINE은 기관 정책 우선. 삭제는 **비가역**.

### 2-8) ADR 3종 추가
- `007-rate-limit-and-cost-cap.md`
- `008-secrets-and-key-rotation.md`
- `009-egress-control-and-network-policies.md`

---

## 3) 바로 복붙하는 패치 블록

### 3-A) API_SPEC 패치(에러·헤더·Export 규약)
```md
### Global Headers
- `X-Trace-Id` (optional): 클라이언트 제공 시 유효성 검사 후 승계. 미제공 시 서버가 UUIDv7 생성.

### Error Object
```json
{ "error_code": "RATE_429", "message": "Too many requests", "trace_id": "01J9...", "hint": "Wait 30s or contact admin." }
```

### CSV Export
- Export 결과는 **항상 마스킹 적용본**만 제공한다.
- 원문 본문/시크릿/키/토큰 등 민감 필드는 **포함 금지**.
```

### 3-B) Compose 하드닝(추가 옵션)
```yaml
services:
  api:
    user: "1000:1000"
    read_only: true
    cap_drop: [ "ALL" ]
    security_opt:
      - no-new-privileges:true
      - seccomp:default
    ulimits:
      nproc: 4096
      nofile: 65535
    healthcheck:
      test: ["CMD", "curl", "-fsS", "http://localhost:8000/healthz"]
      interval: 15s
      timeout: 3s
      retries: 5
```

### 3-C) 레이트리밋/비용캡 의사코드
```python
def guard(user_id, est_cost):
    if cost_month(user_id) + est_cost > COST_CAP:
        raise HTTPException(status_code=429, detail={"error_code":"COST_CAP","hint":"Monthly budget exceeded"})
    if not bucket_allow(user_id):
        raise HTTPException(status_code=429, detail={"error_code":"RATE_429","hint":"Too many requests"})
```

### 3-D) 로그 마스킹 유틸(공통)
```python
MASK_RULES = [
  (r"(?<=\\b\\d{3})-?\\d{2}-?\\d{4}\\b", "***"),  # 주민번호 유사
  (r"\\b\\d{2,4}-\\d{3,4}-\\d{4}\\b", "***"),     # 전화번호
  (r"\\b[\\w\\.-]+@[\\w\\.-]+\\.\\w+\\b", "***"), # 이메일
]
def mask(s: str):
    import re
    for pat, repl in MASK_RULES:
        s = re.sub(pat, repl, s)
    return s
```

---

## 4) CI 파이프라인 가이드(요지)
1) **offline-test** 잡: `compose/docker-compose.offline-test.yml`로 스모크 테스트(egress=0).  
2) **sbom/scan** 잡: SBOM 생성, Trivy/Secret scan.  
3) **unit/e2e** 잡: 마스킹·에러포맷·trace_id 규약 검증.  
4) 모든 잡 통과 시 MR 승인.

---

## 5) 커밋/PR 규칙
- 메시지: `feat(sec): enforce CSV export redaction` / `chore(ci): add offline egress test`  
- PR 템플릿 체크박스: 시크릿 커밋 없음 / 로그 마스킹 / OFFLINE 동작 확인.

---

## 6) 최종 체크리스트
- [ ] PowerShell UTF-8 인코딩 반영
- [ ] `/connections` 암호화(Envelope) + 문서화
- [ ] offline-test compose + CI 실패 기준
- [ ] Export 마스킹 강제
- [ ] UUIDv7 trace_id 규약 문서화
- [ ] 에러코드/힌트 매핑 추가
- [ ] DB 5종 스키마 제약 반영
- [ ] 레이트리밋/비용캡 서버·UI 동시 적용
- [ ] 컨테이너 하드닝(보강 옵션) 적용
- [ ] 보존/삭제 정책 문서화
- [ ] ADR 007/008/009 추가
