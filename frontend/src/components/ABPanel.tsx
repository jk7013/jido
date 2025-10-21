import React, { useRef } from 'react';
import { useSyncedScroll } from '../hooks/useSyncedScroll';
import RawProcessedTabs from './RawProcessedTabs';

interface ABPanelProps {
  left: {
    title: string;
    data: any;
    jsonPath?: string;
  };
  right: {
    title: string;
    data: any;
    jsonPath?: string;
  };
}

const ABPanel: React.FC<ABPanelProps> = ({ left, right }) => {
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  
  useSyncedScroll(leftRef, rightRef);

  return (
    <div className="ab-panel" style={{ 
      display: 'grid', 
      gridTemplateColumns: '1fr 1fr', 
      gap: '16px',
      height: '400px'
    }}>
      <div 
        ref={leftRef}
        className="panel"
        style={{ 
          overflow: 'auto',
          border: '1px solid var(--muted)',
          borderRadius: '8px'
        }}
      >
        <div className="inner">
          <div className="title">{left.title}</div>
          <RawProcessedTabs 
            raw={left.data} 
            path={left.jsonPath || ''} 
          />
        </div>
      </div>
      
      <div 
        ref={rightRef}
        className="panel"
        style={{ 
          overflow: 'auto',
          border: '1px solid var(--muted)',
          borderRadius: '8px'
        }}
      >
        <div className="inner">
          <div className="title">{right.title}</div>
          <RawProcessedTabs 
            raw={right.data} 
            path={right.jsonPath || ''} 
          />
        </div>
      </div>
    </div>
  );
};

export default ABPanel;
