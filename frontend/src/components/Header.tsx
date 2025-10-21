import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useRunsStore } from '../stores/useRunsStore';

const Header: React.FC = () => {
  const location = useLocation();
  const { runs } = useRunsStore();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header>
      <h1>PromptOps</h1>
      <nav className="top-menu">
        <Link 
          to="/dashboard" 
          className={`ghost ${isActive('/dashboard') ? 'active' : ''}`}
        >
          대시보드
        </Link>
        <Link 
          to="/results/ab" 
          className={`ghost ${isActive('/results/ab') || isActive('/results/single') ? 'active' : ''}`}
        >
          결과 보기
        </Link>
        <Link 
          to="/logs/ab" 
          className={`ghost ${isActive('/logs/ab') || isActive('/logs/single') ? 'active' : ''}`}
        >
          로그 보기
        </Link>
        <button className="ghost" onClick={() => {/* GitLab 다이얼로그 열기 */}}>
          <img src="/gitlab.svg" alt="GitLab" style={{width:16, verticalAlign:'middle', marginRight:4}} />
          GitLab
        </button>
      </nav>
    </header>
  );
};

export default Header;
