const path = require("path");

require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const bcrypt = require("bcryptjs");
const { pool } = require("./config/db");

const DEFAULT_USERNAME = "admin";
const DEFAULT_PASSWORD = "admin123";

const SALT_ROUNDS = 10;

async function seed() {
  try {
    const [existing] = await pool.query(
      "SELECT id FROM admin WHERE username = ?",
      [DEFAULT_USERNAME],
    );

    if (existing.length > 0) {
      console.log(`Admin "${DEFAULT_USERNAME}" already exists. Nothing to do.`);
      return;
    }

    const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, SALT_ROUNDS);

    // 3) Insert karo
    await pool.query(
      "INSERT INTO admin (username, password_hash) VALUES (?, ?)",
      [DEFAULT_USERNAME, passwordHash],
    );

    console.log(
      `Admin created -> username: ${DEFAULT_USERNAME}, password: ${DEFAULT_PASSWORD}`,
    );
    console.log("Production me jane se pehle ye password zaroor badal lena!");
  } catch (err) {
    console.error("Seeding failed:", err.message);
    process.exitCode = 1; // Script fail hui, ye terminal ko batao
  } finally {
    await pool.end();
  }
}

seed();
