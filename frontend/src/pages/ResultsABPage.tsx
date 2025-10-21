import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Header from '../components/Header';
import MetaChips from '../components/MetaChips';
import TraceId from '../components/TraceId';
import RawProcessedTabs from '../components/RawProcessedTabs';
import { runsApi } from '../api/runs';

const ResultsABPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const runId = searchParams.get('run') || '';
  const arm = searchParams.get('arm') || 'a';
  const metric = searchParams.get('metric') || 'faithfulness';

  const { data: result, isLoading, error } = useQuery({
    queryKey: ['results', runId],
    queryFn: () => runsApi.getResults(runId),
    enabled: !!runId,
  });

  const [currentArm, setCurrentArm] = useState<'a' | 'b'>(arm as 'a' | 'b');

  useEffect(() => {
    setCurrentArm(arm as 'a' | 'b');
  }, [arm]);

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

  if (error || !result) {
    return (
      <div>
        <Header />
        <div className="container">
          <div className="card" style={{ color: 'var(--bad)' }}>
            <h2>오류</h2>
            <p>결과를 불러올 수 없습니다.</p>
            {result?.run?.trace_id && <TraceId id={result.run.trace_id} />}
          </div>
        </div>
      </div>
    );
  }

  const handleExportCSV = () => {
    // CSV 내보내기 로직
    console.log('CSV 내보내기');
  };

  return (
    <div>
      <Header />
      <div className="container">
        <div className="align-right">
          <button className="ghost" onClick={handleExportCSV}>Export to CSV</button>
          <Link to="/logs/ab" className="ghost">View Logs</Link>
          <Link to="/dashboard" className="ghost">← 대시보드</Link>
        </div>

        <main>
          <div className="panel">
            <div className="inner">
              <div className="title">A/B Test Results</div>
              
              {result.run && <MetaChips meta={result.run} />}
              {result.run?.trace_id && <TraceId id={result.run.trace_id} />}
              
              {/* A/B 패널 */}
              <div className="ab-panel" style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr', 
                gap: '16px',
                marginTop: '16px'
              }}>
                <div className="panel">
                  <div className="inner">
                    <div className="title">Prompt A</div>
                    <RawProcessedTabs 
                      raw={result.result?.a} 
                      path={result.json_path || ''} 
                    />
                  </div>
                </div>
                
                <div className="panel">
                  <div className="inner">
                    <div className="title">Prompt B</div>
                    <RawProcessedTabs 
                      raw={result.result?.b} 
                      path={result.json_path || ''} 
                    />
                  </div>
                </div>
              </div>

              {/* 지표 테이블 */}
              <div style={{ marginTop: '16px' }}>
                <div className="title">지표 비교</div>
                <table className="metric-table">
                  <thead>
                    <tr>
                      <th scope="col">지표</th>
                      <th scope="col">A</th>
                      <th scope="col">B</th>
                      <th scope="col">우세</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Faithfulness</td>
                      <td>{result.result?.metrics?.a?.faithfulness || '—'}</td>
                      <td>{result.result?.metrics?.b?.faithfulness || '—'}</td>
                      <td>
                        {result.result?.metrics?.a?.faithfulness > result.result?.metrics?.b?.faithfulness ? 'A' : 'B'}
                      </td>
                    </tr>
                    <tr>
                      <td>Answer Relevancy</td>
                      <td>{result.result?.metrics?.a?.relevancy || '—'}</td>
                      <td>{result.result?.metrics?.b?.relevancy || '—'}</td>
                      <td>
                        {result.result?.metrics?.a?.relevancy > result.result?.metrics?.b?.relevancy ? 'A' : 'B'}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ResultsABPage;
