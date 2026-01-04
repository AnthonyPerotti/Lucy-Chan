const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const db = require("../database/db");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("daily")
    .setDescription("Resgatar recompensa diária"),

  async execute(interaction) {
    const id = interaction.user.id;
    const now = Date.now();
    const cooldown = 86400000; // 24 horas em milissegundos
    const reward = Math.floor(Math.random() * 500) + 500;

    db.get("SELECT * FROM users WHERE user_id = ?", [id], (err, user) => {
      if (err) {
        console.error("Erro ao acessar o banco de dados:", err);
        return interaction.reply("❌ Ocorreu um erro ao acessar sua conta.");
      }

      if (!user) {
        // Criando o usuário pela primeira vez
        db.run(
          "INSERT INTO users (user_id, money, last_daily) VALUES (?, ?, ?)",
          [id, reward, now],
          () => {
            const embed = new EmbedBuilder()
              .setTitle("💰 **Recompensa Diária Resgatada!**")
              .setColor("#FFD700")
              .setDescription(`Você recebeu **R$ ${reward}** como recompensa diária!`)
              .setFooter({ text: `Requisitado por ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
              .setTimestamp();

            interaction.reply({ embeds: [embed] });
          }
        );
      } else {
        // Verifica o tempo desde o último daily
        const timeSinceLast = now - user.last_daily;

        if (timeSinceLast < cooldown) {
          const remaining = cooldown - timeSinceLast;
          
          // Cálculo de horas, minutos e segundos restantes
          const hours = Math.floor(remaining / (1000 * 60 * 60));
          const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

          return interaction.reply(`⏳ Você já coletou sua recompensa diária, pode voltar e coletá-la em ${hours}h ${minutes}m ${seconds}s!`);
        }

        // Atualiza o saldo e a data do resgate para AGORA
        db.run(
          "UPDATE users SET money = money + ?, last_daily = ? WHERE user_id = ?",
          [reward, now, id],
          () => {
            const embed = new EmbedBuilder()
              .setTitle("💰 **Recompensa Diária Resgatada!**")
              .setColor("#FFD700")
              .setDescription(`Você recebeu **R$ ${reward}** como recompensa diária!`)
              .setFooter({ text: `Requisitado por ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
              .setTimestamp();

            interaction.reply({ embeds: [embed] });
          }
        );
      }
    });
  }
};