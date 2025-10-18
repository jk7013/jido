## 🧱 GitLab Commit Dialog 개선 지시서 (Jido)

### 🎯 목적
현재 구현된 `Commit to GitLab` 모달의 UI/UX를 개선하여  
**Jido 대시보드 전체 톤앤매너와 개발자 친화적인 인터랙션**을 강화한다.

---

### 🧩 개선 포인트 요약
| 구분 | 항목 | 개선 내용 |
|------|------|-----------|
| 1 | 시각 계층 | 라벨·입력칸 대비 강화, 필드 간 여백 조정 |
| 2 | UX 피드백 | 커밋 중 로딩 상태 및 완료 토스트 추가 |
| 3 | 단축키 | `Ctrl + Enter` 커밋 실행 / `ESC` 닫기 |
| 4 | 버튼 정렬 | Secondary 버튼 투명화, Primary 블루 톤 통일 |
| 5 | 브랜치 표시 | “main” 옆에 🔽 아이콘 추가 (드롭다운 확장 대비) |
| 6 | 마이크로카피 | Placeholder 문구를 구체적이고 행동 유도형으로 수정 |

---

### 🧱 상세 지시

#### 1️⃣ 시각적 계층
```tsx
<label className="text-xs text-gray-400 mb-1 block">커밋 메시지</label>
<Input className="mb-4" placeholder="feat: update RAG prompt version (예: improved evaluation prompt)" autoFocus />

<label className="text-xs text-gray-400 mb-1 block">설명 (선택)</label>
<Textarea placeholder="변경 이유나 세부 수정사항을 간단히 적어주세요." />

<div className="flex items-center justify-between text-sm text-gray-500 mt-4 bg-gray-800/50 px-3 py-2 rounded">
  <span>Branch</span>
  <div className="flex items-center gap-1">
    <code className="bg-gray-700 px-2 py-1 rounded text-gray-300">main</code>
    <ChevronDown className="w-3 h-3 text-gray-500" /> {/* 향후 드롭다운 전환 대비 */}
  </div>
</div>
```

---

#### 2️⃣ 커밋 실행 UX
- **버튼 클릭 시**:
  - `커밋` 버튼 → `disabled` + `spinner` 표시 (`<Loader2 className="animate-spin" />`)
- **성공 시**:
  - `toast.success("✅ Commit pushed to GitLab")`
  - 모달 자동 닫기 (`setOpen(false)`)
- **실패 시**:
  - `toast.error("❌ Commit failed. Please check GitLab token or branch.")`

---

#### 3️⃣ 단축키 지원
```tsx
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.ctrlKey && e.key === 'Enter') handleCommit()
    if (e.key === 'Escape') setOpen(false)
  }
  window.addEventListener('keydown', handleKeyDown)
  return () => window.removeEventListener('keydown', handleKeyDown)
}, [])
```

---

#### 4️⃣ 버튼 스타일
```tsx
<DialogFooter className="border-t border-gray-800 pt-4">
  <Button variant="ghost" onClick={() => setOpen(false)}>
    취소
  </Button>
  <Button
    variant="primary"
    className="bg-sky-600 hover:bg-sky-500 text-white"
    onClick={handleCommit}
    disabled={isLoading}
  >
    {isLoading ? <Loader2 className="animate-spin w-4 h-4" /> : '커밋'}
  </Button>
</DialogFooter>
```

---

#### 5️⃣ 로딩 및 토스트 피드백
```tsx
const [isLoading, setIsLoading] = useState(false)

const handleCommit = async () => {
  setIsLoading(true)
  try {
    await commitToGitLab() // API 호출
    toast.success('✅ Commit pushed to GitLab')
    setOpen(false)
  } catch (error) {
    toast.error('❌ Commit failed.')
  } finally {
    setIsLoading(false)
  }
}
```

---

#### 6️⃣ 스타일 일관성
- Dialog 배경: `bg-[#1B1E24]`
- Input/textarea 배경: `bg-[#2A2E36]`
- Text color: `text-gray-200`
- Font size: `sm` / line-height `1.4`
- Transition: `ease-in-out duration-150`  
- Dialog 진입 시 `scale-95 → scale-100`, opacity 0→1 애니메이션

---

### ✅ 최종 목표
- 커밋 플로우를 **단축키 + 피드백 + 시각 안정성**으로 정제.
- 시각적 완성도는 유지하되, 개발자 중심 UX에 초점.
- 전체 톤은 **Jido 대시보드의 미니멀 다크 UI** 기준으로 맞춤.