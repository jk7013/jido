# Jido Frontend View Renaming — Cursor Instructions (for Cursor)

> 목적: 현재 뷰 파일명을 **사용자 흐름 중심**으로 정리하고, 라우팅/내부 링크/타이틀을 일관되게 수정한다. 아래 절차를 **순서대로** 수행.

---

## 1) 범위
- 위치: `src/pages/`, `src/components/`
- 대상 파일(현재)
  - `src/pages/Dashboard.html`
  - `src/pages/ResultView.html`
  - `src/pages/SingleResultView.html`
  - `src/pages/LogView.html`
  - `src/pages/SingleLogView.html`
  - (옵션) `src/components/return-bar.html`

---

## 2) 파일명 매핑 (kebab-case, 소문자)
| From | To | 설명 |
|---|---|---|
| `Dashboard.html` | `overview.html` | 홈/대시보드. 평가 점수 카드 + 실행 패널 |
| `ResultView.html` | `results-ab.html` | A/B 결과 요약·비교 뷰 |
| `SingleResultView.html` | `results-single.html` | 싱글 결과 요약 뷰 |
| `LogView.html` | `logs-ab.html` | A/B 실행 로그 뷰 |
| `SingleLogView.html` | `logs-single.html` | 싱글 실행 로그 뷰 |
| (옵션) `return-bar.html` | (옵션) `back-bar.html` | 뒤로가기 바 — 의미 명확화 |

> 네이밍 원칙: **기능(명사)** + **모드(접미사)** → `results-*`, `logs-*` 계열로 묶임.

---

## 3) 리네임 명령
### Git Bash / WSL
```bash
git mv src/pages/Dashboard.html        src/pages/overview.html
git mv src/pages/ResultView.html       src/pages/results-ab.html
git mv src/pages/SingleResultView.html src/pages/results-single.html
git mv src/pages/LogView.html          src/pages/logs-ab.html
git mv src/pages/SingleLogView.html    src/pages/logs-single.html
# (옵션)
# git mv src/components/return-bar.html src/components/back-bar.html
```

### PowerShell (Windows)
```powershell
git mv src/pages/Dashboard.html        src/pages/overview.html
git mv src/pages/ResultView.html       src/pages/results-ab.html
git mv src/pages/SingleResultView.html src/pages/results-single.html
git mv src/pages/LogView.html          src/pages/logs-ab.html
git mv src/pages/SingleLogView.html    src/pages/logs-single.html
# (옵션) git mv src/components/return-bar.html src/components/back-bar.html
```

---

## 4) 라우트 & 내비게이션 업데이트
**권장 라우트**
- `/overview` — Jido Overview (홈/평가 점수 + 실행)
- `/results/ab` — A/B Results
- `/results/single` — Single Results
- `/logs/ab` — A/B Logs
- `/logs/single` — Single Logs

**수정 위치 체크리스트**
- `src/components/header.html` 내 내비게이션 링크 `href`
- `src/components/return-bar.html` 혹은 `back-bar.html` 의 뒤로가기 대상 경로
- 각 페이지 상단 브레드크럼/탭 링크

---

## 5) 페이지 메타(Title/H1) 정리
각 파일의 `<title>` 및 최상단 `<h1>` 을 아래로 수정.

| 파일 | `<title>` | `<h1>` |
|---|---|---|
| `overview.html` | `Jido · Overview` | `Overview` |
| `results-ab.html` | `Jido · A/B Results` | `A/B Results` |
| `results-single.html` | `Jido · Single Results` | `Single Results` |
| `logs-ab.html` | `Jido · A/B Logs` | `A/B Logs` |
| `logs-single.html` | `Jido · Single Logs` | `Single Logs` |

---

## 6) 레이아웃/공통 컴포넌트 연결 확인
- `header.html`에서 현재 경로에 따라 활성 탭 스타일 적용 여부 확인(선택된 메뉴에 `aria-current="page"` 등 설정).
- (옵션) `back-bar.html`로 변경 시 **import/include 경로** 일괄 반영.

---

## 7) 품질 체크리스트
- [ ] 모든 내부 링크가 200 OK로 이동되는가?
- [ ] 브레드크럼/탭/헤더 활성 상태가 올바른가?
- [ ] 페이지 리로드 시 라우팅 깨짐 없음(해시/스태틱 라우팅 기준 확인)
- [ ] A/B vs Single 뷰에서 **필드/열** 구성 차이가 명확한가?
- [ ] Lighthouse(또는 간단한 접근성 체크)에서 페이지 타이틀/헤딩 구조 경고 없음

---

## 8) 커밋/PR 규칙
- 커밋 메시지 예시
  - `refactor(ui): rename dashboard/results/logs views to kebab-case`
  - `chore(nav): update routes and titles for overview/results/logs`
- PR 템플릿 체크
  - [ ] 라우트/링크 전부 업데이트
  - [ ] 타이틀/H1 반영
  - [ ] (옵션) back-bar 리네임 반영

---

## 9) 후속 작업(선택)
- `/overview` 상단에 **실행 모드 토글(AB/Single)** 추가 후, 선택에 따라 **CTA 버튼 링크**를 `/results/*` 또는 `/logs/*` 로 분기.
- 결과/로그 테이블 컬럼 키를 정규화(`mode`, `trace_id`, `latency_ms`, `tokens_in/out` 등)하여 두 페이지군 간 UI 재사용성 확보.
