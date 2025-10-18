## 🧱 GitLab Commit Dialog 설계 지시서

### 🎯 목적
PromptOps 화면 상단의 **GitLab 버튼을 클릭하면 커밋 메시지를 입력할 수 있는 모달(Dialog)** 이 나타나도록 구현한다. 
이 기능은 사용자가 수정한 프롬프트나 설정을 GitLab에 바로 커밋할 수 있게 하여, **버전 관리의 흐름을 자연스럽게 UI에 녹여내는 것**이 목표다.

---

### 🧩 화면 컨셉
- **형태:** Modal Dialog (shadcn/ui 기반)
- **톤앤매너:** PromptOps의 전체 톤에 맞춰 **정갈하고 실무적인 미니멀 UI**
- **색감:** Header는 살짝 톤다운된 블루/그레이, 버튼은 Primary 대비로 명확히 구분
- **애니메이션:** 부드러운 Fade + Scale 트랜지션 (Radix 기반 기본 모션 사용)

---

### 🪟 UI 구성

#### 1️⃣ 트리거 버튼 (헤더 영역)
```tsx
<Button variant="outline" onClick={() => setOpen(true)}>
  <GitBranch className="w-4 h-4 mr-2" /> Commit to GitLab
</Button>
```

- 위치: 헤더 우측 (기존 GitLab 버튼 대체)
- 역할: 클릭 시 모달 오픈 (`open` 상태 true)

---

#### 2️⃣ Dialog 컴포넌트 구조
```tsx
<Dialog open={open} onOpenChange={setOpen}>
  <DialogContent className="max-w-md">
    <DialogHeader>
      <DialogTitle>Commit to GitLab</DialogTitle>
      <DialogDescription>
        변경된 프롬프트나 설정을 GitLab에 커밋하세요.
      </DialogDescription>
    </DialogHeader>

    <div className="space-y-4">
      <Input placeholder="feat: update RAG prompt version" autoFocus />
      <Textarea placeholder="설명 (선택)" />
      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>Branch</span>
        <code className="bg-gray-100 px-2 py-1 rounded">main</code>
      </div>
    </div>

    <DialogFooter>
      <Button variant="secondary" onClick={() => setOpen(false)}>취소</Button>
      <Button variant="primary" onClick={handleCommit}>커밋</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

---

### ⚙️ UX 세부 설계
| 요소 | 설계 내용 | 이유 |
|------|------------|------|
| **자동 포커스** | 모달 열리자마자 Input에 포커스 | 개발자 UX 향상 |
| **단축키 지원** | `Ctrl + Enter` → 커밋 실행 | 실제 Git 워크플로우와 일치 |
| **커밋 메시지 힌트** | Placeholder 예시: `feat:`, `fix:`, `refactor:` | Conventional Commit 규칙 유도 |
| **토스트 알림** | 커밋 성공 시 `✅ Commit pushed to GitLab` | 피드백 명확화 |
| **에러 처리** | 커밋 실패 시 빨간 Toast 표시 | 사용자 경험 일관성 유지 |

---

### 🧠 백엔드 연동 흐름

```plaintext
[사용자] Commit 버튼 클릭 → POST /api/gitlab/commit → [FastAPI] GitLab REST API 호출
→ GitLab 저장소에 파일 업데이트 + 커밋 → 응답 (commit_id)
→ [프론트엔드] Toast 알림 + 모달 닫기 → 히스토리 갱신
```

#### FastAPI 예시
```python
@router.post("/commit")
async def commit_to_gitlab(data: CommitRequest):
    response = gitlab_api.create_commit(
        branch=data.branch,
        message=data.commit_message,
        description=data.description
    )
    return {"status": "ok", "commit_id": response.id}
```

#### 요청 예시
```json
{
  "branch": "main",
  "commit_message": "feat: update RAG prompt version",
  "description": "RAG 평가 템플릿 업데이트 및 로그 포맷 정리"
}
```

---

### 🧩 시각적 디테일 제안
- Dialog의 **Header Title**은 18~20px 폰트로 약간 굵게 처리.
- `DialogFooter`는 상단에 미세한 Divider 추가.
- `Input`과 `Textarea` 사이 간격은 `space-y-4` 유지.
- 브랜치 표시 영역은 고정 폰트(`code`)로 시각적 차별화.

---

### 🚀 확장 계획 (V2 이후)
| 기능 | 설명 |
|------|------|
| **브랜치 선택 드롭다운** | `/repository/branches` API로 브랜치 목록 불러오기 |
| **Diff 미리보기** | 커밋 전 변경 내용 미리보기 (Modal 내부 탭으로 표시) |
| **자동 커밋 태그 추천** | 변경 내용 분석해 `feat:` / `fix:` 자동 추천 |

---

> ⚡ 커서 참고: 이 Dialog는 PromptOps의 미니멀한 헤더 디자인 톤에 맞춰야 하며, 
> 인터랙션은 부드럽되 개발자 친화적인 리듬(빠른 입력, 명확한 피드백)을 유지해야 한다. 
> 트렌드 기준으로는 **Radix 기반 Dialog + Tailwind + Toast 시스템** 조합을 추천한다.