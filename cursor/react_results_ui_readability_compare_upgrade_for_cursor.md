# React Results UI – Readability & Compare Upgrade (for Cursor)

> 목적: 리액트 전환된 **결과 화면(싱글/AB)**의 가독성과 비교력을 높인다.
> 범위: `ResultsSinglePage.tsx`, `ResultsABPage.tsx`, 공통 컴포넌트(`MetaChips`, `RawProcessedTabs`, `ABPanel`).

---

## 1) 답변 영역 “읽기 모드” 적용 (필수)
- 대상: 결과 본문 컨테이너(두 페이지 공통) 클래스명 **`.answerPane`** 사용.
- 라인 길이 제한(60–80ch), 줄간, 단락/리스트 간격, monospace 섹션 분리.

```css
/* styles/results.css (신규 또는 해당 페이지 CSS 모듈) */
.answerPane{max-width:78ch;line-height:1.65;letter-spacing:.1px;white-space:pre-wrap}
.answerPane p{margin:8px 0}
.answerPane ul{margin:8px 0 8px 20px;list-style:disc}
.answerPane ol{margin:8px 0 8px 20px;list-style:decimal}
.answerPane code,.answerPane pre{font-family:ui-monospace,SFMono-Regular,Menlo,monospace}
.answerCard{background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:12px}
.sectionTitle{font-weight:700;font-size:13px;color:var(--sub)}
.divider{height:1px;background:rgba(255,255,255,.06);margin:12px 0}
.queryChip{display:inline-block;padding:6px 10px;border:1px solid var(--muted);border-radius:12px;color:#9fb0c8}
/* Sticky metric header (패널 내부 헤더 고정) */
.panelHeader{position:sticky;top:56px;z-index:2;backdrop-filter:blur(6px)}
/* 전체 높이 채우기 */
.mainFull{min-height:calc(100vh - 56px);padding-bottom:0}
```

사용:
```tsx
<main className="mainFull">
  <header className="panelHeader">{/* 메트릭/액션 */}</header>
  <div className="divider"/>
  <div className="answerCard">
    <div className="sectionTitle">Query</div>
    <div className="queryChip">{query}</div>
    <div className="divider"/>
    <div className="answerPane">{renderedAnswer}</div>
  </div>
</main>
```

---

## 2) Raw / Processed 탭 (필수)
- 컴포넌트: `components/RawProcessedTabs.tsx`
- 기능: JSONPath 적용 결과와 벤더 원문(JSON) 전환. 파싱 실패 시 Raw로 폴백 + 토스트.

```tsx
export default function RawProcessedTabs({ raw, path }:{raw:any; path:string}){
  const [tab,setTab]=React.useState<'processed'|'raw'>('processed')
  let processed: string|undefined
  try{ /* JSONPath 적용 */ }catch{ processed=undefined }
  React.useEffect(()=>{ if(tab==='processed' && processed===undefined){ setTab('raw'); showToast('파싱 실패 — Raw로 전환') } },[tab,processed])
  return (
    <div>
      <div className="tabs">
        <button className={tab==='processed'?'active':''} onClick={()=>setTab('processed')}>Processed</button>
        <button className={tab==='raw'?'active':''} onClick={()=>setTab('raw')}>Raw</button>
      </div>
      {tab==='processed' ? <div className="answerPane">{processed}</div> : <JsonViewer data={raw}/>}
    </div>
  )
}
```

페이지 적용: `renderedAnswer` 대신 `<RawProcessedTabs raw={vendorJson} path={jsonPath} />` 삽입.

---

## 3) AB 비교 개선 – 동기 스크롤 + 동일 높이 (필수)
- 훅 추가: `hooks/useSyncedScroll.ts`
```ts
export function useSyncedScroll(a: React.RefObject<HTMLElement>, b: React.RefObject<HTMLElement>) {
  React.useEffect(()=>{
    if(!a.current||!b.current) return; let lock=false
    const sa=()=>{if(lock)return;lock=true;b.current!.scrollTop=a.current!.scrollTop;lock=false}
    const sb=()=>{if(lock)return;lock=true;a.current!.scrollTop=b.current!.scrollTop;lock=false}
    a.current.addEventListener('scroll',sa); b.current.addEventListener('scroll',sb)
    return()=>{a.current?.removeEventListener('scroll',sa); b.current?.removeEventListener('scroll',sb)}
  },[a,b])
}
```
- `ABPanel`에서 좌/우 스크롤 컨테이너에 ref를 달고 훅 사용.

