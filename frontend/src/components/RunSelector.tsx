import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRunsStore } from '../stores/useRunsStore';
import { runsApi } from '../api/runs';

interface RunSelectorProps {
  onSelect: (runId: string) => void;
  selectedRunId?: string;
}

const RunSelector: React.FC<RunSelectorProps> = ({ onSelect, selectedRunId }) => {
  const { searchQuery, setSearchQuery, currentPage, setCurrentPage } = useRunsStore();
  const [localSearch, setLocalSearch] = useState(searchQuery);

  const { data, isLoading } = useQuery({
    queryKey: ['runs', searchQuery, currentPage],
    queryFn: () => runsApi.getRuns({ 
      limit: 20, 
      search: searchQuery, 
      page: currentPage 
    }),
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(localSearch);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (isLoading) {
    return <div className="card">로딩 중...</div>;
  }

  return (
    <div className="run-selector">
      <div className="title">최근 실행</div>
      
      {/* 검색 */}
      <form onSubmit={handleSearch} style={{ marginBottom: '16px' }}>
        <input
          type="text"
          placeholder="실행 검색..."
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          style={{ width: '100%', marginBottom: '8px' }}
        />
        <button type="submit" className="ghost">검색</button>
      </form>

      {/* 실행 목록 */}
      <div className="runs-list" style={{ maxHeight: '300px', overflow: 'auto' }}>
        {data?.runs.map((run) => (
          <div
            key={run.id}
            className={`run-item ${selectedRunId === run.id ? 'selected' : ''}`}
            onClick={() => onSelect(run.id)}
            style={{
              padding: '8px 12px',
              border: '1px solid var(--muted)',
              borderRadius: '4px',
              marginBottom: '4px',
              cursor: 'pointer',
              background: selectedRunId === run.id ? 'var(--accent)' : 'var(--panel)',
              color: selectedRunId === run.id ? 'var(--bg)' : 'var(--text)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>{run.id.slice(0, 8)}...</span>
              <span>{run.model}</span>
            </div>
            <div style={{ fontSize: '12px', opacity: 0.7 }}>
              {run.prompt_version} • {run.latency_ms}ms • ${run.cost_usd.toFixed(4)}
            </div>
          </div>
        ))}
      </div>

      {/* 페이지네이션 */}
      {data && data.total > 20 && (
        <div className="pagination" style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '8px',
          marginTop: '16px'
        }}>
          <button 
            className="ghost"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            이전
          </button>
          <span>{currentPage} / {Math.ceil(data.total / 20)}</span>
          <button 
            className="ghost"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= Math.ceil(data.total / 20)}
          >
            다음
          </button>
        </div>
      )}
    </div>
  );
};

export default RunSelector;
