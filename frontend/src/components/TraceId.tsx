import React from 'react';

interface TraceIdProps {
  id: string;
  className?: string;
}

const TraceId: React.FC<TraceIdProps> = ({ id, className = '' }) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(id);
    // 토스트 알림 (구현 필요)
  };

  return (
    <div className={`trace-id ${className}`} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <span>trace:</span>
      <code style={{ 
        background: 'var(--muted)', 
        padding: '2px 6px', 
        borderRadius: '4px',
        fontFamily: 'monospace',
        fontSize: '12px'
      }}>
        {id}
      </code>
      <button 
        className="ghost" 
        onClick={copyToClipboard}
        style={{ padding: '2px 6px', fontSize: '12px' }}
        title="클릭하여 복사"
      >
        복사
      </button>
    </div>
  );
};

export default TraceId;
