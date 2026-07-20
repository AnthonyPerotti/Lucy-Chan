const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const db = require("../database/db");

module.exports = {
  name: "balance",

  data: new SlashCommandBuilder()
    .setName("balance")
    .setDescription("Ver seu saldo"),

  async execute(ctx) {
    const isSlash =
      typeof ctx.isChatInputCommand === "function"
        ? ctx.isChatInputCommand()
        : false;

    const user = isSlash ? ctx.user : ctx.author;
    const id = user.id;

    db.get(
      "SELECT money, bank FROM users WHERE user_id = ?",
      [id],
      (err, data) => {
        if (err) {
          console.error(err);
          return ctx.reply("❌ Erro ao acessar banco.");
        }

        if (!data) {
          return ctx.reply("❌ Conta não encontrada.");
        }

        const embed = new EmbedBuilder()
          .setTitle("💰 Saldo")
          .setColor("#FFD700")
          .addFields(
            {
              name: "💳 Carteira",
              value: `R$ ${data.money}`,
              inline: true
            },
            {
              name: "🏦 Banco",
              value: `R$ ${data.bank}`,
              inline: true
            }
          )
          .setFooter({
            text: `Requisitado por ${user.tag}`,
            iconURL: user.displayAvatarURL()
          })
          .setTimestamp();

        ctx.reply({ embeds: [embed] });
      }
    );
  }
};