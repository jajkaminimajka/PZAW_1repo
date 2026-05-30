CREATE DATABASE scooterbase;

\c scooterbase;

CREATE TABLE IF NOT EXISTS "session" (
  "sid"    VARCHAR NOT NULL COLLATE "default",
  "sess"   JSON NOT NULL,
  "expire" TIMESTAMP(6) NOT NULL,
  CONSTRAINT "session_pkey" PRIMARY KEY ("sid")
);
CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON "session" ("expire");

-- Użytkownicy
CREATE TABLE IF NOT EXISTS users (
  id       SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password TEXT        NOT NULL,
  role     VARCHAR(10) DEFAULT 'user' NOT NULL
);

-- Skutery
CREATE TABLE IF NOT EXISTS scooters (
  id              SERIAL PRIMARY KEY,
  brand           VARCHAR(100) NOT NULL,
  model           VARCHAR(100) NOT NULL,
  engine_capacity INTEGER,
  year            INTEGER,
  description     TEXT,
  owner_id        INTEGER REFERENCES users(id) ON DELETE CASCADE
);
