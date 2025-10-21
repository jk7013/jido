# 🤖 ChatGPT와의 소통 가이드

## 📋 이 문서의 목적

이 문서는 ChatGPT와의 효율적인 소통을 위해 작성되었습니다. ChatGPT가 Jido 프로젝트의 맥락을 이해하고 적절한 코드 구현이나 문제 해결을 도와줄 수 있도록 필요한 모든 정보를 제공합니다.

## 🎯 ChatGPT에게 전달할 핵심 정보

### 1. 프로젝트 개요

- **프로젝트명**: Jido - PromptOps Platform
- **목적**: LLM 및 RAG 기반 서비스 개발을 위한 통합 프롬프트 관리 플랫폼
- **주요 기능**: 프롬프트 버전 관리, A/B 테스트, 평가 자동화, 로그 통합 관리, 히스토리 뷰어

### 2. 기술 스택

- **백엔드**: FastAPI + SQLAlchemy + SQLite
- **프론트엔드**: React + TypeScript + Vite + Tailwind CSS
- **평가**: RAGAS + LLM Grader
- **버전 관리**: GitLab API
- **실험 추적**: MLflow
- **컨테이너**: Docker + Docker Compose

### 3. 프로젝트 구조

```
jido/
├── backend/          # FastAPI 백엔드
├── frontend/         # React 프론트엔드
├── data/            # 데이터 저장소
├── scripts/         # 유틸리티 스크립트
├── docs/            # 문서화
├── cursor/          # 설계 문서
└── chatGPT/         # ChatGPT 소통용 문서
```

## 🔧 현재 개발 상태

### ✅ 완료된 작업

1. **프로젝트 구조 설계 및 생성**
2. **기존 HTML/CSS/JS 파일들 정리 및 이동**
3. **환경 설정 파일 생성**
4. **프론트엔드 설정 파일 생성**

### 🔄 진행 중인 작업

- 백엔드 FastAPI 구현 준비

### 📋 예정된 작업

- 백엔드 FastAPI 메인 앱 구현
- 데이터베이스 모델 정의
- API 라우터 구현
- 서비스 로직 구현
- 프론트엔드 React 컴포넌트 구현

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

## 🚀 다음 단계 구현 가이드

### 1. 백엔드 FastAPI 메인 앱 구현

```python
# backend/app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import prompts, eval, history, logs
from app.core.config import settings

app = FastAPI(title="Jido API", version="1.0.0")

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 라우터 등록
app.include_router(prompts.router, prefix="/api/prompts", tags=["prompts"])
app.include_router(eval.router, prefix="/api/eval", tags=["evaluation"])
app.include_router(history.router, prefix="/api/history", tags=["history"])
app.include_router(logs.router, prefix="/api/logs", tags=["logs"])
```

### 2. 데이터베이스 모델 정의

```python
# backend/app/db/models.py
from sqlalchemy import Column, Integer, String, DateTime, Text, Float, Boolean
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Prompt(Base):
    __tablename__ = "prompts"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    content = Column(Text)
    version = Column(String)
    created_at = Column(DateTime)
    updated_at = Column(DateTime)
    is_active = Column(Boolean, default=True)
```

### 3. API 라우터 구현

- **프롬프트 CRUD**: 생성, 조회, 수정, 삭제
- **실행 API**: 프롬프트 실행 및 결과 저장
- **평가 API**: RAGAS 연동 평가
- **히스토리 API**: 실행 이력 조회

## 💡 ChatGPT에게 요청할 때 참고사항

### 1. 프로젝트 맥락 제공

- "Jido 프로젝트의 백엔드 FastAPI 구현을 도와주세요"
- "기존 HTML 파일들을 React 컴포넌트로 변환하는 방법을 알려주세요"
- "RAGAS 연동을 위한 평가 API를 구현해주세요"

### 2. 구체적인 요청

- "FastAPI + SQLAlchemy를 사용한 프롬프트 CRUD API를 구현해주세요"
- "React + TypeScript로 대시보드 컴포넌트를 만들어주세요"
- "Docker Compose로 개발 환경을 설정해주세요"

### 3. 기존 파일들 참조

- "기존 `Dashboard.html`을 React 컴포넌트로 변환해주세요"
- "`jido-theme.css`의 스타일을 Tailwind CSS로 변환해주세요"
- "`gitlab-dialog.js`의 기능을 React 훅으로 구현해주세요"

## 📚 관련 문서들

### 설계 문서 (cursor/)

- `jido_project_structure.md`: 프로젝트 구조 설계
- `promptops_project_overview.md`: 프로젝트 개요
- `ui_polish_and_log_nav.md`: UI 설계
- `gitlab_commit_dialog_design.md`: GitLab 연동 설계

### ChatGPT 소통용 문서 (chatGPT/)

- `project_overview.md`: 프로젝트 전체 개요
- `development_status.md`: 개발 상태 및 진행률
- `chatgpt_communication_guide.md`: 이 문서

## 🎯 ChatGPT와의 소통 예시

### 좋은 요청 예시

```
"Jido 프로젝트의 백엔드 FastAPI 구현을 도와주세요.
프로젝트 구조는 chatGPT/project_overview.md를 참고하고,
기존 HTML 파일들은 frontend/src/pages/에 있습니다.
FastAPI + SQLAlchemy를 사용해서 프롬프트 CRUD API를 구현해주세요."
```

### 나쁜 요청 예시

```
"FastAPI API 만들어줘"
```

## 🔄 지속적인 업데이트

이 문서는 프로젝트 진행에 따라 지속적으로 업데이트됩니다:

- 새로운 기능 추가 시
- 기존 파일 변경 시
- 개발 상태 변경 시
- 새로운 설계 문서 추가 시

---

_이 문서는 ChatGPT와의 효율적인 소통을 위해 작성되었습니다._
