const { SlashCommandBuilder } = require("discord.js");
const db = require("../database/db");
const shop = require("../data/shop");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("buy")
    .setDescription("Comprar item")
    .addStringOption(opt =>
      opt.setName("item")
        .setDescription("Item da loja")
        .setRequired(true)
    ),

  async execute(interaction) {
    const id = interaction.user.id;
    const itemKey = interaction.options.getString("item");
    const item = shop[itemKey];

    if (!item) return interaction.reply("❌ Item inválido.");

    // Verificando se o usuário existe
    db.get("SELECT * FROM users WHERE user_id = ?", [id], (err, user) => {
      if (err) {
        console.error("Erro ao acessar o banco de dados:", err);
        return interaction.reply("❌ Ocorreu um erro ao acessar sua conta.");
      }

      if (!user) return interaction.reply("❌ Conta não encontrada.");

      // Verificando se o usuário tem dinheiro suficiente
      if (user.money < item.price) {
        return interaction.reply("💸 Dinheiro insuficiente.");
      }

      // Verificando se o item já existe no inventário
      db.get("SELECT * FROM inventory WHERE user_id = ? AND item = ?", [id, item.name], (err, inventoryItem) => {
        if (err) {
          console.error("Erro ao verificar inventário:", err);
          return interaction.reply("❌ Ocorreu um erro ao acessar seu inventário.");
        }

        // Se o item já existe no inventário, não permite a compra
        if (inventoryItem) {
          return interaction.reply(`❌ Você já possui ${item.name} no seu inventário.`);
        }

        // Atualizando o saldo do usuário
        db.run(
          "UPDATE users SET money = money - ? WHERE user_id = ?",
          [item.price, id],
          (err) => {
            if (err) {
              console.error("Erro ao atualizar o dinheiro do usuário:", err);
              return interaction.reply("❌ Não foi possível atualizar seu saldo.");
            }

            // Inserindo o item no inventário do usuário
            db.run(
              "INSERT INTO inventory (user_id, item, amount) VALUES (?, ?, 1)",
              [id, item.name],
              (err) => {
                if (err) {
                  console.error("Erro ao adicionar item ao inventário:", err);
                  return interaction.reply("❌ Não foi possível adicionar o item ao inventário.");
                }

                interaction.reply(`✅ Você comprou ${item.name} por R$ ${item.price}.`);
              }
            );
          }
        );
      });
    });
  }
};
