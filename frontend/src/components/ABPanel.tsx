import React, { useRef } from 'react';
import { useSyncedScroll } from '../hooks/useSyncedScroll';
import RawProcessedTabs from './RawProcessedTabs';
import MetaChips from './MetaChips';

interface ABPanelProps {
  side: 'A' | 'B';
  data: {
    query: string;
    answer: string;
    latency: number;
    tokens: number;
    faithfulness: number;
    relevancy: number;
    ctxPrecision: number;
    ctxRecall: number;
    model?: string;
    cost_usd?: number;
    param_hash?: string;
    prompt_version?: string;
  };
  rawData?: any;
  jsonPath?: string;
  onCopyTrace?: () => void;
  onExportCSV?: () => void;
  onGitLab?: () => void;
}

const ABPanel: React.FC<ABPanelProps> = ({
  side,
  data,
  rawData,
  jsonPath,
  onCopyTrace,
  onExportCSV,
  onGitLab
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const otherContentRef = useRef<HTMLDivElement>(null);
  
  // 동기 스크롤 (다른 패널과 연결)
  useSyncedScroll(contentRef, otherContentRef);

  const meta = {
    model: data.model,
    tokens_in: data.tokens,
    latency_ms: data.latency,
    cost_usd: data.cost_usd,
    param_hash: data.param_hash,
    prompt_version: data.prompt_version
  };

  return (
    <section className="abPanel">
      <header className="panelHeader">
        <div className="metaRow">
          <div className="arm-header">
            <div className={`status-dot ${side === 'A' ? 'good' : 'bad'}`}></div>
            <div className="arm-metrics">
              <span>Latency: {data.latency} ms</span>
              <span>Tokens: {data.tokens}</span>
              <span>Faith/Rel/CtxP/CtxR: {data.faithfulness}/{data.relevancy}/{data.ctxPrecision}/{data.ctxRecall}</span>
            </div>
          </div>
          
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
            {onCopyTrace && (
              <button className="iconBtn" title="Copy trace" onClick={onCopyTrace}>
                ⧉
              </button>
            )}
            {onExportCSV && (
              <button className="iconBtn" title="Export CSV" onClick={onExportCSV}>
                ⇩
              </button>
            )}
            {onGitLab && (
              <button className="iconBtn" title="GitLab" onClick={onGitLab}>
                🟧
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="divider" />

      <div className="answerCard">
        <div className="sectionTitle">Query</div>
        <div className="queryChip">{data.query}</div>
        <div className="divider" />
        
        <div className="sectionTitle">Answer</div>
        {rawData && jsonPath ? (
          <RawProcessedTabs raw={rawData} path={jsonPath} />
        ) : (
          <div className="answerPane">{data.answer}</div>
        )}
      </div>

      <div className="metaChips">
        <MetaChips meta={meta} />
      </div>
    </section>
  );
};

export default ABPanel;