import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Header from '../components/Header';
import MetaChips from '../components/MetaChips';
import TraceId from '../components/TraceId';
import RawProcessedTabs from '../components/RawProcessedTabs';
import { runsApi } from '../api/runs';

const ResultsSinglePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const runId = searchParams.get('run') || '';
  const view = searchParams.get('view') || 'processed';

  const { data: result, isLoading, error } = useQuery({
    queryKey: ['results', runId],
    queryFn: () => runsApi.getResults(runId),
    enabled: !!runId,
  });

  const [currentView, setCurrentView] = useState<'processed' | 'raw'>(view as 'processed' | 'raw');

  useEffect(() => {
    setCurrentView(view as 'processed' | 'raw');
  }, [view]);

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
          <Link to="/logs/single" className="ghost">View Logs</Link>
          <Link to="/dashboard" className="ghost">← 대시보드</Link>
        </div>

        <main>
          <div className="panel">
            <div className="inner">
              <div className="title">Single Result</div>
              
              {result.run && <MetaChips meta={result.run} />}
              {result.run?.trace_id && <TraceId id={result.run.trace_id} />}
              
              <div style={{ marginTop: '16px' }}>
                <RawProcessedTabs 
                  raw={result.raw} 
                  path={result.json_path || ''} 
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ResultsSinglePage;
