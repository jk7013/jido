import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface HeaderProps {
  onExportCSV?: () => void;
  runCount?: number;
  isSingleMode?: boolean;
}

const Header: React.FC<HeaderProps> = ({ onExportCSV, runCount = 0, isSingleMode = false }) => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // 모드에 따른 적절한 경로 결정
  const getResultsPath = () => {
    return isSingleMode ? '/results/single' : '/results/ab';
  };

  const getLogsPath = () => {
    return isSingleMode ? '/logs/single' : '/logs/ab';
  };

  return (
    <header>
      <h1>PromptOps</h1>
      <div className="right">
        <button className="ghost" onClick={onExportCSV}>
          CSV로 내보내기
        </button>
        <Link 
          to={getResultsPath()} 
          className="ghost"
        >
          결과 보기
        </Link>
        <Link 
          to={getLogsPath()} 
          className="ghost"
        >
          로그 보기
        </Link>
        <button className="ghost" onClick={() => {/* GitLab 다이얼로그 열기 */}}>
          <img src="/gitlab.svg" alt="GitLab" style={{width:16, verticalAlign:'middle', marginRight:4}} />
          GitLab
        </button>
        <span className="muted">runs: {runCount}</span>
      </div>
    </header>
  );
};

export default Header;
