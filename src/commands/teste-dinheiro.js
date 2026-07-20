const { SlashCommandBuilder } = require("discord.js");
const db = require("../database/db");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("teste-dinheiro")
    .setDescription("Receber R$ 1000,00 de dinheiro"),

  async execute(interaction) {
    return this.run(interaction, true);
  },

  async executeMessage(message) {
    return this.run(message, false);
  },

  async run(ctx, isSlash) {

    const id = isSlash
      ? ctx.user.id
      : ctx.author.id;

    const reward = 1000;

    // Verifica se usuário existe
    db.get(
      "SELECT * FROM users WHERE user_id = ?",
      [id],

      (err, user) => {

        if (err) {
          console.error(
            "Erro ao acessar o banco:",
            err
          );

          return ctx.reply(
            "❌ Ocorreu um erro ao acessar o banco de dados."
          );
        }

        // Usuário novo
        if (!user) {

          db.run(
            "INSERT INTO users (user_id, money) VALUES (?, ?)",
            [id, reward],

            function(err) {

              if (err) {
                console.error(
                  "Erro ao criar usuário:",
                  err
                );

                return ctx.reply(
                  "❌ Não foi possível criar sua conta."
                );
              }

              ctx.reply(
                `💰 Você recebeu R$ ${reward},00 de dinheiro!`
              );
            }
          );

        } else {

          // Usuário existente
          db.run(
            "UPDATE users SET money = money + ? WHERE user_id = ?",
            [reward, id],

            function(err) {

              if (err) {
                console.error(
                  "Erro ao atualizar dinheiro:",
                  err
                );

                return ctx.reply(
                  "❌ Não foi possível adicionar o dinheiro."
                );
              }

              ctx.reply(
                `💰 Você recebeu R$ ${reward},00 de dinheiro!`
              );
            }
          );
        }
      }
    );
  },
};