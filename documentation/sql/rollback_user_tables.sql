-- Rollback for removed "user_tables" module.
-- Safe to run multiple times.

DROP POLICY IF EXISTS "user_tables_select_own" ON "public"."user_tables";
DROP POLICY IF EXISTS "user_tables_insert_own" ON "public"."user_tables";
DROP POLICY IF EXISTS "user_tables_update_own" ON "public"."user_tables";
DROP POLICY IF EXISTS "user_tables_delete_own" ON "public"."user_tables";

DROP INDEX IF EXISTS "public"."user_tables_user_id_idx";
DROP TABLE IF EXISTS "public"."user_tables";
