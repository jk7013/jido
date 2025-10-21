# Index & Onboarding (v1) — Enterprise Patch Instructions (for Cursor)

> 목적: `index.html` 온보딩/연결 마법사를 **현대적 UX + 엔터프라이즈 기준**으로 보강한다.  
> 범위: `src/pages/index.html` + 공통 `header.html`, `jido-theme.css` 톤 유지.

---

## 1) 적용 파일 & 톤
- 파일: `src/pages/index.html`
- 공통 포함: `header.html`, `gitlab-commit-dialog.html`, `jido-theme.css`
- 원칙: 기존 대시보드(다크/얇은 스트로크/라운드)와 **완전히 동일한 톤**

---

## 2) 기능 보완 (요약)
1. 연결 마법사 3단계 유지: **Provider → Key → API JSON & Test**
2. **/api/connections/test** 실제 연동 (모의 코드 제거)
3. OFFLINE/Allowlist 고지 문구 추가 (Step 1)
4. 실패/재시도: **타임아웃/백오프/레이트리밋** UX
5. 접근성: **포커스 트랩, aria/label, 포커스 링** 적용
6. 성공 응답에 **trace_id 표시 + 복사** 버튼
7. JSON 즉시 유효성 검사(OK/에러 힌트)
8. 버튼 연타 방지(실행 중 disabled)

---

## 3) API 계약 (서버 연결)
- **POST** `/api/connections/test`  
  **request**
  ```json
  {
    "provider": "openai|azure-openai|vertex|internal",
    "key_plain": "optional string",
    "api_json": "{...vendor request json...}",
    "json_path": "$.choices[0].message.content"
  }
  ```
  **success 200**
  ```json
  { "trace_id": "uuidv7", "latency_ms": 642, "est_cost_usd": 0.0012 }
  ```
  **error 4xx/5xx**
  ```json
  { "error_code": "AUTH_401|RATE_429|LLM_5XX|PARSE_ERR|OFFLINE_BLOCKED", "message": "...", "trace_id": "uuidv7", "hint": "..." }
  ```
- 규칙
  - `key_plain` 제공 시 서버는 **즉시 암호화 저장 → key_ref 발급**(프론트는 key_plain 폐기)
  - OFFLINE 모드일 때 외부 도메인은 **allowlist** 외 차단, 차단 시 `OFFLINE_BLOCKED`

---

## 4) 코드 패치(스니펫) — `index.html`에 적용

### 4.1 Step 표시 개선
```html
<span class="chip" id="stepInfo">1 / 3 • Provider</span>
```
```js
const STEP_LABEL = ["Provider","Key","API & Test"];
function setStep(n){
  // ... 기존 로직
  document.getElementById("stepInfo").textContent = `${n} / 3 • ${STEP_LABEL[n-1]}`;
}
```

### 4.2 테스트 호출 + 백오프/레이트리밋
```js
async function postJSON(url, payload) {
  const res = await fetch(url, {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify(payload)
  });
  const data = await res.json().catch(()=>({}));
  return { ok: res.ok, data };
}

async function testConnection() {
  const payload = {
    provider: document.getElementById('provider').value,
    key_plain: document.getElementById('apiKey').value || undefined,
    api_json: document.getElementById('apiJson').value,
    json_path: document.getElementById('jsonPath').value
  };
  let attempt = 0; const backoff = [100, 300, 900]; // ms
  while (true) {
    const { ok, data } = await postJSON('/api/connections/test', payload);
    if (ok) return { ok, data };
    const ratelimit = data?.error_code === 'RATE_429' || data?.error_code === 'LLM_5XX';
    if (!ratelimit || attempt >= backoff.length) return { ok, data };
    await new Promise(r => setTimeout(r, backoff[attempt++]));
  }
}
```
```js
// 버튼 핸들러 교체
document.getElementById("testBtn").addEventListener("click", async ()=>{
  const btn = document.getElementById("testBtn");
  btn.disabled = true; btn.textContent = "테스트 중...";
  // JSON 기본 검증 유지 ...
  const { ok, data } = await testConnection();
  if (ok) {
    hide($("#step3")); show($("#step3success"));
    $("#latencyChip").textContent = data.latency_ms;
    $("#costChip").textContent = `$${Number(data.est_cost_usd).toFixed(4)}`;
    // trace id 표시/복사
    $("#traceId").textContent = data.trace_id;
    $("#goDashboard").classList.remove('hidden');
  } else {
    $("#testResult").innerHTML = `❌ <b>${data.error_code || 'ERROR'}</b> — ${data.message || '실패'} (trace: ${data.trace_id || '-'})<br><small>${data.hint || ''}</small>`;
    $("#testResult").classList.add('shake'); setTimeout(()=>$("#testResult").classList.remove('shake'),450);
  }
  btn.disabled = false; btn.textContent = "연결 테스트";
});
```

