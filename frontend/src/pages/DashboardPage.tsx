import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';

const DashboardPage: React.FC = () => {
  return (
    <div>
      <Header />
      <div className="container">
        <div className="align-right">
          <button className="ghost">Export to CSV</button>
          <Link to="/results/ab" className="ghost">View Results</Link>
          <Link to="/logs/ab" className="ghost">View Logs</Link>
          <button className="ghost">
            <img src="/gitlab.svg" alt="GitLab" style={{width:16, verticalAlign:'middle', marginRight:4}} />
            GitLab
          </button>
        </div>

        <main className="hero" role="main">
          {/* 왼쪽: 실행 컨트롤 */}
          <section className="panel">
            <div className="inner">
              <div className="title">실행 컨트롤</div>
              
              <div style={{marginBottom: '16px'}}>
                <label>모드 선택</label>
                <div className="toggle-switch">
                  <input type="checkbox" id="modeToggle" />
                  <label htmlFor="modeToggle">
                    <span className="toggle-label">Single Mode</span>
                    <span className="toggle-label">A/B Mode</span>
                  </label>
                </div>
              </div>

              <div className="row">
                <label htmlFor="promptA">프롬프트 A (버전/설명)</label>
                <input id="promptA" placeholder="예: legal_rag_v0.3.4 (strict)" />
              </div>

              <div className="row">
                <label htmlFor="promptATemplate">프롬프트 A 템플릿</label>
                <textarea id="promptATemplate" placeholder="예: 시스템 지침 + 요약/근거 제시 요구..."></textarea>
              </div>

              <div className="row">
                <label htmlFor="userQuestion">사용자 질문</label>
                <input id="userQuestion" placeholder='예: "회사차를 타고 가면 사규에 어긋나?"' />
              </div>

              <div className="row">
                <label htmlFor="evaluationOptions">평가 옵션</label>
                <select id="evaluationOptions">
                  <option>Auto Judge (LLM 기반)</option>
                </select>
              </div>

              <div className="row">
                <label htmlFor="modelEndpoint">모델/엔드포인트 (표기용)</label>
                <input id="modelEndpoint" placeholder="예: internal-llm-rag@v2" />
              </div>

              <div className="align-right" style={{marginTop: '16px'}}>
                <button className="ghost">화면 초기화</button>
                <button className="primary">실행</button>
              </div>
            </div>
          </section>

          {/* 오른쪽: 최근 실행 결과 */}
          <aside className="panel">
            <div className="inner">
              <div className="title">최근 실행 결과</div>
              <div className="card empty">
                아직 실행된 결과가 없어요.
              </div>
            </div>
          </aside>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
