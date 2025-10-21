import React from 'react';
import { Virtuoso } from 'react-virtuoso';

interface JsonViewerProps {
  data: any;
  error?: string | null;
}

const JsonViewer: React.FC<JsonViewerProps> = ({ data, error }) => {
  if (error) {
    return (
      <div style={{ 
        padding: '16px', 
        background: 'var(--panel)', 
        border: '1px solid var(--bad)',
        borderRadius: '8px',
        color: 'var(--bad)'
      }}>
        <strong>오류:</strong> {error}
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{ 
        padding: '16px', 
        background: 'var(--panel)', 
        border: '1px solid var(--muted)',
        borderRadius: '8px',
        color: 'var(--sub)'
      }}>
        데이터가 없습니다.
      </div>
    );
  }

  const formatJson = (obj: any): string => {
    try {
      return JSON.stringify(obj, null, 2);
    } catch {
      return String(obj);
    }
  };

  const jsonString = formatJson(data);
  const lines = jsonString.split('\n');

  // 대용량 JSON의 경우 가상 스크롤 사용
  if (lines.length > 200) {
    return (
      <div style={{ 
        height: '400px', 
        background: 'var(--panel)', 
        border: '1px solid var(--muted)',
        borderRadius: '8px',
        overflow: 'hidden'
      }}>
        <Virtuoso
          data={lines}
          itemContent={(index, line) => (
            <div 
              key={index}
              style={{ 
                padding: '2px 8px',
                fontFamily: 'monospace',
                fontSize: '12px',
                lineHeight: '1.4',
                whiteSpace: 'pre'
              }}
            >
              {line}
            </div>
          )}
        />
      </div>
    );
  }

  // 일반 JSON 표시
  return (
    <pre style={{ 
      background: 'var(--panel)', 
      border: '1px solid var(--muted)',
      borderRadius: '8px',
      padding: '16px',
      overflow: 'auto',
      fontFamily: 'monospace',
      fontSize: '12px',
      lineHeight: '1.4',
      whiteSpace: 'pre-wrap'
    }}>
      {jsonString}
    </pre>
  );
};

export default JsonViewer;
