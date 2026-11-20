-- KasiSkill starter schema (PostgreSQL)
-- Apply this file to an empty kasi_skill database.

CREATE TABLE IF NOT EXISTS users (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    account_status VARCHAR(30) NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS worker_profiles (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    display_name VARCHAR(160) NOT NULL,
    suburb_or_town VARCHAR(160),
    bio TEXT
);

CREATE TABLE IF NOT EXISTS trade_categories (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS skills (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    trade_category_id BIGINT NOT NULL REFERENCES trade_categories(id),
    name VARCHAR(160) NOT NULL,
    description TEXT,
    UNIQUE (trade_category_id, name)
);

CREATE TABLE IF NOT EXISTS worker_skills (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    worker_profile_id BIGINT NOT NULL REFERENCES worker_profiles(id) ON DELETE CASCADE,
    skill_id BIGINT NOT NULL REFERENCES skills(id),
    self_declared_level VARCHAR(40),
    years_experience NUMERIC(4,1),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (worker_profile_id, skill_id)
);

INSERT INTO trade_categories (name)
VALUES ('Plumbing'), ('General maintenance')
ON CONFLICT (name) DO NOTHING;
