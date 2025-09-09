-- Skola Database Initialization
-- This script runs when PostgreSQL container starts

-- Create database user (if not exists)
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'skola_user') THEN
        CREATE USER skola_user WITH PASSWORD 'skola_password_2024_secure';
    END IF;
END
$$;

-- Create database (if not exists)
SELECT 'CREATE DATABASE skola_prod OWNER skola_user'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'skola_prod')\gexec

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE skola_prod TO skola_user;

-- Connect to skola_prod database
\c skola_prod

-- Grant schema permissions
GRANT ALL ON SCHEMA public TO skola_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO skola_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO skola_user;

-- Set default privileges for future objects
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO skola_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO skola_user;
