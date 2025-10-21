import { Run } from '../stores/useRunsStore';

export interface CSVRow {
  utc_ts: string;
  run_id: string;
  mode: 'single' | 'ab';
  prompt_version: string;
  model: string;
  params_hash: string;
  tokens_in: number;
  tokens_out: number;
  latency_ms: number;
  cost_usd: number;
  faith?: number;
  rel?: number;
  ctxp?: number;
  ctxr?: number;
  sim?: number;
  winner?: string;
  error_code?: string;
}

export function toCSV(rows: CSVRow[]): string {
  const headers = [
    'utc_ts',
    'run_id', 
    'mode',
    'prompt_version',
    'model',
    'params_hash',
    'tokens_in',
    'tokens_out',
    'latency_ms',
    'cost_usd',
    'faith',
    'rel',
    'ctxp',
    'ctxr',
    'sim',
    'winner',
    'error_code'
  ];
  
  const lines = [headers.join(',')];
  
  for (const row of rows) {
    const values = headers.map(header => {
      const value = row[header as keyof CSVRow];
      if (value === undefined || value === null) return '';
      return JSON.stringify(value);
    });
    lines.push(values.join(','));
  }
  
  return lines.join('\n');
}

export function downloadCSV(data: string, filename: string) {
  const blob = new Blob([data], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

export function generateFilename(page: string, runId: string): string {
  const now = new Date();
  const timestamp = now.toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}Z$/, '')
    .replace('T', '_');
  
  return `jido_${page}_${runId}_${timestamp}.csv`;
}
