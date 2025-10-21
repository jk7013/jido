# Index Onboarding — Enterprise Fixes (for Cursor)

> 목적: `src/pages/index.html`의 온보딩/연결 마법사에 **엔터프라이즈 보완 3종**을 반영한다. (키 메모리 정리, 모달 포커스 복원, 레이트리밋/백오프 안내 토스트)

---

## 0) 범위
- 파일: `src/pages/index.html` (필수), `jido-theme.css`(선택)
- 전제: `/api/connections/test` 연동 및 에러 포맷 `{error_code,message,trace_id,hint}`는 이미 적용됨.

---

## 1) 키 메모리 정리 (보안)
**의도:** 테스트 호출 종료 즉시 브라우저 메모리에서 `key_plain`을 제거.

### 1-1) 테스트 호출 핸들러 내에 정리 코드 추가
```js
// testBtn 클릭 핸들러 내부, try/finally 구간 또는 응답 처리 직후에 추가
const keyInput = document.getElementById('apiKey');
// 네트워크 전송은 body에만 담고, 별도 변수로 오래 들고 있지 않기
// ... (응답 처리 후)
keyInput.value = '';
try { delete payload.key_plain; } catch (_) {}
```

> 주의: view state에 키를 캐시하지 말 것. (React 상태/전역 스토리지에 올리지 않음)

---

## 2) 모달 닫기 시 포커스 복원 (A11y)
**의도:** 모달을 닫으면(취소/ESC) 사용자가 누르던 **열기 버튼**으로 포커스를 되돌림.

### 2-1) 상태 변수와 open/close 래퍼 도입
```js
let lastFocusEl;
function openWizard(){
  lastFocusEl = document.activeElement;
  document.getElementById('wizard').style.display='grid';
  setStep(1);
}
function closeWizard(){
  const m = document.getElementById('wizard');
  m.style.display='none';
  // 포커스 복원
  if (lastFocusEl && typeof lastFocusEl.focus === 'function') lastFocusEl.focus();
}
```

### 2-2) 기존 이벤트 바인딩 교체
```js
// 버튼/단축키 바인딩
const openBtns = [document.getElementById('openWizardBtn'), document.getElementById('openWizardBtn2')];
openBtns.forEach(btn=> btn && btn.addEventListener('click', openWizard));

document.getElementById('cancelWizard')?.addEventListener('click', closeWizard);
document.addEventListener('keydown', (e)=>{
  if(e.key==='Escape' && document.getElementById('wizard').style.display==='grid') closeWizard();
});
```

---

## 3) 레이트리밋/백오프 사용자 안내 토스트
**의도:** 429/5xx 백오프를 사용자에게 명확히 알림.

### 3-1) 최소 토스트 유틸 추가
```html
<!-- body 끝나기 전 한번만 추가 -->
<div id="toast" class="hidden" style="position:fixed;top:16px;left:50%;transform:translateX(-50%);z-index:2000;">
  <div id="toastInner" class="card" style="padding:10px 14px;min-width:260px;text-align:center"></div>
</div>
```
```js
function showToast(msg, ms=1200){
  const t=document.getElementById('toast');
  const i=document.getElementById('toastInner');
  i.textContent=msg; t.classList.remove('hidden');
  clearTimeout(showToast._t); showToast._t=setTimeout(()=>t.classList.add('hidden'), ms);
}
```

### 3-2) 백오프 루프에서 메시지 표출
```js
const backoff = [100, 300, 900]; // ms
let attempt = 0;
while(true){
  const { ok, data } = await postJSON('/api/connections/test', payload);
  if (ok) break;
  const isRl = data?.error_code==='RATE_429' || data?.error_code==='LLM_5XX';
  if (!isRl || attempt>=backoff.length) { /* 실패 처리 */ break; }
  const wait = backoff[attempt++];
  showToast(`재시도 대기중… ${wait}ms (사유: ${data.error_code})`, Math.max(1200, wait+300));
  await new Promise(r=>setTimeout(r, wait));
}
```

---

## 4) (선택) 유지보수 개선 2건
- **스타일 인라인 최소화:** Step 2의 동적 강조는 인라인 수정 대신 클래스로 전환(`.field--emphasis`).
- **변수 추출 디바운스:**
```js
let _vTimer; 
document.getElementById('apiJson').addEventListener('input', ()=>{
  clearTimeout(_vTimer); _vTimer=setTimeout(extractVars, 150);
});
```

---

## 5) 빠른 테스트 체크리스트
- [ ] 테스트 성공 후 `#apiKey`가 **빈 값**인지 확인
- [ ] 모달을 닫으면 “연결 시작하기” 버튼으로 포커스가 돌아오는지
- [ ] 429/5xx 모의 응답 시 상단 **토스트**가 뜨고, 0.1→0.3→0.9s 간격으로 재시도되는지
- [ ] 일반 실패 시(이외 에러코드)에는 즉시 실패 메시지 노출되는지

---

## 6) 커밋/PR 템플릿
- 메시지 예시: `feat(ui): wizard security+a11y hardening (key purge, focus restore, retry toast)`
- 체크박스:
  - [ ] key_plain 클라이언트 메모리 정리
  - [ ] 모달 포커스 복원/트랩 동작
  - [ ] 429/5xx 백오프 토스트 안내 적용
