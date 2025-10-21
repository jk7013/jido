import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Header from '../components/Header';
import MetaChips from '../components/MetaChips';
import TraceId from '../components/TraceId';
import JsonViewer from '../components/JsonViewer';
import { runsApi } from '../api/runs';

const LogsABPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const runId = searchParams.get('run') || '';
  const tab = searchParams.get('tab') || 'llm';
  const side = searchParams.get('side') || 'a';

  const { data: logs, isLoading, error } = useQuery({
    queryKey: ['logs', runId, tab],
    queryFn: () => runsApi.getLogs(runId, tab),
    enabled: !!runId,
  });

  const [currentTab, setCurrentTab] = useState(tab);
  const [currentSide, setCurrentSide] = useState<'a' | 'b'>(side as 'a' | 'b');
  const [selectedStep, setSelectedStep] = useState<string | null>(null);

  useEffect(() => {
    setCurrentTab(tab);
  }, [tab]);

  useEffect(() => {
    setCurrentSide(side as 'a' | 'b');
  }, [side]);

  if (isLoading) {
    return (
      <div>
        <Header />
        <div className="container">
          <div className="card">로딩 중...</div>
        </div>
      </div>
    );
  }

  if (error || !logs) {
    return (
      <div>
        <Header />
        <div className="container">
          <div className="card" style={{ color: 'var(--bad)' }}>
            <h2>오류</h2>
            <p>로그를 불러올 수 없습니다.</p>
            {logs?.run?.trace_id && <TraceId id={logs.run.trace_id} />}
          </div>
        </div>
      </div>
    );
  }

  const tabs = ['llm', 'rin', 'rpc', 'qry', 'kql'];
  const selectedStepData = selectedStep ? logs.steps.find(s => s.id === selectedStep) : null;

  return (
    <div>
      <Header />
      <div className="container">
        <div className="align-right">
          <Link to="/results/ab" className="ghost">View Results</Link>
          <Link to="/dashboard" className="ghost">← 대시보드</Link>
        </div>

        <main>
          <div className="panel">
            <div className="inner">
              <div className="title">A/B Logs</div>
              
              {logs.run && <MetaChips meta={logs.run} />}
              {logs.run?.trace_id && <TraceId id={logs.run.trace_id} />}
              
              {/* 탭 네비게이션 */}
              <div className="tabs" style={{ 
                display: 'flex', 
                borderBottom: '1px solid var(--muted)',
                marginBottom: '16px'
              }}>
                {tabs.map(tabName => (
                  <button 
                    key={tabName}
                    className={`tab ${currentTab === tabName ? 'active' : ''}`}
                    onClick={() => setCurrentTab(tabName)}
                    style={{
                      padding: '8px 16px',
                      border: 'none',
                      background: currentTab === tabName ? 'var(--accent)' : 'transparent',
                      color: currentTab === tabName ? 'var(--bg)' : 'var(--text)',
                      cursor: 'pointer',
                      borderBottom: currentTab === tabName ? '2px solid var(--accent)' : '2px solid transparent'
                    }}
                  >
                    {tabName.toUpperCase()}
                  </button>
                ))}
              </div>

              {/* A/B 워터폴 */}
              <div className="ab-waterfall" style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr', 
                gap: '16px',
                marginBottom: '16px'
              }}>
                <div className="panel">
                  <div className="inner">
                    <div className="title">Side A</div>
                    <div className="steps-container">
                      {logs.steps.filter(s => s.step_type.includes('A')).map((step, index) => (
                        <div 
                          key={step.id}
                          className={`step ${selectedStep === step.id ? 'selected' : ''}`}
                          onClick={() => setSelectedStep(step.id)}
                          style={{
                            padding: '8px 12px',
                            border: '1px solid var(--muted)',
                            borderRadius: '4px',
                            marginBottom: '4px',
                            cursor: 'pointer',
                            background: selectedStep === step.id ? 'var(--accent)' : 'var(--panel)',
                            color: selectedStep === step.id ? 'var(--bg)' : 'var(--text)'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>{step.step_type}</span>
                            <span>{step.duration_ms}ms</span>
                          </div>
                          {step.model && (
                            <div style={{ fontSize: '12px', opacity: 0.7 }}>
                              {step.model} • {step.tokens_in || 0} → {step.tokens_out || 0} tokens
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="panel">
                  <div className="inner">
                    <div className="title">Side B</div>
                    <div className="steps-container">
                      {logs.steps.filter(s => s.step_type.includes('B')).map((step, index) => (
                        <div 
                          key={step.id}
                          className={`step ${selectedStep === step.id ? 'selected' : ''}`}
                          onClick={() => setSelectedStep(step.id)}
                          style={{
                            padding: '8px 12px',
                            border: '1px solid var(--muted)',
                            borderRadius: '4px',
                            marginBottom: '4px',
                            cursor: 'pointer',
                            background: selectedStep === step.id ? 'var(--accent)' : 'var(--panel)',
                            color: selectedStep === step.id ? 'var(--bg)' : 'var(--text)'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>{step.step_type}</span>
                            <span>{step.duration_ms}ms</span>
                          </div>
                          {step.model && (
                            <div style={{ fontSize: '12px', opacity: 0.7 }}>
                              {step.model} • {step.tokens_in || 0} → {step.tokens_out || 0} tokens
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 선택된 스텝 상세 */}
              {selectedStepData && (
                <div className="step-detail">
                  <div className="title">스텝 상세</div>
                  <JsonViewer data={selectedStepData.data} />
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default LogsABPage;
