## 🎯 작업 목표: PromptOps 전체 페이지 헤더 통합 리팩터링

### 📁 대상 파일

- `/dashboard.html`
- `/result_view.html`
- `/log_view.html`

---

### ✅ 1. 공통 헤더 파일 생성

**파일 경로:** `components/header.html`

```html
<header>
  <h1>PromptOps</h1>
  <nav class="top-menu">
    <button class="ghost" onclick="location.href='dashboard.html'">
      대시보드
    </button>
    <button class="ghost" onclick="location.href='result_view.html'">
      결과 보기
    </button>
    <button class="ghost" onclick="location.href='log_view.html'">
      로그 보기
    </button>
    <button
      class="ghost"
      onclick="window.open('https://gitlab.company.local/promptops', '_blank')"
    >
      <img
        src="img/gitlab.svg"
        alt="GitLab"
        style="width:16px; vertical-align:middle; margin-right:4px;"
      />
      GitLab
    </button>
  </nav>
</header>
```

---

### ✅ 2. 각 HTML 페이지에서 공통 헤더 불러오기

모든 페이지(`dashboard.html`, `result_view.html`, `log_view.html`)의 `<body>` 최상단에 다음 코드 삽입.

```html
<div id="header-placeholder"></div>

<script>
  fetch("components/header.html")
    .then((res) => res.text())
    .then((html) => {
      document.getElementById("header-placeholder").innerHTML = html;
    });
</script>
```

- 반드시 `<main>`이나 `<div class="wrap">` 등 기존 컨텐츠 블록 **위쪽**에 배치할 것.
- `<header>` 태그는 직접 각 페이지에 작성하지 않음. 오직 `components/header.html`로부터 동적으로 로드.

---

### ✅ 3. 스타일 통합 (`css/jido-theme.css`)

아래 스타일을 추가하여 공통 헤더를 통일감 있게 표현.

```css
header {
  background: var(--panel);
  border-bottom: 1px solid var(--muted);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  position: sticky;
  top: 0;
  z-index: 100;
  padding: 18px 22px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.top-menu {
  display: flex;
  align-items: center;
  gap: 10px;
}

.top-menu button {
  font-size: 13px;
  padding: 6px 11px;
}
```

---

### ✅ 4. 페이지별 보조 UI 유지 원칙

| 페이지        | 헤더           | 보조 메뉴                                                                 |
| ------------- | -------------- | ------------------------------------------------------------------------- |
| **대시보드**  | 공통 헤더 포함 | 실행 컨트롤, 평가 옵션 등 기존 구조 유지                                  |
| **결과 보기** | 공통 헤더 포함 | 상단의 ‘실행 선택/이전/다음/글자 크기 조절/대시보드로 돌아가기’ 버튼 유지 |
| **로그 보기** | 공통 헤더 포함 | 상단 탭(RIN, RPC, QRY 등) 유지                                            |

> 각 페이지의 고유한 상단 버튼 그룹은 공통 헤더 아래쪽에 그대로 유지되어야 함.

---

### ✅ 5. 결과 확인 체크리스트

- [ ] 모든 페이지 상단에 동일한 PromptOps 헤더가 표시됨
- [ ] GitLab / 로그 보기 버튼이 항상 우측 상단에 존재
- [ ] 기존 기능(토글, 실행 버튼, 결과 비교 등)은 그대로 작동
- [ ] 페이지 이동 시 레이아웃 흔들림 없이 일관된 UX 유지

---

### 📦 작업 완료 후 커밋 메시지 예시

```
feat: unify header across all PromptOps pages (dashboard, result_view, log_view)
- added shared components/header.html
- applied dynamic header injection script
- updated jido-theme.css with header styling
```
