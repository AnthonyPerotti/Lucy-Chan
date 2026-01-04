const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const db = require("../database/db");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("inventory")
    .setDescription("Ver seu inventário"),

  async execute(interaction) {
    const id = interaction.user.id;

    db.all(
      "SELECT * FROM inventory WHERE user_id = ?",
      [id],
      (err, items) => {
        if (err) {
          console.error("Erro ao acessar o inventário:", err);
          return interaction.reply("❌ Ocorreu um erro ao acessar seu inventário.");
        }

        if (!items || items.length === 0) {
          return interaction.reply("📦 Seu inventário está vazio.");
        }

        // Criando o Embed usando EmbedBuilder
        const embed = new EmbedBuilder()
          .setTitle("📦 **Seu Inventário**")
          .setColor("#00FF00");  // Cor verde, pode ser alterada conforme necessário

        // Adicionando os itens ao Embed (sem a quantidade)
        items.forEach(item => {
          embed.addFields(
            { name: item.item, value: "✔️", inline: false }
          );
        });

        // Enviar o Embed para o usuário
        interaction.reply({ embeds: [embed] });
      }
    );
  }
};
