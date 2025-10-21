# Jido UI — Results/Logs Enhancements + React Migration (for Cursor)

> 목적: **결과/로그 4페이지**에 공통 기능을 통일(딥링크/메타칩/Raw·Processed/trace 복사/CSV/워터폴/동기 스크롤/가상 스크롤)하고, 전체 프런트를 **React(Vite)**로 전환한다. 아래 지시사항과 DoD(완료 기준)를 그대로 따른다.

---

## 0) 레포/톤
- 현 테마(`styles/jido-theme.css`) 유지, 색/버튼/스트로크 톤 변경 금지.
- 헤더/액션 버튼 배치는 기존 HTML과 동일하게 재현.

---

## 1) React 전환 (Vite + Router + Zustand + Query)

### 1.1 기술 스택
- **Vite + React + TypeScript**
- **React Router** (라우팅/URL 동기화)
- **Zustand** (전역 UI 상태: runs 목록/선택, 모달 상태)
- **TanStack Query** (API 호출/캐싱/오류)
- **react-virtuoso** (대용량 JSON/로그 가상 스크롤)

### 1.2 파일 구조
```
src/
  app/
    App.tsx
    routes.tsx
  pages/
    IndexPage.tsx
    DashboardPage.tsx
    ResultsSinglePage.tsx
    ResultsABPage.tsx
    LogsSinglePage.tsx
    LogsABPage.tsx
    ConnectionsPage.tsx
  components/
    Header.tsx
    MetaChips.tsx        # model/tokens/latency/cost/param_hash/prompt_ver
    RawProcessedTabs.tsx # Raw JSON vs JSONPath 적용 결과
    TraceId.tsx          # 표시 + 복사
    ResultCard.tsx
    ABPanel.tsx          # 좌/우 동기 스크롤
    Waterfall.tsx        # 실행 단계 워터폴
    JsonViewer.tsx       # react-virtuoso 사용
    RunSelector.tsx      # 최근 실행 선택/검색/페이지
    Toast.tsx
    GitlabCommitDialog.tsx
    WizardModal/
      WizardModal.tsx
      useWizardStore.ts
  stores/
    useRunsStore.ts
  api/
    client.ts            # fetch wrapper(에러포맷/백오프)
    runs.ts              # /runs, /results, /logs
    connections.ts       # /connections/test
  styles/
    jido-theme.css       # 기존 그대로
```

### 1.3 라우팅 (예시)
```tsx
// app/routes.tsx
import { createBrowserRouter } from 'react-router-dom';
import IndexPage from '@/pages/IndexPage';
import DashboardPage from '@/pages/DashboardPage';
import ResultsSinglePage from '@/pages/ResultsSinglePage';
import ResultsABPage from '@/pages/ResultsABPage';
import LogsSinglePage from '@/pages/LogsSinglePage';
import LogsABPage from '@/pages/LogsABPage';

export const router = createBrowserRouter([
  { path: '/', element: <IndexPage/> },
  { path: '/dashboard', element: <DashboardPage/> },
  { path: '/results/single', element: <ResultsSinglePage/> },
  { path: '/results/ab', element: <ResultsABPage/> },
  { path: '/logs/single', element: <LogsSinglePage/> },
  { path: '/logs/ab', element: <LogsABPage/> },
]);
```

---

## 2) 공통 기능 통일 (4페이지 공통)

### 2.1 URL 딥링크 규칙(필수)
- **Single Results**: `/results/single?run={uuid}&view=processed`
- **AB Results**: `/results/ab?run={uuid}&arm=a|b&metric=faithfulness`
- **Single Logs**: `/logs/single?run={uuid}&tab=llm&step=2`
- **AB Logs**: `/logs/ab?run={uuid}&tab=llm&side=a`
> 페이지 진입 시 쿼리 반영 → UI 초기 상태 설정. 상태 변경 시 `history.replaceState`로 URL 갱신.

### 2.2 메타칩(항상 노출)
- `model`, `tokens_in/out`, `latency_ms`, `cost_usd`, `param_hash(6)`, `prompt_version`
- 각 칩 클릭시 클립보드 복사. 컴포넌트: `<MetaChips meta={...}/>`

### 2.3 trace_id 표시/복사
- 모든 상세뷰에 `<TraceId id={trace}/>`(복사 버튼 내장), 실패 뷰에도 동일 표출.

### 2.4 CSV 내보내기(통일 컬럼)
- 컬럼: `utc_ts, run_id, mode, prompt_version, model, params_hash, tokens_in, tokens_out, latency_ms, cost_usd, metrics(faith,rel,ctxp,ctxr,sim), winner, error_code`
- 다운로드 파일명: `jido_{page}_{runId}_{yyyyMMdd_HHmm}.csv`

---

## 3) 페이지별 구현 지시

### 3.1 Results — 공통
- 상단: `<RunSelector/>` (최근 20개 + 검색 + 페이지)
- 컨텐츠: `<RawProcessedTabs raw={vendorJSON} path={jsonPath} />`
  - 파싱 실패 시 Raw로 자동 폴백 + 토스트(`showToast('파싱 실패… Raw로 전환')`)
- 우상단: CSV, GitLab, Logs/Results 이동 버튼(동일 단축키 `G R`, `G L`, `G D`)

### 3.2 ResultsSinglePage
- 레이아웃: 메타칩 + 결과 Pane 1개
- 인쇄/전체 저장 버튼: 프린트 CSS + CSV 동일 컬럼

