-- Fixes a real bug caught by scripts/rls-check.ts test 3 ("no tenant context
-- set -> zero rows").
--
-- Postgres custom GUCs (like our app.tenant_id) are session-scoped
-- placeholders. Once a session has used `set_config('app.tenant_id', v,
-- true)` inside ANY transaction, Postgres creates a placeholder for that
-- name at the session level. After that transaction commits, the
-- transaction-local value reverts -- but on a connection that has never had
-- a session-level value for this GUC, it reverts to an EMPTY STRING, not
-- NULL. A later transaction on the same pooled connection that never calls
-- set_config() at all then sees current_setting('app.tenant_id', true)
-- return '' instead of NULL, and casting '' to uuid raises 22P02
-- (invalid input syntax) instead of the intended fail-closed "zero rows".
--
-- NULLIF(x, '') normalizes the empty-string case to NULL, so the cast is
-- always either a valid uuid or NULL, and "tenant_id" = NULL is never true
-- for any row -- restoring the intended fail-closed behavior with no
-- context set, on both fresh and reused pooled connections.

DROP POLICY "tenant_isolation" ON "legal_entities";

CREATE POLICY "tenant_isolation" ON "legal_entities"
    USING ("tenant_id" = NULLIF(current_setting('app.tenant_id', true), '')::uuid)
    WITH CHECK ("tenant_id" = NULLIF(current_setting('app.tenant_id', true), '')::uuid);
