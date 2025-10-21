import React from 'react';

interface MetaChipsProps {
  meta: {
    model?: string;
    tokens_in?: number;
    tokens_out?: number;
    latency_ms?: number;
    cost_usd?: number;
    param_hash?: string;
    prompt_version?: string;
  };
}

const MetaChips: React.FC<MetaChipsProps> = ({ meta }) => {
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    // 토스트 알림 (구현 필요)
  };

  const formatValue = (value: any, type: 'number' | 'string' | 'currency' = 'string') => {
    if (value === undefined || value === null) return '—';
    
    switch (type) {
      case 'number':
        return typeof value === 'number' ? value.toLocaleString() : value;
      case 'currency':
        return typeof value === 'number' ? `$${value.toFixed(4)}` : value;
      case 'string':
      default:
        return String(value);
    }
  };

  const chips = [
    { label: 'Model', value: meta.model, type: 'string' as const },
    { label: 'Tokens In', value: meta.tokens_in, type: 'number' as const },
    { label: 'Tokens Out', value: meta.tokens_out, type: 'number' as const },
    { label: 'Latency', value: meta.latency_ms, type: 'number' as const, suffix: 'ms' },
    { label: 'Cost', value: meta.cost_usd, type: 'currency' as const },
    { label: 'Param Hash', value: meta.param_hash?.slice(0, 6), type: 'string' as const },
    { label: 'Prompt Ver', value: meta.prompt_version, type: 'string' as const },
  ];

  return (
    <div className="chips" style={{ marginBottom: '16px' }}>
      {chips.map((chip) => {
        const displayValue = chip.value !== undefined && chip.value !== null 
          ? `${formatValue(chip.value, chip.type)}${chip.suffix || ''}`
          : '—';
        
        return (
          <span 
            key={chip.label}
            className="chip" 
            onClick={() => copyToClipboard(String(chip.value || ''), chip.label)}
            style={{ cursor: 'pointer' }}
            title={`${chip.label}: ${displayValue} (클릭하여 복사)`}
          >
            <strong>{chip.label}:</strong> {displayValue}
          </span>
        );
      })}
    </div>
  );
};

export default MetaChips;
