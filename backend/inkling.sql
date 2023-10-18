\echo 'Delete and recreate inkling db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE inkling;
CREATE DATABASE inkling;
\connect inkling

\i inkling-schema.sql
\i inkling-seed.sql

\echo 'Delete and recreate inkling_test db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE inkling_test;
CREATE DATABASE inkling_test;
\connect inkling_test

\i inkling-schema.sql

-- psql.exe -h localhost -U yaako -d inkling -f inkling.sql
