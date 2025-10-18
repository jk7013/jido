## 🎯 작업 목표: UI 전면 개선 및 로그뷰 내 이동 기능 추가

---

### 📁 대상 파일
- `/components/header.html`
- `/components/return-bar.html` (신규)
- `/css/jido-theme.css`
- `/pages/log_view.html`

---

## ✅ 1. 공통 헤더 유지 및 GitLab 버튼 정렬 개선

`components/header.html`에서 `.top-menu` 구조는 유지하되, 다음 코드로 정리한다:

```html
<header>
  <h1>PromptOps</h1>
  <nav class="top-menu">
    <button class="ghost" onclick="location.href='dashboard.html'">대시보드</button>
    <button class="ghost" onclick="location.href='result_view.html'">결과 보기</button>
    <button class="ghost" onclick="location.href='log_view.html'">로그 보기</button>
    <button class="ghost" onclick="window.open('https://gitlab.company.local/promptops', '_blank')">
      <img src="img/gitlab.svg" alt="GitLab" style="width:16px; vertical-align:middle; margin-right:4px;" />
      GitLab
    </button>
  </nav>
</header>
```

---

## ✅ 2. 로그 뷰 전용 돌아가기 바 추가

새 파일 생성: `/components/return-bar.html`

```html
<div class="return-bar">
  <button onclick="location.href='result_view.html'">결과 보기</button>
  <button onclick="location.href='dashboard.html'">대시보드</button>
</div>
```

`/pages/log_view.html`의 상단 `<body>` 내부 첫 부분에 아래 코드 추가:
```html
<div id="return-container"></div>
<script>
  fetch('../components/return-bar.html')
    .then(r => r.text())
    .then(html => document.getElementById('return-container').innerHTML = html);
</script>
```

---

## ✅ 3. CSS 수정 — jido-theme.css에 추가

### (1) 헤더 및 네비게이션
```css
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--panel);
  padding: 16px 22px;
  border-bottom: 1px solid var(--muted);
}

.top-menu {
  display: flex;
  align-items: center;
  gap: 10px;
}

.top-menu button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 13px;
  padding: 6px 12px;
}
```

### (2) 로그뷰 전용 돌아가기 바
```css
.return-bar {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  background: var(--panel);
  border-bottom: 1px solid var(--muted);
  padding: 10px 20px;
}
```

---

## ✅ 4. 미세 튜닝 — 전체 페이지 공통 개선 사항

### (1) 배지/칩 통일
```css
.pill {
  line-height: 22px;
  height: 22px;
  padding: 0 8px;
  font-size: 12px;
}
```

### (2) 폼 수직 리듬 정렬
```css
label { margin: 8px 0 6px; }
input[type=text], textarea, select { margin-top: 0; }
.form-row + .form-row { margin-top: 12px; }
```

### (3) 카드 헤더 대비 강화
```css
.panel > header { border-bottom: 1px solid #263046; }
```

### (4) 결과보기 상단 줄바꿈 방지
```css
.result-view header .right { flex-wrap: nowrap; gap: 8px; }
.result-view header select { min-width: 300px; }
.result-view header input[type=range] { width: 120px; }
```

### (5) 내부 패딩 통일
```css
.panel .content { padding: 14px 14px 18px; }
```

### (6) 탭 접근성 강화
```css
.tabs button {
  padding: 8px 12px;
  border-radius: 8px;
  outline: 0;
}
.tabs button:focus-visible {
  box-shadow: 0 0 0 2px rgba(139,233,253,.35);
}
.tabs button[aria-selected="true"] {
  background: #141b2a;
  border: 1px solid #2a3550;
}
```

### (7) JSON 코드블럭 UX 개선
```html
<button class="ghost" onclick="navigator.clipboard.writeText(document.querySelector('#logA').innerText)">복사</button>
<pre id="logA">...</pre>
```

```css
pre { position: relative; }
pre button.ghost { position: absolute; top: 6px; right: 6px; }
```

### (8) 포커스/키보드 내비게이션 개선
```css
button:focus-visible, .toggle-switch:focus-visible {
  outline: 0;
  box-shadow: 0 0 0 2px rgba(139,233,253,.35);
}
```

### (9) 빈 상태(Empty state) 메시지 통일
```css
.empty {
  color: #9fb0c8;
  display: flex;
  align-items: center;
  gap: 8px;
}
.empty::before {
  content: "•";
  color: var(--accent);
  font-size: 18px;
}
```

---

## ✅ 5. 확인 체크리스트
- [ ] 헤더, 로그뷰, 결과뷰 레이아웃 균형 확인
- [ ] GitLab 버튼 및 네비게이션 정렬 정상
- [ ] 로그뷰 상단에서 대시보드/결과보기로 이동 가능
- [ ] 배지, 카드, 폼 간격 일관성 유지
- [ ] 키보드 포커스 및 Empty state 표시 정상 작동

---

### 🧾 커밋 메시지 예시
```
style: polish PromptOps UI + add log return-bar navigation
- unified spacing, badges, and header styles
- added return-bar to log view for quick navigation
```

