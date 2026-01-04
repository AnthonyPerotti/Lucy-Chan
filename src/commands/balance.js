const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const db = require("../database/db");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("balance")
    .setDescription("Ver seu saldo"),

  async execute(interaction) {
    const id = interaction.user.id;

    db.get(
      "SELECT money, bank FROM users WHERE user_id = ?",
      [id],
      (err, user) => {
        if (err) {
          console.error("Erro ao acessar o banco de dados:", err);
          return interaction.reply("❌ Ocorreu um erro ao acessar sua conta.");
        }

        if (!user) {
          return interaction.reply("❌ Conta não encontrada.");
        }

        // Criando o Embed usando EmbedBuilder
        const embed = new EmbedBuilder()
          .setTitle("💰 **Saldo**")
          .setColor("#FFD700")  // Cor dourada para o embed (pode mudar conforme necessidade)
          .addFields(
            { name: "💳 Dinheiro", value: `R$ ${user.money}`, inline: true },
            { name: "🏦 Banco", value: `R$ ${user.bank}`, inline: true }
          )
          .setFooter({ text: `Requisitado por ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
          .setTimestamp();

        // Enviar o Embed para o usuário
        interaction.reply({ embeds: [embed] });
      }
    );
  }
};
