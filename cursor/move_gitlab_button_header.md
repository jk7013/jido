## 🎯 작업 목표: GitLab 버튼을 실행 컨트롤 영역에서 상단 헤더로 이동

### 📁 대상 파일
- `/dashboard.html`
- `/components/header.html`

---

### ✅ 1. 기존 위치 제거
현재 `dashboard.html` 내 `실행 컨트롤` 또는 `.content` 블록 내부에 있는 GitLab 버튼 코드를 **완전히 제거**한다.

예시 (제거 대상):
```html
<button class="ghost">
  <img src="img/gitlab.svg" alt="GitLab" /> GitLab
</button>
```

---

### ✅ 2. GitLab 버튼을 공통 헤더(`components/header.html`)로 이동

헤더의 `<nav class="top-menu">` 내 마지막 버튼으로 아래 코드를 추가한다.

```html
<button class="ghost" onclick="window.open('https://gitlab.company.local/promptops', '_blank')">
  <img src="img/gitlab.svg" alt="GitLab" style="width:16px; vertical-align:middle; margin-right:4px;" />
  GitLab
</button>
```

위치는 다음과 같이 구성되어야 한다:
```html
<nav class="top-menu">
  <button class="ghost" onclick="location.href='dashboard.html'">대시보드</button>
  <button class="ghost" onclick="location.href='result_view.html'">결과 보기</button>
  <button class="ghost" onclick="location.href='log_view.html'">로그 보기</button>
  <button class="ghost" onclick="window.open('https://gitlab.company.local/promptops', '_blank')">
    <img src="img/gitlab.svg" alt="GitLab" style="width:16px; vertical-align:middle; margin-right:4px;" />
    GitLab
  </button>
</nav>
```

---

### ✅ 3. CSS 확인 (`css/jido-theme.css`)
GitLab 버튼은 다른 네비게이션 버튼들과 동일한 스타일을 사용해야 한다. 별도의 추가 스타일은 필요 없음.

```css
.top-menu button {
  font-size: 13px;
  padding: 6px 11px;
  color: var(--text);
}
```

---

### ✅ 4. 결과 확인 체크리스트
- [ ] 대시보드 페이지 내 실행 컨트롤 영역에서 GitLab 버튼이 사라짐
- [ ] GitLab 버튼이 모든 페이지 헤더 우측 끝에 고정됨
- [ ] 클릭 시 새 탭에서 GitLab 링크가 열림 (`target='_blank'` 정상 동작)
- [ ] 버튼 크기, 색상, hover 효과 등이 나머지 네비게이션 버튼들과 동일함

---

### 📦 작업 완료 후 커밋 메시지 예시
```
refactor: move GitLab button to global header
- removed from dashboard execution controls
- added to components/header.html
```