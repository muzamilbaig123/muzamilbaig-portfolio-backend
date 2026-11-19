-- ============================================================
-- schema-aiven.sql
-- schema.sql jaisa hi, bas CREATE DATABASE aur USE lines nahi hain,
-- taake tables seedha us database me banen jis se aap connected ho
-- (Aiven ka "defaultdb").
--
-- Chalane ka tareeqa (Aiven console se host/port/user/password lo):
--   mysql --host=<HOST> --port=<PORT> --user=avnadmin --password \
--         --ssl-mode=REQUIRED defaultdb < schema-aiven.sql
--
-- Note: .env me DB_NAME=defaultdb hona chahiye.
-- ============================================================

-- ------------------------------------------------------------
-- admin: dashboard me login karne wala user
-- password plain text me nahi, bcrypt hash ki shakal me save hoga
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS admin (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  username      VARCHAR(50)  NOT NULL UNIQUE,  -- same username do baar nahi ho sakta
  password_hash VARCHAR(255) NOT NULL          -- bcrypt hash (~60 chars)
);

-- ------------------------------------------------------------
-- projects: portfolio me dikhne wale projects
-- tech: comma-separated list, e.g. "React,Next.js,TypeScript"
--       (API isay array bana ke bhejti hai: ["React","Next.js","TypeScript"])
--
-- Agar table pehle hi ban chuki hai (purane schema se), to ye chalao:
--   ALTER TABLE projects ADD COLUMN tech TEXT AFTER description;
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS projects (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  title        VARCHAR(150) NOT NULL,
  description  TEXT,
  tech         TEXT,
  image_url    VARCHAR(500),
  project_link VARCHAR(500),
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- row banne ka time khud save hoga
);

-- ------------------------------------------------------------
-- skills: e.g. name = "React", category = "Frontend"
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS skills (
  id       INT AUTO_INCREMENT PRIMARY KEY,
  name     VARCHAR(100) NOT NULL,
  category VARCHAR(100) NOT NULL
);

-- ------------------------------------------------------------
-- experience: job / internship history
-- duration e.g. "2025 - Present"
-- description: har point nayi line (\n) pe, frontend split("\n") karke list banaye
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS experience (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  role        VARCHAR(150) NOT NULL,
  company     VARCHAR(150) NOT NULL,
  duration    VARCHAR(100),
  description TEXT
);

-- ------------------------------------------------------------
-- messages: contact form se aane wale messages
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS messages (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  email      VARCHAR(255) NOT NULL,
  message    TEXT         NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