---

## 4) 밀도 토글 + 긴 텍스트 접기 (권장)
- 상단 우측에 `밀도: 보통/압축` 토글. 압축 시 `.answerPane`에 클래스 `dense` 추가.
```css
.answerPane.dense{line-height:1.5}
```
- 1200자 초과 시 접기/펼치기 버튼:
```tsx
const [expanded,setExpanded]=useState(false)
const text=processedText
const tooLong=text.length>1200
const shown=expanded?text:text.slice(0,1200)
```

---

## 5) 로딩/오류 표준화 (권장)
- 로딩: 답변 카드에 3–4줄 스켈레톤.
- 오류: `{error_code, message, trace_id, hint}` 블록 + trace 복사 버튼.

---

## 6) 액션/메타 정리 (공통)
- 패널 헤더 우측: Copy trace / CSV / GitLab 아이콘 3종 고정.
- `MetaChips`는 항상 노출(모델/토큰/Latency/Cost/param_hash/prompt_ver). 칩 클릭=복사.

---

## 7) 적용 파일
- `src/pages/ResultsSinglePage.tsx` — 읽기 모드/RawProcessed 적용
- `src/pages/ResultsABPage.tsx` — 위 + `useSyncedScroll` 적용
- `src/components/RawProcessedTabs.tsx` — 신규
- `src/hooks/useSyncedScroll.ts` — 신규
- `src/styles/results.css` — 신규 또는 해당 모듈 CSS

---

## 8) DoD (완료 기준)
- [ ] 답변 본문이 **라인 길이 제한**(78ch)과 단락/리스트 스타일을 갖는다.
- [ ] 메트릭 바가 **Sticky**로 스크롤 시 항상 보인다.
- [ ] Raw/Processed 탭이 있고, **파싱 실패 시 Raw 폴백 + 토스트**가 동작한다.
- [ ] AB 결과에서 좌/우 **동기 스크롤**이 부드럽게 동작한다.
- [ ] 1200자 초과 답변은 기본 접힘(펼치기 가능) 또는 밀도 토글이 제공된다.
- [ ] 로딩 시 스켈레톤, 오류 시 표준 에러 블록과 **trace 복사**가 보인다.
- [ ] 페이지 하단까지 영역이 꽉 차며(100vh-헤더), 좌/우 높이가 어긋나지 않는다.

---

## 9) 커밋 메시지 예시
- `feat(ui): results readability mode + sticky metrics`
- `feat(results): raw/processed tabs with fallback`
- `feat(ab): synced scroll for side-by-side compare`



---

## 10) Prompt 편집 UX — 드롭다운 + 사이드 시트 (추가)
> 결과보기 화면에서 **스크롤 이동 없이** Prompt A/B를 열람·수정하기 위한 패턴.

### 10.1 컴포넌트 구조
- `PromptCard`(A/B 공용): 우측 상단 드롭다운 **보기 / 수정**
- `PromptSideSheet`: 오른쪽에서 슬라이드 인되는 **Side Sheet**
  - 탭 3개: `Template` / `Parameters` / `Variables`
  - footer: 취소 / 미리보기 / 저장
- 상태 저장: `usePromptStore`(Zustand) — A/B 프롬프트 버전/템플릿/파라미터
- 접근성: 포커스 트랩 + 닫을 때 **트리거 버튼으로 포커스 복원**

### 10.2 React 스니펫 (요지)
```tsx
function PromptCard({ side, prompt }: { side: 'A'|'B'; prompt: Prompt }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [sheet, setSheet] = useState<null|'view'|'edit'>(null);
  return (
    <section className="card">
      <header className="cardHeader">
        <h3>Prompt {side}</h3>
        <div className="actions">
          <button className="ghost" onClick={()=>setMenuOpen(v=>!v)}>보기/수정 ▾</button>
          {menuOpen && (
            <div role="menu" className="menu">
              <button onClick={()=>{ setSheet('view'); setMenuOpen(false); }}>보기</button>
              <button onClick={()=>{ setSheet('edit'); setMenuOpen(false); }}>수정</button>
            </div>
          )}
        </div>
      </header>
      {/* …메트릭/본문… */}
      <PromptSideSheet
        mode={sheet}
        side={side}
        value={prompt}
        open={!!sheet}
        onClose={()=>setSheet(null)}
        onSave={(next)=>{/* store 반영 후 배지/미리보기 갱신 */ setSheet(null)}}
      />
    </section>
  );
}
```

