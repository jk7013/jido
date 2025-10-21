# Jido DB ?§ÌÇ§Îß?(v1)

## ?åÏù¥Î∏?- prompts(id UUID PK, name, description, created_at timestamptz)
- prompt_versions(id UUID PK, prompt_id FK, version, template text, variables_json jsonb, normalized_text text, created_at timestamptz)
- executions(id UUID PK, prompt_version_id FK, input_json jsonb, output_json jsonb, model, params_json jsonb, tokens_in int, tokens_out int, latency_ms int, cost_usd numeric, status, created_at timestamptz)
- execution_steps(id UUID PK, trace_id FK, parent_span_id UUID, name, type, status, latency_ms int, meta jsonb, created_at timestamptz)
- connections(id UUID PK, name, provider, base_url, default_model, api_key_encrypted bytea, headers_json jsonb, variables_json jsonb, extract_jsonpath text, scope, owner_id, status, last_checked_at timestamptz, created_at timestamptz, updated_at timestamptz)

## ?∏Îç±??Í∞Ä?¥Îìú
- executions(prompt_version_id, created_at desc)
- execution_steps(trace_id, created_at)
- connections(provider, status, last_checked_at desc)

## Í∑úÏπô
- Î™®Îì† ?úÍ∞Ñ: UTC(timestamptz)
- ?? UUID
- Î≥∏Î¨∏ ?Ä?? jsonb

-- Ï∂îÍ? ?úÏïΩ/?∏Îç±???àÏãú
ALTER TABLE connections
  ADD COLUMN last_used_at timestamptz;
ALTER TABLE connections
  ADD CONSTRAINT chk_enc_blob CHECK (octet_length(enc_blob) BETWEEN 64 AND 8192);
CREATE INDEX idx_connections_last_used ON connections(last_used_at);
