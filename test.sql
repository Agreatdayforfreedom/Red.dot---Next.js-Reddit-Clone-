-- file used to test queries


CREATE TABLE test (path ltree);

-- generate large table of a tree representation 
-- it takes a little while
WITH RECURSIVE path_cte AS (
    SELECT 
        '0'::ltree AS path,
        1 AS depth
    UNION ALL
    SELECT 
        text2ltree(ltree2text(path) || '.' || generate_series(0,10)::text),
        depth + 1
    FROM 
        path_cte
    WHERE 
        depth < 9 
)
SELECT 
    path
FROM 
    path_cte
    LIMIT 3628800;


-- match at least 0 but no more than 1 ocurrences for Top;
SELECT path FROM test WHERE path ~ 'Top.*{0,1}';




-- !count childs

-- count all childs of a given path
SELECT count(path) FROM test WHERE path ~ 'Top.Science.*' AND path <> 'Top.Science';

-- example 1 
--it counts the children for every row 
-- for large tables is slow
-- ? bad
EXPLAIN ANALYZE SELECT _outer.path, count(_inner.*) as totalchilds 
  FROM test _outer 
  INNER JOIN 
       test _inner ON 
      _inner.path ~ (ltree2text(_outer.path) || '.*')::lquery 
AND   _inner.path <> _outer.path 
WHERE _outer.path ~ '0.*{0,2}' GROUP BY _outer.path;

-- ! returns 1 if has children or 0 otherwise 
-- ? better
-- ? 500ms
EXPLAIN ANALYZE SELECT tt.path,
  CASE WHEN EXISTS(SELECT 1 FROM test t WHERE t.path <@ tt.path AND t.path<> tt.path)
                          THEN 1 ELSE 0 END as haschildren FROM test tt WHERE path ~ '0.1.2.3.4.5.10';

-- ? best performance
-- ? 0.80ms
EXPLAIN ANALYZE SELECT tt.path,
  CASE WHEN EXISTS(
     SELECT 1 FROM test t WHERE t.path ~ ((ltree2text(tt.path)) || '.*{1,2}')::lquery
  ) THEN 1 ELSE 0 END as haschildren 
  FROM test tt WHERE tt.path ~ '0.1.2.3.4.5';

-- ? counting childs by range
-- ? eg path.*{1,2} search all children ,if any, in a depth of 2, excluding path
EXPLAIN ANALYZE SELECT tt.path,
  CASE WHEN EXISTS(
     SELECT 1 FROM test t WHERE t.path ~ ((ltree2text(tt.path)) || '.*{0,1}')::lquery
  ) THEN (SELECT count(*) FROM test t WHERE t.path ~ ((ltree2text(tt.path)) || '.*{1,3}')::lquery) ELSE 0 END as children_count 
  FROM test tt WHERE tt.path ~ '0.1.2.3';
               
