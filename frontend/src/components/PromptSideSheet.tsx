import React, { useState, useEffect } from 'react';

interface Prompt {
  template: string;
  params: {
    temperature: number;
    top_p: number;
  };
  variables_sample: string;
}

interface PromptSideSheetProps {
  open: boolean;
  mode: 'view' | 'edit' | null;
  side: 'A' | 'B';
  value: Prompt;
  onClose: () => void;
  onSave: (prompt: Prompt) => void;
}

export function PromptSideSheet({ 
  open, 
  mode, 
  side, 
  value, 
  onClose, 
  onSave 
}: PromptSideSheetProps) {
  const [tab, setTab] = useState<'tpl' | 'params' | 'vars'>('tpl');
  const [draft, setDraft] = useState<Prompt>(value);

  useEffect(() => {
    if (open) {
      setDraft(value);
    }
  }, [open, value]);

  if (!open) return null;

  const handleSave = () => {
    onSave(draft);
    onClose();
  };

  const handlePreview = () => {
    // 미리보기 로직 (구현 필요)
    console.log('Preview:', draft);
  };

  return (
    <aside className="sideSheet" role="dialog" aria-modal>
      <header className="sideHeader">
        <strong>Prompt {side} {mode === 'edit' ? '수정' : '보기'}</strong>
        <button className="ghost" onClick={onClose} aria-label="닫기">
          ✕
        </button>
      </header>
      
      <nav className="tabs">
        <button 
          className={tab === 'tpl' ? 'active' : ''} 
          onClick={() => setTab('tpl')}
        >
          Template
        </button>
        <button 
          className={tab === 'params' ? 'active' : ''} 
          onClick={() => setTab('params')}
        >
          Parameters
        </button>
        <button 
          className={tab === 'vars' ? 'active' : ''} 
          onClick={() => setTab('vars')}
        >
          Variables
        </button>
      </nav>
      
      <div className="sheetBody">
        {tab === 'tpl' && (
          mode === 'view' ? (
            <pre className="tplRead">{value.template}</pre>
          ) : (
            <textarea 
              className="tplEdit" 
              value={draft.template} 
              onChange={e => setDraft({ ...draft, template: e.target.value })}
              placeholder="프롬프트 템플릿을 입력하세요..."
            />
          )
        )}
        
        {tab === 'params' && (
          <div className="grid">
            <label>
              temperature
              <input 
                type="number" 
                step="0.01" 
                min="0" 
                max="2"
                value={draft.params.temperature}
                onChange={e => setDraft({ 
                  ...draft, 
                  params: { ...draft.params, temperature: +e.target.value }
                })}
              />
            </label>
            <label>
              top_p
              <input 
                type="number" 
                step="0.01" 
                min="0" 
                max="1"
                value={draft.params.top_p}
                onChange={e => setDraft({ 
                  ...draft, 
                  params: { ...draft.params, top_p: +e.target.value }
                })}
              />
            </label>
          </div>
        )}
        
        {tab === 'vars' && (
          <textarea 
            className="varsEdit" 
            value={draft.variables_sample}
            onChange={e => setDraft({ ...draft, variables_sample: e.target.value })}
            placeholder='{"query":"...","user":"..."}'
          />
        )}
      </div>
      
      <footer className="sheetFooter">
        <button className="ghost" onClick={onClose}>
          취소
        </button>
        {mode === 'edit' && (
          <>
            <button onClick={handlePreview}>
              미리보기
            </button>
            <button className="primary" onClick={handleSave}>
              저장
            </button>
          </>
        )}
      </footer>
    </aside>
  );
}


