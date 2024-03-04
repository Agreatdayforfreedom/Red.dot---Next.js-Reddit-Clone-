CREATE EXTENSION IF NOT EXISTS ltree;

CREATE TABLE IF NOT EXISTS "thread" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "content" TEXT NOT NULL,
    "parent_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3),
    "node_path" ltree,
    "updated" BOOLEAN NOT NULL DEFAULT false,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "deep" INTEGER,
    "userId" TEXT NOT NULL,
    "communityId" TEXT,

    CONSTRAINT "thread_pkey" PRIMARY KEY ("id")
);

CREATE INDEX idx_gist_node_path ON thread USING GIST(node_path);

CREATE OR REPLACE FUNCTION get_calculated_node_path(id text)
  RETURNS ltree AS
$$
  SELECT
    CASE WHEN
      t.parent_id IS NULL THEN t.id::text::ltree
    ELSE
      get_calculated_node_path(t.parent_id) || t.id::text
    END
  FROM thread AS t WHERE t.id = $1;
$$
LANGUAGE sql;

-- trigger function

CREATE OR REPLACE FUNCTION trigger_update_node_path()
  RETURNS trigger AS
$$
BEGIN
  IF TG_OP = 'UPDATE' THEN
    IF (COALESCE(OLD.id, 0) != COALESCE(NEW.parent_id, 0)) OR NEW.id != OLD.id THEN
      UPDATE thread SET node_path = get_calculated_node_path(id)
        WHERE OLD.node_path @> thread.node_path;
    END IF;
  ELSIF TG_OP = 'INSERT' THEN
    UPDATE thread SET node_path = get_calculated_node_path(NEW.id) WHERE thread.id = NEW.id;
  END IF;
  RETURN NEW;
END
$$
LANGUAGE plpgsql VOLATILE;

CREATE TRIGGER trigger_node_path 
  AFTER INSERT OR UPDATE OF id, parent_id ON thread
    FOR EACH ROW EXECUTE PROCEDURE trigger_update_node_path();

