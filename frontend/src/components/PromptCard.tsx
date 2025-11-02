import React, { useState } from 'react';
import PromptSideSheet from './PromptSideSheet';

interface Prompt {
  template: string;
  params: {
    temperature: number;
    top_p: number;
  };
  variables_sample: string;
}

interface PromptCardProps {
  side: 'A' | 'B';
  prompt: Prompt;
  onSave: (prompt: Prompt) => void;
}

function PromptCard({ side, prompt, onSave }: PromptCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [sheet, setSheet] = useState<null | 'view' | 'edit'>(null);

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  const handleView = () => {
    setSheet('view');
    setMenuOpen(false);
  };

  const handleEdit = () => {
    setSheet('edit');
    setMenuOpen(false);
  };

  const handleSave = (updatedPrompt: Prompt) => {
    onSave(updatedPrompt);
    setSheet(null);
  };

  const handleClose = () => {
    setSheet(null);
  };

  return (
    <section className="card">
      <header className="cardHeader">
        <h3>Prompt {side}</h3>
        <div className="actions">
          <button className="ghost" onClick={handleMenuToggle}>
            보기/수정 ▾
          </button>
          {menuOpen && (
            <div role="menu" className="menu">
              <button onClick={handleView}>보기</button>
              <button onClick={handleEdit}>수정</button>
            </div>
          )}
        </div>
      </header>
      
      <PromptSideSheet
        mode={sheet}
        side={side}
        value={prompt}
        open={!!sheet}
        onClose={handleClose}
        onSave={handleSave}
      />
    </section>
  );
}

export default PromptCard;