### 4.3 trace_id 복사 UI
```html
<!-- 성공 패널 내부에 추가 -->
<p class="subtitle">trace: <code id="traceId">—</code> <button class="ghost" id="copyTrace">복사</button></p>
```
```js
document.getElementById('copyTrace')?.addEventListener('click', ()=>{
  const t = document.getElementById('traceId').textContent;
  navigator.clipboard.writeText(t);
});
```

### 4.4 JSON 즉시검사 힌트
```html
<small id="jsonHint" class="footer-note">형식을 입력하면 즉시 검사합니다.</small>
```
```js
function instantJSONHint(){
  const el = document.getElementById('jsonHint');
  try { JSON.parse(document.getElementById('apiJson').value); el.textContent='✓ 올바른 JSON 형식'; }
  catch { el.textContent='✗ JSON 형식이 올바르지 않습니다'; }
}
document.getElementById('apiJson').addEventListener('input', instantJSONHint);
```

### 4.5 접근성: 포커스 트랩 + 단축키
```js
// 포커스 트랩
const modalOverlay = document.getElementById('wizard');
function trapFocus(e){
  if (modalOverlay.style.display !== 'grid') return;
  const f = modalOverlay.querySelectorAll('button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])');
  if (!f.length) return;
  const first=f[0], last=f[f.length-1];
  if(e.key==='Tab'){
    if(e.shiftKey && document.activeElement===first){ e.preventDefault(); last.focus(); }
    else if(!e.shiftKey && document.activeElement===last){ e.preventDefault(); first.focus(); }
  }
}
document.addEventListener('keydown', trapFocus);

// 단축키: Ctrl/Cmd+Enter = 테스트
document.addEventListener('keydown', (e)=>{
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && document.getElementById('step3') && !document.getElementById('step3').classList.contains('hidden')) {
    document.getElementById('testBtn').click();
  }
});
```

### 4.6 OFFLINE/Allowlist 안내 강화 (Step 1)
```html
<p class="footer-note">
  OFFLINE 모드에서는 외부망 호출이 차단됩니다. 허용 도메인 내에서만 테스트가 진행됩니다(사내 LLM 권장).
</p>
```

---

## 5) 스타일/토큰(선택)
- 칩/서브텍스트 대비 4.5:1 이상 확인, 필요 시 `--sub` 색상 상향
- 버튼 간격: 상단 우측 CTA 16px 유지

---

## 6) 체크리스트 (v1 릴리즈)
- [ ] 모의 테스트 코드 제거, `/api/connections/test` 연동
- [ ] 실패 메시지 표준화 `{error_code, message, trace_id, hint}`
- [ ] OFFLINE/Allowlist 고지 문구 반영
- [ ] 포커스 트랩/aria/label 적용(접근성 기본 충족)
- [ ] 버튼 연타 방지(disabled 처리)
- [ ] 성공 패널에 `latency/cost/trace_id` 표시 + 복사
- [ ] 감사로그: wizard open/complete/fail/cancel 기록(백엔드)
- [ ] egress=0(CI) 테스트 통과

---

## 7) 커밋/PR
- 메시지 예시  
  - `feat(ui): onboarding wizard enterprise hardening (a11y/backoff/trace)`  
  - `feat(api): wire /api/connections/test + error format`  
- PR 템플릿 체크  
  - [ ] OFFLINE/allowlist 안내  
  - [ ] 에러 포맷 일관  
  - [ ] 접근성/단축키 동작  
  - [ ] 모의 코드 제거

