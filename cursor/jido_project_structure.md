## 🧩 jido 프로젝트 구조 설계 지시서

### 🎯 설계 의도

jido는는 **LLM/RAG 프롬프트의 관리, 실행, 평가, 히스토리화**를 위한 내부 운영 플랫폼이다.
현재는 **버전 1 (기본 실행 구조)**만 구축하지만, **향후 배치 실행 / DB 확장 / MLflow 연동**까지 고려하여 아키텍처를 설계한다.

---

### 📁 프로젝트 구조 (Version 1 기준, 확장 대비 포함)

```bash
JIDO/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                     # FastAPI 엔트리포인트
│   │   ├── api/
│   │   │   ├── __init__.py
│   │   │   ├── prompts.py              # 프롬프트 CRUD 및 실행 API
│   │   │   ├── eval.py                 # 평가 관련 API (RAGAS 등)
│   │   │   ├── history.py              # 실행 이력 및 비교 API
│   │   │   ├── batch.py                # 향후 배치 실행용 API (V2)
│   │   │   └── logs.py                 # 로그 조회 API
│   │   ├── core/
│   │   │   ├── config.py               # 환경 변수 / 설정 관리
│   │   │   ├── router.py               # FastAPI 라우터 통합
│   │   │   └── scheduler.py            # 향후 배치 스케줄러 (APScheduler 등)
│   │   ├── db/
│   │   │   ├── base.py                 # SQLAlchemy 연결
│   │   │   ├── models.py               # Prompt, Log, Evaluation 등 ORM 정의
│   │   │   ├── crud.py                 # DB CRUD 로직
│   │   │   └── migrations/             # Alembic 마이그레이션 파일
│   │   ├── services/
│   │   │   ├── executor.py             # 프롬프트 실행 및 LLM 호출 로직
│   │   │   ├── evaluator.py            # 평가 모듈 (RAGAS, LLM Grader)
│   │   │   ├── gitlab_sync.py          # GitLab 연동 (버전 관리)
│   │   │   ├── mlflow_logger.py        # MLflow 로깅 (선택적 연동)
│   │   │   ├── history_manager.py      # 실행 이력 관리
│   │   │   └── batch_runner.py         # 향후 배치 실행 로직
│   │   ├── utils/
│   │   │   ├── logger.py               # 컬러 로그 / JSON pretty 출력
│   │   │   ├── file_io.py              # CSV, JSONL 입출력 유틸
│   │   │   ├── metrics.py              # 커스텀 평가 메트릭 계산
│   │   │   ├── timer.py                # 실행시간 측정 유틸
│   │   │   └── validation.py           # 입력값 검증 로직
│   ├── tests/
│   │   ├── test_prompt.py
│   │   ├── test_eval.py
│   │   ├── test_history.py
│   │   └── test_api.py
│   ├── requirements.txt
│   └── run_server.sh
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── PromptEditor.tsx
│   │   │   ├── ResultViewer.tsx
│   │   │   ├── LogTable.tsx
│   │   │   └── HistoryPanel.tsx
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Results.tsx
│   │   │   ├── Logs.tsx
│   │   │   ├── History.tsx
│   │   │   └── Batch.tsx
│   │   ├── hooks/
│   │   │   ├── useAPI.ts
│   │   │   ├── useFetch.ts
│   │   │   ├── useHistory.ts
│   │   │   └── useEvaluation.ts
│   │   ├── utils/
│   │   │   ├── format.ts
│   │   │   └── constants.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
│
├── data/
│   ├── examples/
│   ├── testsets/
│   ├── logs/
│   └── outputs/
│
├── scripts/
│   ├── run_batch.py
│   ├── migrate_db.py
│   ├── export_prompts.py
│   └── evaluate_all.py
│
├── docs/
│   ├── README.md
│   ├── ARCHITECTURE.md
│   ├── API_SPEC.md
│   ├── DB_SCHEMA.md
│   ├── PROMPT_TEMPLATE_GUIDE.md
│   └── CHANGELOG.md
│
├── .env
├── .gitignore
├── docker-compose.yml
└── README.md
```

---

### ⚙️ 설계 포인트

#### 1️⃣ 확장 대비 구조

- `services/` 디렉토리에 모든 비즈니스 로직을 모듈화해두면, **배치 / 히스토리 / 평가 로직**을 독립적으로 확장 가능.
- `core/scheduler.py`는 향후 배치 스케줄러(APScheduler 등) 추가를 위한 자리 확보.

#### 2️⃣ 히스토리 및 평가 대비

- `services/history_manager.py` → 실행 기록(DB + MLflow) 통합 저장.
- `frontend/pages/History.tsx` → 날짜별 프롬프트 결과 비교 및 diff 뷰 제공.

#### 3️⃣ 향후 배치 확장 대비

- `scripts/run_batch.py` + `core/scheduler.py` → 주기적 평가 실행 구조 고려.
- CLI 또는 FastAPI 배치 엔드포인트(`/api/batch/run`)로 호출 가능하게 설계.

#### 4️⃣ 데이터 흐름 예시

```
사용자 입력 → FastAPI(`/prompts/run`) → executor.py → LLM 호출
→ 결과 저장(DB + MLflow) → evaluator.py 평가 후 저장 → frontend 표시
```

#### 5️⃣ 문서화 전략

- `/docs/` 폴더에 각 모듈별 설계와 DB Schema 관리.
- CHANGELOG.md로 프롬프트/모델/버전 이력 기록.

---

### 🚀 다음 단계 제안

1. **Version 1**에서는 FastAPI + SQLite + React 기반 최소 실행 환경 구축.
2. 이후 버전에서 MLflow 및 GitLab 연동 추가.
3. `scheduler.py`와 `batch_runner.py`를 통해 주기적 평가 자동화.

---

> ⚡ 커서 작업 시 주의: 이 구조는 버전 1의 단순 기능 구현을 전제로 하되,
> 배치, DB 확장, GitLab/MLflow 연동까지 고려한 “미래 대비형” 디렉토리 구조다.
