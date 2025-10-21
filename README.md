# 🧠 Jido - PromptOps Platform

**Jido**는 LLM 및 RAG 기반 서비스 개발을 위한 통합 프롬프트 관리 플랫폼입니다.

## 🎯 주요 기능

- **프롬프트 버전 관리**: GitLab 연동으로 체계적 버전 추적
- **A/B 테스트**: 동일 입력에 대한 다른 프롬프트/모델 결과 비교
- **평가 자동화**: RAGAS/LLM Grader로 자동 점수 계산
- **로그 통합 관리**: 실행, 응답, 지표, 비용 등을 중앙 관리
- **히스토리 뷰어**: 성능 추이 시각화 및 비교 분석

## 🏗️ 프로젝트 구조

```
jido/
├── backend/          # FastAPI 백엔드
├── frontend/         # React 프론트엔드
├── data/            # 데이터 및 로그
├── scripts/         # 유틸리티 스크립트
└── docs/           # 문서화
```

## 🚀 빠른 시작

### 1. 환경 설정

```bash
# 환경 변수 설정
cp env.example .env
# .env 파일에서 API 키 등 설정

# 백엔드 의존성 설치
cd backend
pip install -r requirements.txt

# 프론트엔드 의존성 설치
cd frontend
npm install
```

### 2. 개발 서버 실행

```bash
# 백엔드 서버 (포트 8000)
cd backend
uvicorn app.main:app --reload

# 프론트엔드 서버 (포트 3000)
cd frontend
npm run dev
```

### 3. Docker로 실행

```bash
# 모든 서비스 실행
docker-compose up

# PostgreSQL 포함 실행
docker-compose --profile postgres up
```

## 📚 API 문서

서버 실행 후 다음 URL에서 API 문서를 확인할 수 있습니다:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 🧩 주요 컴포넌트

### 백엔드 (FastAPI)

- **API**: 프롬프트 CRUD, 실행, 평가, 히스토리
- **Services**: LLM 호출, 평가 엔진, GitLab 연동
- **Database**: SQLite (향후 PostgreSQL 전환)

### 프론트엔드 (React + TypeScript)

- **Dashboard**: 프롬프트 관리 및 실행
- **Results**: A/B 테스트 결과 비교
- **Logs**: 실행 로그 및 히스토리
- **History**: 성능 추이 시각화

## 🔧 개발 가이드

### 데이터베이스 마이그레이션

```bash
cd backend
alembic upgrade head
```

### 테스트 실행

```bash
cd backend
pytest tests/
```

### 코드 포맷팅

```bash
# 백엔드
cd backend
black .
flake8 .

# 프론트엔드
cd frontend
npm run lint
```

## 📈 로드맵

- **v1.0**: 기본 프롬프트 실행 및 로그 저장
- **v1.1**: 평가 모듈 (RAGAS) 추가
- **v1.2**: A/B 테스트 UI 구현
- **v2.0**: 배치 실행 및 MLflow 연동
- **v3.0**: 통합 대시보드 및 API 오픈

## 🤝 기여하기

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 있습니다.

## 📞 지원

문제가 있거나 질문이 있으시면 이슈를 생성해 주세요.



