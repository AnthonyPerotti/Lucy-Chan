const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.join(__dirname, "../../data/database.sqlite");

const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  // Criação da tabela users com TODAS as colunas de cooldown e reputação
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      user_id TEXT PRIMARY KEY,
      money INTEGER DEFAULT 0,
      bank INTEGER DEFAULT 0,
      xp INTEGER DEFAULT 0,
      level INTEGER DEFAULT 1,
      rep INTEGER DEFAULT 0,
      last_daily INTEGER DEFAULT 0,
      last_rep_given INTEGER DEFAULT 0,
      last_varrer INTEGER DEFAULT 0,
      last_limpar INTEGER DEFAULT 0,
      last_pescar INTEGER DEFAULT 0,
      last_arrastar INTEGER DEFAULT 0,
      last_cavar INTEGER DEFAULT 0,
      last_cozinhar INTEGER DEFAULT 0,
      last_arar INTEGER DEFAULT 0,
      last_cortar INTEGER DEFAULT 0,
      last_minerar INTEGER DEFAULT 0,
      last_construir INTEGER DEFAULT 0,
      last_roubar INTEGER DEFAULT 0,
      last_hackear INTEGER DEFAULT 0,
      last_assaltar INTEGER DEFAULT 0
    )
  `);

  // Criação da tabela inventory (sem alterações)
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