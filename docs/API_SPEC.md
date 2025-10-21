# Jido API ?¤í™ (v1)

## Runs
- POST /runs
  - Body: { input_text, prompt_version_id?, connection_id?, model?, params? }
  - 200: { trace_id, output_text, model, tokens_in, tokens_out, latency_ms, created_at }
  - Error: { error_code, message, trace_id, hint }
- GET /runs/:trace_id
- GET /traces/:trace_id

## Connections
- POST /connections (?œë²„ì¸??”í˜¸???€?? ?¬í‘œ??ê¸ˆì?)
- POST /connections/:id/test (5s timeout, ë°±ì˜¤??2??
- GET /connections

## Exports
- POST /exports/csv (UTC, ?Œë¼ë¯¸í„° ?´ì‹œ ?¬í•¨)

## ?ëŸ¬ ?œì?
- { error_code, message, trace_id, hint }

## ë¡œê·¸ ?œì?
- stdout JSON: ts, level, trace_id, endpoint, model, tokens_in, tokens_out, latency_ms, status

### Global Headers
- X-Trace-Id (optional): ?´ë¼?´ì–¸???œê³µ ??? íš¨??ê²€?????¹ê³„. ë¯¸ì œê³????œë²„ê°€ UUIDv7 ?ì„±.

### Error Object
`json
{ "error_code": "RATE_429", "message": "Too many requests", "trace_id": "01J9...", "hint": "Wait 30s or contact admin." }
`

### CSV Export
- Export ê²°ê³¼??**??ƒ ë§ˆìŠ¤???ìš©ë³?*ë§??œê³µ?œë‹¤.
- ?ë¬¸ ë³¸ë¬¸/?œí¬ë¦???? í° ??ë¯¼ê° ?„ë“œ??**?¬í•¨ ê¸ˆì?**.
