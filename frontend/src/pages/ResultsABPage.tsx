import React, { useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import ABPanel from '../components/ABPanel';
import { useSyncedScroll } from '../hooks/useSyncedScroll';
import '../styles/results.css';

const ResultsABPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const runId = searchParams.get('run') || '';
  const [expanded, setExpanded] = useState(false);

  // 동기 스크롤을 위한 ref
  const panelARef = useRef<HTMLDivElement>(null);
  const panelBRef = useRef<HTMLDivElement>(null);
  useSyncedScroll(panelARef, panelBRef);

  // 데모용 데이터
  const demoData = {
    query: 'dfafdsf',
    armA: {
      latency: 719,
      tokens: 173,
      faithfulness: 0.99,
      relevancy: 0.71,
      ctxPrecision: 0.87,
      ctxRecall: 0.97,
      answer: '[internal-llm] "dfafdsf"에 대한 응답 예시. 템플릿 일부: ...',
      model: 'internal-llm-rag@v2',
      cost_usd: 0.0045,
      param_hash: 'abc123',
      prompt_version: 'v1.2.3'
    },
    armB: {
      latency: 773,
      tokens: 389,
      faithfulness: 0.99,
      relevancy: 0.77,
      ctxPrecision: 0.74,
      ctxRecall: 0.67,
      answer: '[internal-llm] "dfafdsf"에 대한 응답 예시. 템플릿 일부: ...',
      model: 'internal-llm-rag@v2',
      cost_usd: 0.0089,
      param_hash: 'def456',
      prompt_version: 'v1.2.4'
    }
  };

  const rawDataA = {
    response: demoData.armA.answer,
    metadata: {
      model: demoData.armA.model,
      latency: demoData.armA.latency,
      tokens: demoData.armA.tokens
    }
  };

  const rawDataB = {
    response: demoData.armB.answer,
    metadata: {
      model: demoData.armB.model,
      latency: demoData.armB.latency,
      tokens: demoData.armB.tokens
    }
  };

  const handleCopyTrace = () => {
    navigator.clipboard.writeText(runId);
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
        <div className="abContainer">
          <div className="abPanel" ref={panelARef}>
            <ABPanel
              side="A"
              data={{
                query: demoData.query,
                answer: demoData.armA.answer,
                latency: demoData.armA.latency,
                tokens: demoData.armA.tokens,
                faithfulness: demoData.armA.faithfulness,
                relevancy: demoData.armA.relevancy,
                ctxPrecision: demoData.armA.ctxPrecision,
                ctxRecall: demoData.armA.ctxRecall,
                model: demoData.armA.model,
                cost_usd: demoData.armA.cost_usd,
                param_hash: demoData.armA.param_hash,
                prompt_version: demoData.armA.prompt_version
              }}
              rawData={rawDataA}
              jsonPath="$.response"
              onCopyTrace={handleCopyTrace}
              onExportCSV={handleExportCSV}
              onGitLab={handleGitLab}
            />
          </div>

          <div className="abPanel" ref={panelBRef}>
            <ABPanel
              side="B"
              data={{
                query: demoData.query,
                answer: demoData.armB.answer,
                latency: demoData.armB.latency,
                tokens: demoData.armB.tokens,
                faithfulness: demoData.armB.faithfulness,
                relevancy: demoData.armB.relevancy,
                ctxPrecision: demoData.armB.ctxPrecision,
                ctxRecall: demoData.armB.ctxRecall,
                model: demoData.armB.model,
                cost_usd: demoData.armB.cost_usd,
                param_hash: demoData.armB.param_hash,
                prompt_version: demoData.armB.prompt_version
              }}
              rawData={rawDataB}
              jsonPath="$.response"
              onCopyTrace={handleCopyTrace}
              onExportCSV={handleExportCSV}
              onGitLab={handleGitLab}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default ResultsABPage;