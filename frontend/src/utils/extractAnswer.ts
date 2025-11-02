/**
 * Processed 텍스트 정확 추출 유틸리티
 * JSONPath 적용 및 공통 휴리스틱으로 답변 텍스트 추출
 */

export function extractAnswer(raw: unknown, jsonPath?: string): string | undefined {
  const data = typeof raw === 'string' ? safeParse(raw) : (raw as any);
  if (!data) return undefined;
  
  // (a) JSONPath 우선 적용 (jsonpath-plus 사용 시)
  // try { 
  //   const out = JSONPath({ path: jsonPath!, json: data }); 
  //   if (out?.length) return normalize(out[0]); 
  // } catch {}
  
  // (b) 공통 휴리스틱 (OpenAI/Anthropic/기타)
  const pick = (...paths: string[]) => {
    for (const p of paths) { 
      const v = p.split('.').reduce((o, k) => o?.[k], data); 
      if (typeof v === 'string' && v.trim()) return v; 
    }
    return undefined;
  };
  
  let text = pick('choices.0.message.content', 'choices.0.text');
  
  if (!text && Array.isArray((data as any).content)) {
    const item = (data as any).content.find((c: any) => c.type === 'text');
    if (item?.text) text = item.text;
  }
  
  text = text || pick('output_text', 'result', 'data.answer', 'completion', 'generations.0.text');
  
  return normalize(text);
}

function safeParse(s: string): any {
  try { 
    return JSON.parse(s); 
  } catch { 
    return undefined; 
  }
}

function normalize(s?: string): string | undefined {
  if (!s) return s;
  try { 
    return JSON.parse(`"${s.replace(/"/g, '\\"')}"`); 
  } catch { 
    return s.replace(/\\n/g, '\n'); 
  }
}


