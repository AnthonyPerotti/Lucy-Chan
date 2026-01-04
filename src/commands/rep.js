const { SlashCommandBuilder } = require("discord.js");
const db = require("../database/db");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("rep")
    .setDescription("Dar um ponto de reputação para um usuário")
    .addUserOption(option =>
      option.setName("user")
        .setDescription("O usuário que vai receber a reputação")
        .setRequired(true)
    ),

  async execute(interaction) {
    const senderId = interaction.user.id;
    const targetUser = interaction.options.getUser("user");
    const targetId = targetUser.id;
    const now = Date.now();
    const cooldown = 24 * 60 * 60 * 1000; // 24 horas

    // Impede dar rep para si mesmo
    if (senderId === targetId) {
      return interaction.reply("❌ Você não pode dar reputação para si mesmo!");
    }

    // Impede dar rep para bots
    if (targetUser.bot) {
      return interaction.reply("🤖 Bots não precisam de reputação social!");
    }

    // 1. Verifica o remetente (quem está dando o rep)
    db.get("SELECT last_rep_given FROM users WHERE user_id = ?", [senderId], (err, sender) => {
      if (err) {
        console.error(err);
        return interaction.reply("❌ Erro ao acessar o banco de dados.");
      }

      // Verifica Cooldown
      if (sender) {
        const lastGiven = sender.last_rep_given || 0;
        const timeSince = now - lastGiven;

        if (timeSince < cooldown) {
          const remaining = cooldown - timeSince;
          const hours = Math.floor(remaining / (1000 * 60 * 60));
          const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

          return interaction.reply(`⏳ Você já deu um ponto de reputação hoje. Volte em **${hours}h ${minutes}m ${seconds}s**!`);
        }
      }

      // Se passou do tempo ou o usuário é novo, prossegue com a operação

      // 2. Atualiza ou Cria o Remetente (Marca que ele usou o comando agora)
      if (!sender) {
        db.run("INSERT INTO users (user_id, last_rep_given) VALUES (?, ?)", [senderId, now]);
      } else {
        db.run("UPDATE users SET last_rep_given = ? WHERE user_id = ?", [now, senderId]);
      }

      // 3. Atualiza ou Cria o Destinatário (Adiciona +1 Rep)
      db.get("SELECT * FROM users WHERE user_id = ?", [targetId], (err, target) => {
        if (err) return; // Erro silencioso no callback interno ou logar no console

        if (!target) {
          // Se o alvo não existe, cria ele com 1 de rep
          db.run("INSERT INTO users (user_id, rep) VALUES (?, 1)", [targetId]);
        } else {
          // Se já existe, adiciona +1
          db.run("UPDATE users SET rep = rep + 1 WHERE user_id = ?", [targetId]);
        }

        // Resposta final
        interaction.reply(`✨ **Você deu 1 ponto de reputação para ${targetUser.username}!**`);
      });
    });
  }
};