```tsx
export function PromptSideSheet({ open, mode, value, onClose, onSave, side }: Props){
  const [tab, setTab] = useState<'tpl'|'params'|'vars'>('tpl');
  const [draft, setDraft] = useState<Prompt>(value);
  useEffect(()=>{ if(open) setDraft(value); }, [open, value]);
  if(!open) return null;
  return (
    <aside className="sideSheet" role="dialog" aria-modal>
      <header className="sideHeader">
        <strong>Prompt {side} {mode==='edit' ? '수정' : '보기'}</strong>
        <button className="ghost" onClick={onClose} aria-label="닫기">✕</button>
      </header>
      <nav className="tabs">
        <button className={tab==='tpl'?'active':''} onClick={()=>setTab('tpl')}>Template</button>
        <button className={tab==='params'?'active':''} onClick={()=>setTab('params')}>Parameters</button>
        <button className={tab==='vars'?'active':''} onClick={()=>setTab('vars')}>Variables</button>
      </nav>
      <div className="sheetBody">
        {tab==='tpl' && (mode==='view' ? <pre className="tplRead">{value.template}</pre>
          : <textarea className="tplEdit" value={draft.template} onChange={e=>setDraft({...draft, template:e.target.value})}/>)}
        {tab==='params' && (
          <div className="grid">
            <label>temperature<input type="number" step="0.01" value={draft.params.temperature}
              onChange={e=>setDraft({...draft, params:{...draft.params, temperature:+e.target.value}})}/></label>
            <label>top_p<input type="number" step="0.01" value={draft.params.top_p}
              onChange={e=>setDraft({...draft, params:{...draft.params, top_p:+e.target.value}})}/></label>
          </div>
        )}
        {tab==='vars' && (
          <textarea className="varsEdit" value={draft.variables_sample}
            onChange={e=>setDraft({...draft, variables_sample:e.target.value})}
            placeholder='{"query":"…","user":"…"}'/>
        )}
      </div>
      <footer className="sheetFooter">
        <button className="ghost" onClick={onClose}>취소</button>
        {mode==='edit' && (<>
          <button onClick={()=>{/* 미리보기 */}}>미리보기</button>
          <button className="primary" onClick={()=>onSave(draft)}>저장</button>
        </>)}
      </footer>
    </aside>
  );
}
```

### 10.3 스타일(톤 유지)
```css
.menu{position:absolute;right:0;top:28px;background:#0f141a;border:1px solid var(--muted);border-radius:8px;padding:6px;box-shadow:0 10px 30px rgba(0,0,0,.4)}
.menu>button{display:block;width:180px;text-align:left;padding:8px 10px}
.sideSheet{position:fixed;top:56px;right:0;width:min(620px,46vw);height:calc(100vh - 56px);background:var(--panel);border-left:1px solid var(--muted);box-shadow:-20px 0 60px rgba(0,0,0,.45);display:flex;flex-direction:column;z-index:30}
.sideHeader{display:flex;justify-content:space-between;align-items:center;padding:12px 14px;border-bottom:1px solid var(--muted)}
.tabs{display:flex;gap:8px;padding:8px 12px;border-bottom:1px solid var(--muted)}
.tabs button.active{border-bottom:2px solid var(--accent)}
.sheetBody{padding:12px;overflow:auto}
.tplEdit,.varsEdit{width:100%;min-height:220px}
.tplRead{white-space:pre-wrap}
.sheetFooter{display:flex;gap:8px;justify-content:flex-end;padding:10px 12px;border-top:1px solid var(--muted)}
```

### 10.4 UX 규칙
- 시트 **열림 시 포커스 트랩**, **닫힘 시 트리거 버튼으로 포커스 복원**
- 단축키: `Ctrl/Cmd+S=저장`, `Ctrl/Cmd+Enter=미리보기`, `Esc=닫기`
- 초안 자동저장: 입력 정지 2초 후 localStorage에 임시 저장, 재진입 시 복구 여부 질문

### 10.5 DoD (추가)
- [ ] Prompt 카드 우측 드롭다운에서 **보기/수정**이 뜬다.
- [ ] 수정 시 우측 **사이드 시트**가 열리고, 탭(Template/Parameters/Variables) 제공.
- [ ] 저장하면 결과보기 UI의 프롬프트 버전/미리보기가 즉시 갱신된다.
- [ ] 접근성: 포커스 트랩/복원, 키보드 단축키 동작.

