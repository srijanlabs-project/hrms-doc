-- One-time local dev setup. Run as the postgres superuser:
--   psql -U postgres -f scripts/db-setup.sql
-- Creates the app role and database. The app role has no BYPASSRLS,
-- and tables use FORCE ROW LEVEL SECURITY, so RLS applies to it fully.

CREATE ROLE staffsy WITH LOGIN PASSWORD 'staffsy_dev' NOSUPERUSER NOCREATEROLE NOBYPASSRLS CREATEDB;
CREATE DATABASE staffsy OWNER staffsy;
