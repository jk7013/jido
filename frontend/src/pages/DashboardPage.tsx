import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';

interface Run {
  time: number;
  query: string;
  promptA: { name: string; tpl: string };
  promptB: { name: string; tpl: string };
  ansA: string;
  ansB: string;
  latA: number;
  latB: number;
  tokA: number;
  tokB: number;
  sim: number;
  scores: {
    A: { faithfulness: number; relevancy: number; ctxPrecision: number; ctxRecall: number };
    B: { faithfulness: number; relevancy: number; ctxPrecision: number; ctxRecall: number };
  };
}

const DashboardPage: React.FC = () => {
  const [isSingleMode, setIsSingleMode] = useState(false);
  const [runs, setRuns] = useState<Run[]>([
    // 데모용 초기 데이터
    {
      time: Date.now(),
      query: '회사차를 타고 가면 사규에 어긋나?',
      promptA: { name: 'legal_rag_v0.3.4 (strict)', tpl: '시스템 지침 + 요약/근거 제시 요구...' },
      promptB: { name: 'legal_rag_v0.3.5 (concise)', tpl: '톤/형식 변경 템플릿...' },
      ansA: '[internal-llm-rag@v2] 회사차 사용은 사규상 허용되며, 단, 개인적 목적으로 사용할 경우 사전 승인이 필요합니다. 관련 규정: 제3조 2항...',
      ansB: '[internal-llm-rag@v2] 회사차는 업무용으로만 사용 가능합니다. 개인 목적 사용 시 사규 위반입니다. 자세한 내용은 인사팀에 문의하세요.',
      latA: 234,
      latB: 189,
      tokA: 156,
      tokB: 98,
      sim: 78,
      scores: {
        A: { faithfulness: 0.87, relevancy: 0.92, ctxPrecision: 0.85, ctxRecall: 0.89 },
        B: { faithfulness: 0.91, relevancy: 0.88, ctxPrecision: 0.92, ctxRecall: 0.85 },
      },
    }
  ]);
  const [promptA, setPromptA] = useState({ name: 'legal_rag_v0.3.4 (strict)', tpl: '시스템 지침 + 요약/근거 제시 요구...' });
  const [promptB, setPromptB] = useState({ name: 'legal_rag_v0.3.5 (concise)', tpl: '톤/형식 변경 템플릿...' });
  const [userQuery, setUserQuery] = useState('회사차를 타고 가면 사규에 어긋나?');
  const [modelName, setModelName] = useState('internal-llm-rag@v2');

  // 모드 토글 핸들러
  const toggleMode = () => {
    setIsSingleMode(!isSingleMode);
  };

  // 실행 핸들러 (데모용)
  const handleRun = async () => {
    if (!userQuery.trim()) {
      alert('사용자 질문을 입력하세요.');
      return;
    }

    // 데모용 랜덤 데이터 생성
    const rand = (min: number, max: number) => Math.round(min + Math.random() * (max - min));
    const randScore = () => Math.round((0.6 + Math.random() * 0.4) * 100) / 100;

    const newRun: Run = {
      time: Date.now(),
      query: userQuery,
      promptA: { name: promptA.name || 'A', tpl: promptA.tpl },
      promptB: { name: promptB.name || 'B', tpl: promptB.tpl },
      ansA: `[${modelName || 'internal-llm'}] "${userQuery}"에 대한 응답 예시.`,
      ansB: isSingleMode ? '' : `[${modelName || 'internal-llm'}] "${userQuery}"에 대한 응답 예시 B.`,
      latA: rand(150, 800),
      latB: isSingleMode ? 0 : rand(150, 800),
      tokA: rand(120, 480),
      tokB: isSingleMode ? 0 : rand(120, 480),
      sim: isSingleMode ? 0 : rand(60, 95),
      scores: {
        A: {
          faithfulness: randScore(),
          relevancy: randScore(),
          ctxPrecision: randScore(),
          ctxRecall: randScore(),
        },
        B: {
          faithfulness: isSingleMode ? 0 : randScore(),
          relevancy: isSingleMode ? 0 : randScore(),
          ctxPrecision: isSingleMode ? 0 : randScore(),
          ctxRecall: isSingleMode ? 0 : randScore(),
        },
      },
    };

    setRuns(prev => [newRun, ...prev]);
  };

  // 화면 초기화
  const handleClear = () => {
    setRuns([]);
    setPromptA({ name: '', tpl: '' });
    setPromptB({ name: '', tpl: '' });
    setUserQuery('');
    setModelName('');
  };

  // CSV 내보내기
  const handleExportCSV = () => {
    if (runs.length === 0) {
      alert('내보낼 실행 결과가 없습니다.');
      return;
    }

    let csvContent = '';
    if (isSingleMode) {
      csvContent = 'index,query,promptA,faithA,relA,ctxPrecA,ctxRecA,latA_ms,tokA\n';
      runs.forEach((run, i) => {
        csvContent += `${i + 1},"${run.query}","${run.promptA.name}",${run.scores.A.faithfulness},${run.scores.A.relevancy},${run.scores.A.ctxPrecision},${run.scores.A.ctxRecall},${run.latA},${run.tokA}\n`;
      });
    } else {
      csvContent = 'index,query,promptA,promptB,faithA,faithB,relA,relB,ctxPrecA,ctxPrecB,ctxRecA,ctxRecB,similarity,latA_ms,latB_ms,tokA,tokB\n';
      runs.forEach((run, i) => {
        csvContent += `${i + 1},"${run.query}","${run.promptA.name}","${run.promptB.name}",${run.scores.A.faithfulness},${run.scores.B.faithfulness},${run.scores.A.relevancy},${run.scores.B.relevancy},${run.scores.A.ctxPrecision},${run.scores.B.ctxPrecision},${run.scores.A.ctxRecall},${run.scores.B.ctxRecall},${run.sim},${run.latA},${run.latB},${run.tokA},${run.tokB}\n`;
      });
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prompt_${isSingleMode ? 'single' : 'ab'}_results_${new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-')}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={isSingleMode ? 'single-mode' : ''}>
      <Header 
        onExportCSV={handleExportCSV}
        runCount={runs.length}
        isSingleMode={isSingleMode}
      />
      <div className="wrap">
        {/* 좌: 컨트롤 */}
        <section className="panel">
          <h2>실행 컨트롤</h2>
          <div className="content">
            {/* 토글 스위치 */}
            <div className="toggle-container">
              <span className="toggle-label">Single Mode</span>
              <div 
                className={`toggle-switch ${!isSingleMode ? 'active' : ''}`}
                onClick={toggleMode}
              >
                <div className="toggle-slider"></div>
              </div>
              <span className="toggle-label">A/B Mode</span>
            </div>
            
            <div className="prompt-row">
              <div className="prompt-a-container">
                <label>프롬프트 A (버전/설명)</label>
                <input
                  type="text"
                  value={promptA.name}
                  onChange={(e) => setPromptA(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="예: legal_rag_v0.3.4 (strict)"
                />
                <label>프롬프트 A 템플릿</label>
                <textarea
                  value={promptA.tpl}
                  onChange={(e) => setPromptA(prev => ({ ...prev, tpl: e.target.value }))}
                  placeholder="예: 시스템 지침 + 요약/근거 제시 요구..."
                ></textarea>
              </div>
              <div className="prompt-b-container">
                <label>프롬프트 B (버전/설명)</label>
                <input
                  type="text"
                  value={promptB.name}
                  onChange={(e) => setPromptB(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="예: legal_rag_v0.3.5 (concise)"
                />
                <label>프롬프트 B 템플릿</label>
                <textarea
                  value={promptB.tpl}
                  onChange={(e) => setPromptB(prev => ({ ...prev, tpl: e.target.value }))}
                  placeholder="예: 톤/형식 변경 템플릿..."
                ></textarea>
              </div>
            </div>

            <div className="row" style={{marginTop: '10px'}}>
              <div>
                <label>사용자 질문</label>
                <input
                  type="text"
                  value={userQuery}
                  onChange={(e) => setUserQuery(e.target.value)}
                  placeholder='예: "회사차를 타고 가면 사규에 어긋나?"'
                />
                <div className="hint">
                  여러 건 테스트하려면 테스트셋 모드(하단 표 우측 상단 버튼)로 확장 가능
                </div>
              </div>
              <div>
                <label>평가 옵션</label>
                <select>
                  <option value="auto">Auto Judge (LLM 기반)</option>
                  <option value="heuristic">Heuristic (유사도/길이/포맷)</option>
                </select>
                <label style={{marginTop: '8px'}}>모델/엔드포인트 (표기용)</label>
                <input
                  type="text"
                  value={modelName}
                  onChange={(e) => setModelName(e.target.value)}
                  placeholder="예: internal-llm-rag@v2"
                />
              </div>
            </div>

            <div className="exec-controls">
              <button onClick={handleRun}>
                {isSingleMode ? '실행' : 'A/B 실행'}
              </button>
              <button className="ghost" onClick={handleClear}>화면 초기화</button>
            </div>
          </div>
        </section>

        {/* 우: 최근 실행 비교 카드 */}
        <section className="panel">
          <h2>{isSingleMode ? '최근 실행 결과' : '최근 실행 비교'}</h2>
          <div className="content">
            {runs.length === 0 ? (
              <div className="empty">• 아직 실행된 결과가 없어요.</div>
            ) : (
              <>
                <div className="cards">
                  <div className="card">
                    <div>
                      <strong>Prompt A</strong>
                      <span className="badge">{runs[0].promptA.name || '-'}</span>
                    </div>
                    <div className="kv">
                      <div>Latency</div>
                      <div className="metric">{runs[0].latA} ms</div>
                      <div>Tokens</div>
                      <div className="metric">{runs[0].tokA}</div>
                      <div>Answer</div>
                      <div><pre>{runs[0].ansA}</pre></div>
                    </div>
                  </div>
                  {!isSingleMode && (
                    <div className="card card-b">
                      <div>
                        <strong>Prompt B</strong>
                        <span className="badge">{runs[0].promptB.name || '-'}</span>
                      </div>
                      <div className="kv">
                        <div>Latency</div>
                        <div className="metric">{runs[0].latB} ms</div>
                        <div>Tokens</div>
                        <div className="metric">{runs[0].tokB}</div>
                        <div>Answer</div>
                        <div><pre>{runs[0].ansB}</pre></div>
                      </div>
                    </div>
                  )}
                </div>

                {!isSingleMode && (
                  <div className="similarity-section" style={{marginTop: '10px'}}>
                    <label>텍스트 유사도 (A vs B)</label>
                    <div className="bar">
                      <span style={{width: `${runs[0].sim}%`}}></span>
                    </div>
                    <div className="metric">Text Similarity: {runs[0].sim}%</div>
                  </div>
                )}

                <div style={{marginTop: '10px'}}>
                  <table className="metric-table">
                    <thead>
                      <tr>
                        <th>지표</th>
                        <th>A</th>
                        {!isSingleMode && <th>B</th>}
                        {!isSingleMode && <th>우세</th>}
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Faithfulness</td>
                        <td className="metric">{runs[0].scores.A.faithfulness.toFixed(2)}</td>
                        {!isSingleMode && <td className="metric">{runs[0].scores.B.faithfulness.toFixed(2)}</td>}
                        {!isSingleMode && <td>{runs[0].scores.A.faithfulness > runs[0].scores.B.faithfulness ? 'A' : runs[0].scores.A.faithfulness < runs[0].scores.B.faithfulness ? 'B' : '='}</td>}
                      </tr>
                      <tr>
                        <td>Answer Relevancy</td>
                        <td className="metric">{runs[0].scores.A.relevancy.toFixed(2)}</td>
                        {!isSingleMode && <td className="metric">{runs[0].scores.B.relevancy.toFixed(2)}</td>}
                        {!isSingleMode && <td>{runs[0].scores.A.relevancy > runs[0].scores.B.relevancy ? 'A' : runs[0].scores.A.relevancy < runs[0].scores.B.relevancy ? 'B' : '='}</td>}
                      </tr>
                      <tr>
                        <td>Context Precision</td>
                        <td className="metric">{runs[0].scores.A.ctxPrecision.toFixed(2)}</td>
                        {!isSingleMode && <td className="metric">{runs[0].scores.B.ctxPrecision.toFixed(2)}</td>}
                        {!isSingleMode && <td>{runs[0].scores.A.ctxPrecision > runs[0].scores.B.ctxPrecision ? 'A' : runs[0].scores.A.ctxPrecision < runs[0].scores.B.ctxPrecision ? 'B' : '='}</td>}
                      </tr>
                      <tr>
                        <td>Context Recall</td>
                        <td className="metric">{runs[0].scores.A.ctxRecall.toFixed(2)}</td>
                        {!isSingleMode && <td className="metric">{runs[0].scores.B.ctxRecall.toFixed(2)}</td>}
                        {!isSingleMode && <td>{runs[0].scores.A.ctxRecall > runs[0].scores.B.ctxRecall ? 'A' : runs[0].scores.A.ctxRecall < runs[0].scores.B.ctxRecall ? 'B' : '='}</td>}
                      </tr>
                      <tr>
                        <td>Latency (ms)</td>
                        <td className="metric">{runs[0].latA}</td>
                        {!isSingleMode && <td className="metric">{runs[0].latB}</td>}
                        {!isSingleMode && <td>{runs[0].latA < runs[0].latB ? 'A' : runs[0].latA > runs[0].latB ? 'B' : '='}</td>}
                      </tr>
                      <tr>
                        <td>Tokens</td>
                        <td className="metric">{runs[0].tokA}</td>
                        {!isSingleMode && <td className="metric">{runs[0].tokB}</td>}
                        {!isSingleMode && <td>{runs[0].tokA < runs[0].tokB ? 'A' : runs[0].tokA > runs[0].tokB ? 'B' : '='}</td>}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </section>

        {/* 전체 실행 로그/집계 */}
        <section className="panel" style={{gridColumn: '1 / -1'}}>
          <h2>실행 로그 & 집계</h2>
          <div className="content">
            <table className="log-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Query</th>
                  <th>Prompt A</th>
                  {!isSingleMode && <th className="b-column">Prompt B</th>}
                  <th>Faith.</th>
                  <th>Rel.</th>
                  <th>CtxP</th>
                  <th>CtxR</th>
                  {!isSingleMode && <th className="b-column">Sim</th>}
                  {!isSingleMode && <th className="b-column">Winner</th>}
                  <th>LatencyA</th>
                  {!isSingleMode && <th className="b-column">LatencyB</th>}
                  <th>TokensA</th>
                  {!isSingleMode && <th className="b-column">TokensB</th>}
                </tr>
              </thead>
              <tbody>
                {runs.map((run, index) => (
                  <tr key={run.time}>
                    <td>{index + 1}</td>
                    <td>{run.query.slice(0, 120)}</td>
                    <td>{run.promptA.name}</td>
                    {!isSingleMode && <td className="b-column">{run.promptB.name}</td>}
                    <td className="metric">{run.scores.A.faithfulness.toFixed(2)}</td>
                    <td className="metric">{run.scores.A.relevancy.toFixed(2)}</td>
                    <td className="metric">{run.scores.A.ctxPrecision.toFixed(2)}</td>
                    <td className="metric">{run.scores.A.ctxRecall.toFixed(2)}</td>
                    {!isSingleMode && <td className="b-column metric">{run.sim}%</td>}
                    {!isSingleMode && <td className="b-column">-</td>}
                    <td className="metric">{run.latA}</td>
                    {!isSingleMode && <td className="b-column metric">{run.latB}</td>}
                    <td className="metric">{run.tokA}</td>
                    {!isSingleMode && <td className="b-column metric">{run.tokB}</td>}
                  </tr>
                ))}
              </tbody>
            </table>

            {runs.length > 0 && (
              <div style={{marginTop: '12px'}}>
                <div className="card">
                  <strong>집계 요약</strong>
                  <div className="kv" style={{marginTop: '8px'}}>
                    <div>평균 Faithfulness</div>
                    <div>{runs.reduce((sum, run) => sum + run.scores.A.faithfulness, 0) / runs.length}</div>
                    <div>평균 Relevancy</div>
                    <div>{runs.reduce((sum, run) => sum + run.scores.A.relevancy, 0) / runs.length}</div>
                    <div>평균 Ctx Precision</div>
                    <div>{runs.reduce((sum, run) => sum + run.scores.A.ctxPrecision, 0) / runs.length}</div>
                    <div>평균 Ctx Recall</div>
                    <div>{runs.reduce((sum, run) => sum + run.scores.A.ctxRecall, 0) / runs.length}</div>
                    <div>평균 Latency(ms)</div>
                    <div>{runs.reduce((sum, run) => sum + run.latA, 0) / runs.length}</div>
                    <div>평균 Tokens</div>
                    <div>{runs.reduce((sum, run) => sum + run.tokA, 0) / runs.length}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>

      <footer>
        A/B 테스트 화면 예시 — 프롬프트 버전은 GitLab, 실행/지표 저장은 MLflow 연동 추천 · CSV 내보내기는 우측 상단 버튼
      </footer>
    </div>
  );
};

export default DashboardPage;
