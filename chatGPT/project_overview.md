# 🧠 Jido - PromptOps Platform 프로젝트 개요

## 📋 프로젝트 소개

**Jido**는 LLM 및 RAG 기반 서비스 개발을 위한 통합 프롬프트 관리 플랫폼입니다. 프롬프트 버전 관리, A/B 테스트, 평가 자동화, 로그 통합 관리, 히스토리 뷰어 등의 기능을 제공합니다.

## 🏗️ 프로젝트 구조

```
jido/
├── backend/                    # FastAPI 백엔드
│   ├── app/
│   │   ├── api/               # API 라우터
│   │   │   ├── __init__.py
│   │   │   ├── prompts.py     # 프롬프트 CRUD 및 실행 API
│   │   │   ├── eval.py        # 평가 관련 API (RAGAS 등)
│   │   │   ├── history.py     # 실행 이력 및 비교 API
│   │   │   ├── batch.py       # 향후 배치 실행용 API (V2)
│   │   │   └── logs.py        # 로그 조회 API
│   │   ├── core/              # 설정 및 라우터
│   │   │   ├── config.py      # 환경 변수 / 설정 관리
│   │   │   ├── router.py      # FastAPI 라우터 통합
│   │   │   └── scheduler.py   # 향후 배치 스케줄러 (APScheduler 등)
│   │   ├── db/                # 데이터베이스 모델
│   │   │   ├── base.py        # SQLAlchemy 연결
│   │   │   ├── models.py      # Prompt, Log, Evaluation 등 ORM 정의
│   │   │   ├── crud.py        # DB CRUD 로직
│   │   │   └── migrations/    # Alembic 마이그레이션 파일
│   │   ├── services/          # 비즈니스 로직
│   │   │   ├── executor.py    # 프롬프트 실행 및 LLM 호출 로직
│   │   │   ├── evaluator.py   # 평가 모듈 (RAGAS, LLM Grader)
│   │   │   ├── gitlab_sync.py # GitLab 연동 (버전 관리)
│   │   │   ├── mlflow_logger.py # MLflow 로깅 (선택적 연동)
│   │   │   ├── history_manager.py # 실행 이력 관리
│   │   │   └── batch_runner.py # 향후 배치 실행 로직
│   │   ├── utils/             # 유틸리티
│   │   │   ├── logger.py      # 컬러 로그 / JSON pretty 출력
│   │   │   ├── file_io.py     # CSV, JSONL 입출력 유틸
│   │   │   ├── metrics.py     # 커스텀 평가 메트릭 계산
│   │   │   ├── timer.py       # 실행시간 측정 유틸
│   │   │   └── validation.py  # 입력값 검증 로직
│   │   ├── __init__.py
│   │   └── main.py            # FastAPI 엔트리포인트
│   ├── tests/                 # 테스트
│   │   ├── test_prompt.py
│   │   ├── test_eval.py
│   │   ├── test_history.py
│   │   └── test_api.py
│   ├── requirements.txt       # Python 의존성
│   ├── Dockerfile            # 백엔드 컨테이너
│   └── run_server.sh
├── frontend/                   # React 프론트엔드
│   ├── src/
│   │   ├── components/        # React 컴포넌트
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── PromptEditor.tsx
│   │   │   ├── ResultViewer.tsx
│   │   │   ├── LogTable.tsx
│   │   │   ├── HistoryPanel.tsx
│   │   │   ├── header.html           # 기존 HTML 헤더 컴포넌트
│   │   │   ├── return-bar.html        # 기존 HTML 리턴바 컴포넌트
│   │   │   └── gitlab-commit-dialog.html # 기존 HTML GitLab 다이얼로그
│   │   ├── pages/             # 페이지 컴포넌트
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Results.tsx
│   │   │   ├── Logs.tsx
│   │   │   ├── History.tsx
│   │   │   ├── Batch.tsx
│   │   │   ├── Dashboard.html         # 기존 HTML 대시보드
│   │   │   ├── ResultView.html        # 기존 HTML 결과 뷰
│   │   │   ├── SingleResultView.html  # 기존 HTML 싱글 결과 뷰
│   │   │   ├── LogView.html           # 기존 HTML 로그 뷰
│   │   │   └── SingleLogView.html     # 기존 HTML 싱글 로그 뷰
│   │   ├── hooks/             # 커스텀 훅
│   │   │   ├── useAPI.ts
│   │   │   ├── useFetch.ts
│   │   │   ├── useHistory.ts
│   │   │   └── useEvaluation.ts
│   │   ├── utils/             # 유틸리티
│   │   │   ├── format.ts
│   │   │   ├── constants.ts
│   │   │   └── gitlab-dialog.js       # 기존 JavaScript GitLab 다이얼로그
│   │   ├── styles/            # CSS 스타일
│   │   │   └── jido-theme.css         # 기존 CSS 테마
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── public/                # 정적 파일
│   │   └── gitlab.svg         # 기존 GitLab 아이콘
│   ├── package.json           # Node.js 의존성
│   ├── vite.config.ts         # Vite 설정
│   │   ├── tsconfig.json      # TypeScript 설정
│   │   ├── tailwind.config.js # Tailwind CSS 설정
│   │   ├── postcss.config.js  # PostCSS 설정
│   │   ├── .eslintrc.cjs      # ESLint 설정
│   │   └── Dockerfile         # 프론트엔드 컨테이너
├── data/                      # 데이터 저장소
│   ├── examples/              # 예제 데이터
│   ├── testsets/              # 테스트 데이터셋
│   ├── logs/                  # 실행 로그
│   └── outputs/               # 결과 파일
├── scripts/                   # 유틸리티 스크립트
│   ├── run_batch.py
│   ├── migrate_db.py
│   ├── export_prompts.py
│   └── evaluate_all.py
├── docs/                      # 문서화
│   ├── README.md
│   ├── ARCHITECTURE.md
│   ├── API_SPEC.md
│   ├── DB_SCHEMA.md
│   ├── PROMPT_TEMPLATE_GUIDE.md
│   └── CHANGELOG.md
├── cursor/                    # 설계 문서
│   ├── jido_project_structure.md
│   ├── promptops_project_overview.md
│   ├── gitlab_commit_dialog_design.md
│   ├── gitlab_commit_dialog_improvement.md
│   ├── ui_polish_and_log_nav.md
│   ├── unified_header_refactor.md
│   ├── add_gitlab_button.md
│   └── move_gitlab_button_header.md
├── chatGPT/                   # ChatGPT 소통용 문서
│   └── project_overview.md    # 이 파일
├── docker-compose.yml         # Docker Compose 설정
├── env.example               # 환경 변수 예시
├── .gitignore               # Git 무시 파일
└── README.md                 # 프로젝트 설명
```

