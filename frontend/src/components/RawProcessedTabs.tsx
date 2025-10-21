import React, { useState, useEffect } from 'react';
import JsonViewer from './JsonViewer';

interface RawProcessedTabsProps {
  raw: any;
  path: string;
}

const RawProcessedTabs: React.FC<RawProcessedTabsProps> = ({ raw, path }) => {
  const [tab, setTab] = useState<'processed' | 'raw'>('processed');
  const [processed, setProcessed] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (tab === 'processed') {
      try {
        // JSONPath 적용 로직 (간단한 구현)
        if (path && raw) {
          // 실제로는 jsonpath 라이브러리 사용
          const result = JSON.stringify(raw, null, 2);
          setProcessed(result);
          setError(null);
        } else {
          setProcessed(JSON.stringify(raw, null, 2));
          setError(null);
        }
      } catch (err) {
        setError('파싱 실패');
        setProcessed(undefined);
      }
    }
  }, [tab, raw, path]);

  useEffect(() => {
    if (tab === 'processed' && processed === undefined && error) {
      setTab('raw');
      // 토스트 알림 (구현 필요)
      console.log('파싱 실패 — Raw로 전환');
    }
  }, [tab, processed, error]);

  return (
    <div>
      <div className="tabs" style={{ 
        display: 'flex', 
        borderBottom: '1px solid var(--muted)',
        marginBottom: '16px'
      }}>
        <button 
          className={`tab ${tab === 'processed' ? 'active' : ''}`}
          onClick={() => setTab('processed')}
          style={{
            padding: '8px 16px',
            border: 'none',
            background: tab === 'processed' ? 'var(--accent)' : 'transparent',
            color: tab === 'processed' ? 'var(--bg)' : 'var(--text)',
            cursor: 'pointer',
            borderBottom: tab === 'processed' ? '2px solid var(--accent)' : '2px solid transparent'
          }}
        >
          Processed
        </button>
        <button 
          className={`tab ${tab === 'raw' ? 'active' : ''}`}
          onClick={() => setTab('raw')}
          style={{
            padding: '8px 16px',
            border: 'none',
            background: tab === 'raw' ? 'var(--accent)' : 'transparent',
            color: tab === 'raw' ? 'var(--bg)' : 'var(--text)',
            cursor: 'pointer',
            borderBottom: tab === 'raw' ? '2px solid var(--accent)' : '2px solid transparent'
          }}
        >
          Raw
        </button>
      </div>
      
      <JsonViewer 
        data={tab === 'processed' ? processed : raw} 
        error={tab === 'processed' ? error : null}
      />
    </div>
  );
};

export default RawProcessedTabs;
