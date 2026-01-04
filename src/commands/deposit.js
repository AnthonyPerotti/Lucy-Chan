const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const db = require("../database/db");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("deposit")
    .setDescription("Depositar dinheiro no banco")
    .addIntegerOption(option =>
      option.setName("valor")
        .setDescription("Valor para depositar")
        .setMinValue(1)
        .setRequired(true)
    ),

  async execute(interaction) {
    const id = interaction.user.id;
    const amount = interaction.options.getInteger("valor");

    db.get("SELECT money, bank FROM users WHERE user_id = ?", [id], (err, user) => {
      if (err) return interaction.reply("❌ Erro ao acessar conta.");

      if (!user || user.money < amount) {
        return interaction.reply("❌ Você não tem esse valor na sua carteira.");
      }

      // Atualiza: Remove da Carteira -> Adiciona no Banco
      db.run(
        "UPDATE users SET money = money - ?, bank = bank + ? WHERE user_id = ?",
        [amount, amount, id],
        (err) => {
          if (err) return interaction.reply("❌ Erro ao processar transação.");

          const embed = new EmbedBuilder()
            .setTitle("🏦 Depósito Realizado")
            .setColor("#00FF00")
            .addFields(
              { name: "Valor Depositado", value: `R$ ${amount}`, inline: true },
              { name: "Novo Saldo no Banco", value: `R$ ${user.bank + amount}`, inline: true }
            );

          interaction.reply({ embeds: [embed] });
        }
      );
    });
  }
};