## 🎯 주요 기능

### 1. 프롬프트 관리

- **버전 관리**: GitLab 연동으로 체계적 버전 추적
- **A/B 테스트**: 동일 입력에 대한 다른 프롬프트/모델 결과 비교
- **실시간 실행**: 프롬프트 즉시 실행 및 결과 확인

### 2. 평가 자동화

- **RAGAS 연동**: 자동 평가 메트릭 계산
- **LLM Grader**: 커스텀 평가 로직
- **배치 평가**: 대량 데이터 자동 평가

### 3. 로그 통합 관리

- **실행 로그**: 프롬프트 실행 기록
- **응답 로그**: LLM 응답 내용
- **지표 로그**: 성능 메트릭
- **비용 로그**: API 사용량 및 비용

### 4. 히스토리 뷰어

- **성능 추이**: 시간별 성능 변화 시각화
- **비교 분석**: 버전별 성능 비교
- **트렌드 분석**: 장기적 성능 트렌드

## 🔧 기술 스택

### 백엔드

- **FastAPI**: 웹 프레임워크
- **SQLAlchemy**: ORM
- **SQLite**: 데이터베이스 (향후 PostgreSQL 전환)
- **RAGAS**: 평가 프레임워크
- **MLflow**: 실험 추적
- **GitLab API**: 버전 관리

