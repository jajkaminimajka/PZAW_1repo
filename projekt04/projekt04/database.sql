
CREATE DATABASE scooterbase;

\c scooterbase;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role VARCHAR(10) DEFAULT 'user'
);

CREATE TABLE scooters (
    id SERIAL PRIMARY KEY,
    brand VARCHAR(100),
    model VARCHAR(100),
    engine_capacity INTEGER,
    year INTEGER,
    description TEXT,
    owner_id INTEGER REFERENCES users(id) ON DELETE CASCADE
);
