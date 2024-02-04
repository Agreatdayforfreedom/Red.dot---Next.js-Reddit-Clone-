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

--query

  SELECT p.id, array_to_string( 
    ARRAY( SELECT CONCAT(a.id) FROM people AS a WHERE a.node_path @> p.node_path ORDER BY p.node_path), '->') AS content
    FROM people AS p ORDER BY content;


-- SELECT
--     nlevel(t.node_path) as deep, t.parent_id, t.id, t.node_path FROM thread t
--     WHERE t.node_path @> '1' AND t.node_path <> '1';

SELECT
    nlevel(t.node_path) as deep, t.parent_id, t.id, t.node_path, u.id, u.name FROM thread t
   LEFT JOIN "user" u ON t."userId" = u.id WHERE t.node_path <@ '1';

-- INSERT 

--parent
INSERT INTO thread(id,title, content, "userId") VALUES 
  ('1', 'parent', 'lorem ipsum', 'clrzckrok00009dt2w2bxkl49');

--childs
INSERT INTO thread(id,title,  content, parent_id,"userId") VALUES 
  ('2', 'parent', 'lorem ipsum', '1','clrzckrok00009dt2w2bxkl49');