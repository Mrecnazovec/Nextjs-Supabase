ALTER TABLE "public"."views" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."views" FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "views_select_own" ON "public"."views";
DROP POLICY IF EXISTS "views_insert_own" ON "public"."views";
DROP POLICY IF EXISTS "views_update_own" ON "public"."views";
DROP POLICY IF EXISTS "views_delete_own" ON "public"."views";

CREATE POLICY "views_select_own"
ON "public"."views"
FOR SELECT
TO authenticated
USING ("user_id" = (SELECT current_setting('request.jwt.claim.sub', true)));

CREATE POLICY "views_insert_own"
ON "public"."views"
FOR INSERT
TO authenticated
WITH CHECK ("user_id" = (SELECT current_setting('request.jwt.claim.sub', true)));

CREATE POLICY "views_update_own"
ON "public"."views"
FOR UPDATE
TO authenticated
USING ("user_id" = (SELECT current_setting('request.jwt.claim.sub', true)))
WITH CHECK ("user_id" = (SELECT current_setting('request.jwt.claim.sub', true)));

CREATE POLICY "views_delete_own"
ON "public"."views"
FOR DELETE
TO authenticated
USING ("user_id" = (SELECT current_setting('request.jwt.claim.sub', true)));

GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE "public"."views" TO authenticated;
REVOKE ALL ON TABLE "public"."views" FROM anon;
