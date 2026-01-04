const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const db = require("../database/db");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("withdraw")
    .setDescription("Sacar dinheiro do banco")
    .addIntegerOption(option =>
      option.setName("valor")
        .setDescription("Valor para sacar")
        .setMinValue(1)
        .setRequired(true)
    ),

  async execute(interaction) {
    const id = interaction.user.id;
    const amount = interaction.options.getInteger("valor");

    db.get("SELECT money, bank FROM users WHERE user_id = ?", [id], (err, user) => {
      if (err) return interaction.reply("❌ Erro ao acessar conta.");

      if (!user || user.bank < amount) {
        return interaction.reply("❌ Você não tem esse valor no banco.");
      }

      // Atualiza: Remove do Banco -> Adiciona na Carteira
      db.run(
        "UPDATE users SET bank = bank - ?, money = money + ? WHERE user_id = ?",
        [amount, amount, id],
        (err) => {
          if (err) return interaction.reply("❌ Erro ao processar transação.");

          const embed = new EmbedBuilder()
            .setTitle("🏧 Saque Realizado")
            .setColor("#00FF00")
            .addFields(
              { name: "Valor Sacado", value: `R$ ${amount}`, inline: true },
              { name: "Dinheiro na Carteira", value: `R$ ${user.money + amount}`, inline: true }
            );

          interaction.reply({ embeds: [embed] });
        }
      );
    });
  }
};