# 요청: 실행 컨트롤 라인에 GitLab 버튼 추가

## 요구사항

1. `.exec-controls` 내부에 GitLab 버튼을 추가해줘.
2. 토글 스위치와 실행 버튼들은 왼쪽/가운데 정렬, GitLab 버튼은 **오른쪽 끝** 고정.
3. 토글 상태(Single/A·B)에 따라 위치나 표시가 변하지 않아야 함.
4. 버튼은 `ghost` 스타일을 사용하고, GitLab 아이콘(`img/gitlab.svg`)과 텍스트를 나란히 표시.
5. hover 시 기존 `ghost` 버튼의 시안빛 glow 효과와 동일한 스타일 적용.
6. 클릭 시 새 탭(`target="_blank"`)으로 `https://gitlab.company.local/promptops` 열기.

## 참고 예시

```html
<div class="exec-controls">
  <div class="toggle-container">…</div>
  <div class="control-buttons">…</div>
  <div class="gitlab-link">
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
  </div>
</div>
```

## 참고 CSS

```css
.exec-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
  gap: 10px;
}

.control-buttons {
  display: flex;
  gap: 8px;
}
.gitlab-link button {
  display: flex;
  align-items: center;
  gap: 4px;
}
```

## 기대 결과

- GitLab 버튼은 항상 오른쪽 고정 (싱글/AB 모드 전환과 무관)
- 전체 실행 컨트롤 라인이 한 줄로 정렬되어 UI 일관성 유지
