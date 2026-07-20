const db = require("../database/db");

/**
 * Adiciona XP, calcula nível e retorna mensagem se upar.
 * @param {string} userId - ID do usuário
 * @param {number} xpAmount - XP ganho
 * @returns {Promise<string|null>} Mensagem de Level Up ou null
 */
function addXp(userId, xpAmount) {
  return new Promise((resolve) => {
    db.get("SELECT xp, level FROM users WHERE user_id = ?", [userId], (err, user) => {
      if (err || !user) return resolve(null);

      let currentXp = user.xp + xpAmount;
      let currentLevel = user.level;
      let leveledUp = false;
      
      // Fórmula: Nível atual * 100 (Ex: Lvl 1 precisa de 100xp, Lvl 5 precisa de 500xp)
      let xpNeeded = currentLevel * 100;

      // Loop caso ganhe muito XP e suba vários níveis de uma vez
      while (currentXp >= xpNeeded) {
        currentXp -= xpNeeded; // "Paga" o custo do nível
        currentLevel++;        // Sobe de nível
        xpNeeded = currentLevel * 100; // Recalcula a meta do próximo
        leveledUp = true;
      }

      // Atualiza no banco apenas XP e Level
      db.run("UPDATE users SET xp = ?, level = ? WHERE user_id = ?", [currentXp, currentLevel, userId], () => {
        if (leveledUp) {
          resolve(`\n\n🎉 **PARABÉNS!** Você subiu para o **Nível ${currentLevel}**! 🆙`);
        } else {
          resolve(null); // Não subiu de nível
        }
      });
    });
  });
}

module.exports = { addXp };