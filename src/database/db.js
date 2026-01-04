const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.join(__dirname, "../../data/database.sqlite");

const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  // Criação da tabela users
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      user_id TEXT PRIMARY KEY,
      money INTEGER DEFAULT 0,
      bank INTEGER DEFAULT 0,
      xp INTEGER DEFAULT 0,
      level INTEGER DEFAULT 1,
      rep INTEGER DEFAULT 0,
      last_daily INTEGER DEFAULT 0
    )
  `);

  // Criação da tabela inventory (caso ainda não exista)
  db.run(`
    CREATE TABLE IF NOT EXISTS inventory (
      user_id TEXT,
      item TEXT,
      amount INTEGER DEFAULT 0,
      PRIMARY KEY (user_id, item)
    )
  `);
});

module.exports = db;
