import React, { useState, useEffect, useMemo } from 'react';
import JsonViewer from './JsonViewer';
import { extractAnswer } from '../utils/extractAnswer';

interface RawProcessedTabsProps {
  raw: any;
  path?: string;
}

// 간단한 토스트 알림 함수 (임시)
const showToast = (message: string) => {
  console.log('Toast:', message);
  // 실제 토스트 컴포넌트가 구현되면 교체
};

const RawProcessedTabs: React.FC<RawProcessedTabsProps> = ({ raw, path }) => {
  const [tab, setTab] = useState<'processed' | 'raw'>('processed');
  const [error, setError] = useState<string | null>(null);

  // Processed 텍스트 추출
  const processed = useMemo(() => {
    try {
      return extractAnswer(raw, path);
    } catch (err) {
      setError('파싱 실패');
      return undefined;
    }
  }, [raw, path]);

  useEffect(() => {
    if (tab === 'processed' && processed === undefined) {
      setTab('raw');
      showToast('파싱 실패 — Raw로 전환');
    }
  }, [tab, processed]);

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
