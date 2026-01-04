const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const db = require("../database/db");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("profile")
    .setDescription("Ver seu perfil"),

  async execute(interaction) {
    const id = interaction.user.id;

    db.get("SELECT * FROM users WHERE user_id = ?", [id], (err, user) => {
      if (err) {
        console.error("Erro ao acessar o banco de dados:", err);
        return interaction.reply("❌ Ocorreu um erro ao acessar sua conta.");
      }

      if (!user) {
        return interaction.reply("❌ Conta não encontrada.");
      }

      // Criando o Embed com as informações do perfil
      const embed = new EmbedBuilder()
        .setTitle("📦 **Seu Perfil**")
        .setColor("#00FF00")  // Cor verde, pode ser alterada conforme necessário
        .addFields(
          { name: "⚙️ Nível", value: `${user.level} (XP: ${user.xp})`, inline: true },
          { name: "💳 Dinheiro", value: `R$ ${user.money}`, inline: true },
          { name: "🎖️ Rep", value: `${user.rep}`, inline: true }
        )
        .setFooter({ text: `Requisitado por ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
        .setTimestamp();

      // Enviar o Embed para o usuário
      interaction.reply({ embeds: [embed] });
    });
  }
};
