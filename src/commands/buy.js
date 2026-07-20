const { SlashCommandBuilder } = require("discord.js");
const db = require("../database/db");
const shop = require("../data/shop");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("buy")
    .setDescription("Comprar item")
    .addStringOption(opt =>
      opt
        .setName("item")
        .setDescription("Item da loja")
        .setRequired(true)
    ),

  async execute(ctx, args = []) {
    const isSlash = !!ctx.isChatInputCommand;

    const user = isSlash ? ctx.user : ctx.author;

    const reply = (content) => {
      if (isSlash) {
        return ctx.reply(content);
      } else {
        return ctx.channel.send(content);
      }
    };

    const id = user.id;

    // Slash -> /buy item:vassoura
    // Prefix -> lu!buy vassoura
    const itemKey = isSlash
      ? ctx.options.getString("item")
      : args[0]?.toLowerCase();

    if (!itemKey) {
      return reply(
        "❌ Informe um item.\nExemplo: `lu!buy vassoura`"
      );
    }

    const item = shop[itemKey];

    if (!item) {
      return reply("❌ Item inválido.");
    }

    // Verifica usuário
    db.get(
      "SELECT * FROM users WHERE user_id = ?",
      [id],
      (err, userData) => {
        if (err) {
          console.error(err);
          return reply(
            "❌ Ocorreu um erro ao acessar sua conta."
          );
        }

        if (!userData) {
          return reply("❌ Conta não encontrada.");
        }

        // Dinheiro suficiente
        if (userData.money < item.price) {
          return reply("💸 Dinheiro insuficiente.");
        }

        // Já possui item?
        db.get(
          "SELECT * FROM inventory WHERE user_id = ? AND item = ?",
          [id, item.name],
          (err, inventoryItem) => {
            if (err) {
              console.error(err);

              return reply(
                "❌ Ocorreu um erro ao acessar seu inventário."
              );
            }

            if (inventoryItem) {
              return reply(
                `❌ Você já possui ${item.name} no seu inventário.`
              );
            }

            // Remove dinheiro
            db.run(
              "UPDATE users SET money = money - ? WHERE user_id = ?",
              [item.price, id],
              (err) => {
                if (err) {
                  console.error(err);

                  return reply(
                    "❌ Não foi possível atualizar seu saldo."
                  );
                }

                // Adiciona item
                db.run(
                  "INSERT INTO inventory (user_id, item, amount) VALUES (?, ?, 1)",
                  [id, item.name],
                  (err) => {
                    if (err) {
                      console.error(err);

                      return reply(
                        "❌ Não foi possível adicionar o item ao inventário."
                      );
                    }

                    reply(
                      `✅ Você comprou ${item.name} por R$ ${item.price}.`
                    );
                  }
                );
              }
            );
          }
        );
      }
    );
  },

  async executeMessage(message, args) {
    return this.execute(message, args);
  }
};