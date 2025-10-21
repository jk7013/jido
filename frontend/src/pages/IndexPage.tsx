import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';

const IndexPage: React.FC = () => {
  return (
    <div>
      <Header />
      <div className="container">
        <div className="align-right">
          <Link to="/dashboard" className="ghost">대시보드</Link>
          <Link to="/dashboard" className="primary">연결 시작하기</Link>
        </div>

        <main className="hero" role="main">
          {/* 왼쪽: 온보딩 카드들 */}
          <section className="panel">
            <div className="inner">
              <div className="title">안녕하세요! 시작해볼까요?</div>
              <p className="subtitle">연결을 만들면 바로 프롬프트 테스트가 가능해요. 키는 저장 후 다시 볼 수 없어요(보안상).</p>

              <div className="grid-2" style={{marginTop: '12px'}}>
                <div className="card">
                  <label>빠른 시작 (샘플)</label>
                  <div className="chips" style={{marginTop: '6px'}}>
                    <button className="ghost">OpenAI 샘플 불러오기</button>
                    <button className="ghost">사내 LLM 샘플</button>
                  </div>
                  <p className="footer-note">샘플은 폼을 자동으로 채워줘요. 실제 호출은 하지 않아요.</p>
                </div>
                <div className="card">
                  <label>이미 연결했나요?</label>
                  <p className="subtitle">대시보드에서 바로 테스트를 실행할 수 있어요.</p>
                  <Link to="/dashboard" className="ghost">대시보드 열기</Link>
                </div>
              </div>

              <div style={{marginTop: '12px'}}>
                <label>무엇을 할 수 있나요?</label>
                <ul className="subtitle" style={{margin: '0 0 4px 18px'}}>
                  <li>싱글/AB 테스트로 프롬프트 품질 비교</li>
                  <li>결과·로그 확인 및 CSV 내보내기</li>
                  <li>GitLab 커밋으로 버전 고정</li>
                </ul>
              </div>

              <div style={{marginTop: '8px'}}>
                <Link to="/dashboard" className="primary">연결 만들기 마법사 열기</Link>
              </div>
            </div>
          </section>

          {/* 오른쪽: 상태 프리뷰 */}
          <aside className="panel" aria-labelledby="statusTitle">
            <div className="inner">
              <div className="title" id="statusTitle">현재 상태</div>
              <div className="chips" style={{margin: '10px 0 6px'}}>
                <span className="chip">MODE: <strong>OFFLINE</strong></span>
                <span className="chip">연결: <strong>없음</strong></span>
                <span className="chip">비용 캡: <strong>on</strong></span>
              </div>
              <div style={{marginTop: '8px'}}>
                <label>최근 변경 사항</label>
                <div className="card empty" id="changelog">아직 변경된 내용이 없어요.</div>
              </div>
              <div style={{marginTop: '8px'}}>
                <label>다음 단계</label>
                <ol className="subtitle" style={{margin: '0 0 0 18px'}}>
                  <li>연결 만들기 마법사 실행</li>
                  <li>대시보드에서 프롬프트 작성</li>
                  <li>테스트 실행 → 결과/로그 확인</li>
                </ol>
              </div>
            </div>
          </aside>
        </main>
      </div>
    </div>
  );
};

export default IndexPage;