### 3.3 ResultsABPage
- 좌/우 두 패널: `<ABPanel left={A} right={B}/>`
  - **동기 스크롤**(스크롤 이벤트 상호 반영)
- 지표 테이블: 승/패 하이라이트(조건부 클래스) + threshold(설정값)

### 3.4 Logs — 공통
- 탭: `LLM / RIN / RPC / QRY / KQL` (없으면 빈 상태 문구)
- 워터폴: `<Waterfall steps={execution_steps}/>`
  - 바: `duration_ms` 길이, hover에 메타(모델, 토큰, 비용)
  - **가상 스크롤** 적용(steps > 200)
- 스텝 클릭 → 하단 `<JsonViewer data={...}/>` 펼침
- 필터 바(선택): `error|warning|vendor=openai|tag=foo`

### 3.5 LogsSinglePage / LogsABPage
- Single: 워터폴 1개
- AB: 좌/우 워터폴 2개(동기 스크롤)

---

## 4) API 계약 (동일)
- `/runs?limit=20&search=...` → 최근 실행 목록
- `/results/{runId}` → 결과(싱글 or A/B)
- `/logs/{runId}?tab=llm|rin|rpc|qry|kql` → 로그/스텝/메타
- 에러 포맷(고정): `{ error_code, message, trace_id, hint }`

### 4.1 fetch wrapper (백오프)
- 429/5xx 시 100→300→900ms 백오프, 그 외 즉시 실패

---

## 5) 접근성/성능
- 포커스 링 유지, 테이블 헤더 `scope="col"`
- 모달/드로어 포커스 트랩 + 닫기 시 포커스 복원
- 긴 JSON/텍스트는 가상 스크롤 + 접기/펼치기

---

## 6) 공통 유틸(요약 코드)

### 6.1 동기 스크롤 훅
```ts
// useSyncedScroll.ts
export function useSyncedScroll(a: React.RefObject<HTMLElement>, b: React.RefObject<HTMLElement>) {
  React.useEffect(()=>{
    if(!a.current || !b.current) return;
    let lock=false;
    const sa=()=>{ if(lock) return; lock=true; b.current!.scrollTop=a.current!.scrollTop; lock=false; };
    const sb=()=>{ if(lock) return; lock=true; a.current!.scrollTop=b.current!.scrollTop; lock=false; };
    a.current.addEventListener('scroll', sa); b.current.addEventListener('scroll', sb);
    return ()=>{ a.current?.removeEventListener('scroll', sa); b.current?.removeEventListener('scroll', sb); };
  },[a,b]);
}
```

### 6.2 Raw·Processed 탭
```tsx
// RawProcessedTabs.tsx (요지)
export default function RawProcessedTabs({ raw, path }:{ raw:any; path:string }){
  const [tab,setTab]=React.useState<'processed'|'raw'>('processed');
  let processed: string | undefined;
  try { /* JSONPath 적용 */ } catch { processed=undefined; }
  React.useEffect(()=>{ if(tab==='processed' && processed===undefined) { setTab('raw'); showToast('파싱 실패 — Raw로 전환'); } },[tab,processed]);
  return (
    <div>
      <div className="tabs">
        <button className={tab==='processed'?'active':''} onClick={()=>setTab('processed')}>Processed</button>
        <button className={tab==='raw'?'active':''} onClick={()=>setTab('raw')}>Raw</button>
      </div>
      <JsonViewer data={tab==='processed'? processed : raw}/>
    </div>
  );
}
```

### 6.3 CSV 내보내기 (컬럼 고정)
```ts
export function toCSV(rows: any[]): string {
  const headers = ['utc_ts','run_id','mode','prompt_version','model','params_hash','tokens_in','tokens_out','latency_ms','cost_usd','faith','rel','ctxp','ctxr','sim','winner','error_code'];
  const lines = [headers.join(',')];
  for (const r of rows) lines.push(headers.map(h=>JSON.stringify(r[h] ?? '')).join(','));
  return lines.join('\n');
}
```

---

## 7) DoD — 완료 기준 (반드시 충족)
- [ ] 4페이지 모두 **URL 딥링크** 반영/동기화
- [ ] 메타칩(모델/토큰/Latency/Cost/ParamHash/PromptVer) 고정 노출 + 복사
- [ ] **trace_id 표시/복사** 공통 적용(성공/실패 모두)
- [ ] **CSV 컬럼** 통일 및 파일명 규칙 준수
- [ ] Results 탭에 **Raw/Processed** 구현, 파싱 실패 시 Raw 폴백 + 토스트
- [ ] AB Results/Logs **동기 스크롤** 동작
- [ ] Logs 워터폴 + 스텝 클릭 시 JSON 패널(가상 스크롤)
- [ ] 429/5xx **백오프** 동작(100/300/900) + 사용자 안내 토스트
- [ ] 접근성: 포커스 트랩/복원, 키보드 내비게이션, 헤더 `scope="col"`
- [ ] 성능: 대용량(>1k 라인)에서도 스크롤/렌더 부드러움

---

## 8) 커밋/PR 지침
- 메시지 예시
  - `feat(react): migrate results/logs to react routes`
  - `feat(ui): meta chips + trace copy + raw/processed tabs`
  - `feat(logs): waterfall + virtualized json viewer`
  - `feat(ab): synced scroll panels`
- PR 체크박스
  - [ ] DoD 전 항목 Self-check 통과 스크린캐스트 첨부
  - [ ] CSV 샘플 파일 첨부(싱글/AB 각 1개)
  - [ ] a11y 키보드 내비게이션 GIF 첨부