### 프론트엔드

- **React**: UI 라이브러리
- **TypeScript**: 타입 안전성
- **Vite**: 빌드 도구
- **Tailwind CSS**: 스타일링
- **React Query**: 데이터 페칭
- **Recharts**: 차트 라이브러리

### 인프라

- **Docker**: 컨테이너화
- **Docker Compose**: 멀티 컨테이너 관리
- **GitHub**: 버전 관리
- **GitLab**: 프롬프트 버전 관리

## 📁 기존 파일들의 역할

### HTML 파일들 (frontend/src/pages/)

- **Dashboard.html**: 메인 대시보드 페이지
- **ResultView.html**: A/B 테스트 결과 비교 페이지
- **SingleResultView.html**: 단일 프롬프트 결과 페이지
- **LogView.html**: 로그 뷰어 페이지 (A/B 모드)
- **SingleLogView.html**: 로그 뷰어 페이지 (싱글 모드)

### CSS 파일들 (frontend/src/styles/)

- **jido-theme.css**: 전체 프로젝트 테마 스타일
  - 다크 테마 색상 정의
  - 컴포넌트 스타일링
  - 반응형 레이아웃
  - 애니메이션 효과

### JavaScript 파일들 (frontend/src/utils/)

- **gitlab-dialog.js**: GitLab 커밋 다이얼로그 기능
  - 다이얼로그 열기/닫기
  - 커밋 메시지 처리
  - 키보드 단축키
  - 토스트 알림

### HTML 컴포넌트들 (frontend/src/components/)

- **header.html**: 공통 헤더 컴포넌트
- **return-bar.html**: 로그 뷰에서 사용하는 리턴 네비게이션
- **gitlab-commit-dialog.html**: GitLab 커밋 다이얼로그 HTML

### 이미지 파일들 (frontend/public/)

- **gitlab.svg**: GitLab 아이콘

## 🚀 개발 상태

### 완료된 작업

1. ✅ 프로젝트 구조 설계 및 생성
2. ✅ 기존 HTML/CSS/JS 파일들을 새로운 구조로 정리
3. ✅ Docker 설정 완료
4. ✅ 환경 설정 파일 생성
5. ✅ 프론트엔드 설정 파일 생성 (Vite, TypeScript, Tailwind, ESLint)

### 진행 중인 작업

- 🔄 백엔드 FastAPI 구현 준비

### 예정된 작업

- 📋 백엔드 FastAPI 메인 앱 구현
- 📋 데이터베이스 모델 정의
- 📋 API 라우터 구현
- 📋 서비스 로직 구현
- 📋 프론트엔드 React 컴포넌트 구현

## 💡 ChatGPT와의 소통 가이드

이 문서는 ChatGPT와의 소통을 위한 프로젝트 개요입니다. ChatGPT에게 다음과 같은 정보를 제공합니다:

1. **프로젝트 구조**: 전체 디렉토리 구조와 각 파일의 역할
2. **기능 설명**: 주요 기능과 기술 스택
3. **기존 파일들**: 현재까지 구현된 HTML/CSS/JS 파일들의 역할
4. **개발 상태**: 완료된 작업과 예정된 작업

ChatGPT는 이 정보를 바탕으로 프로젝트의 맥락을 이해하고 적절한 코드 구현이나 문제 해결을 도와줄 수 있습니다.

## 🔗 관련 문서

- **설계 문서**: `cursor/` 디렉토리의 각종 설계 문서들
- **프로젝트 구조**: `cursor/jido_project_structure.md`
- **프로젝트 개요**: `cursor/promptops_project_overview.md`
- **UI 설계**: `cursor/ui_polish_and_log_nav.md`
- **GitLab 연동**: `cursor/gitlab_commit_dialog_design.md`

---

_이 문서는 ChatGPT와의 효율적인 소통을 위해 작성되었습니다._
