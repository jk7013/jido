import React from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../components/Header';

const LogsSinglePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const runId = searchParams.get('run') || '';

  return (
    <div>
      <Header />
      <div className="container">
        <h1>단일 로그 보기</h1>
        <p>Run ID: {runId || '없음'}</p>
        <p>여기에 단일 로그가 표시됩니다.</p>
      </div>
    </div>
  );
};

export default LogsSinglePage;