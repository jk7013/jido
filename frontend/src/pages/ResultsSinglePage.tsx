import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import RawProcessedTabs from '../components/RawProcessedTabs';
import MetaChips from '../components/MetaChips';
import '../styles/results.css';

const ResultsSinglePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const runId = searchParams.get('run');
  const [expanded, setExpanded] = useState(false);

  // 데모용 데이터
  const demoData = {
    query: '단일 모드 질문',
    answer: '[internal-llm] "단일 모드 질문"에 대한 응답 예시. 템플릿 일부: ...',
    latency: 350,
    tokens: 200,
    faithfulness: 0.95,
    relevancy: 0.90,
    ctxPrecision: 0.88,
    ctxRecall: 0.93,
    model: 'internal-llm-rag@v2',
    cost_usd: 0.0023,
    param_hash: 'abc123',
    prompt_version: 'v1.2.3'
  };

  const rawData = {
    response: demoData.answer,
    metadata: {
      model: demoData.model,
      latency: demoData.latency,
      tokens: demoData.tokens
    }
  };

  const meta = {
    model: demoData.model,
    tokens_in: demoData.tokens,
    latency_ms: demoData.latency,
    cost_usd: demoData.cost_usd,
    param_hash: demoData.param_hash,
    prompt_version: demoData.prompt_version
  };

  const text = demoData.answer;
  const tooLong = text.length > 1200;
  const shown = expanded ? text : text.slice(0, 1200);

  const handleCopyTrace = () => {
    navigator.clipboard.writeText(runId || '');
    console.log('Trace copied:', runId);
  };

  const handleExportCSV = () => {
    console.log('Export CSV');
  };

  const handleGitLab = () => {
    console.log('GitLab action');
  };

  return (
    <div className="result-view">
      <Header />
      <main className="mainFull">
        <header className="panelHeader">
          <div className="arm-header">
            <div className="status-dot good"></div>
            <div className="arm-metrics">
              <span>Latency: {demoData.latency} ms</span>
              <span>Tokens: {demoData.tokens}</span>
              <span>Faith/Rel/CtxP/CtxR: {demoData.faithfulness}/{demoData.relevancy}/{demoData.ctxPrecision}/{demoData.ctxRecall}</span>
            </div>
          </div>
          
          <div className="actionButtons">
            <button className="actionBtn" onClick={handleCopyTrace}>
              Copy Trace
            </button>
            <button className="actionBtn" onClick={handleExportCSV}>
              CSV
            </button>
            <button className="actionBtn" onClick={handleGitLab}>
              GitLab
            </button>
          </div>
        </header>

        <div className="divider" />

        <div className="answerCard">
          <div className="sectionTitle">Query</div>
          <div className="queryChip">{demoData.query}</div>
          <div className="divider" />
          
          <div className="sectionTitle">Answer</div>
          <RawProcessedTabs raw={rawData} path="$.response" />
          
          {tooLong && (
            <button 
              className="expandBtn" 
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? '접기' : '펼치기'}
            </button>
          )}
        </div>

        <div className="metaChips">
          <MetaChips meta={meta} />
        </div>
      </main>
    </div>
  );
};

export default ResultsSinglePage;