const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const db = require("../database/db");
const jobs = require("../data/jobs");
const levelSystem = require("../utils/levelSystem");

const jobType = "varrer";

module.exports = {
  data: new SlashCommandBuilder()
    .setName(jobType)
    .setDescription(`Executar trabalho de ${jobType}`),

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

    const username = isSlash
      ? ctx.user.username
      : ctx.author.username;

    const avatarURL = isSlash
      ? ctx.user.displayAvatarURL()
      : ctx.author.displayAvatarURL();

    const job = jobs[jobType];

    const now = Date.now();

    // 1. Verifica inventário
    db.get(
      "SELECT * FROM inventory WHERE user_id = ? AND item = ?",
      [id, job.itemName],

      (err, item) => {

        if (err) {
          console.error(err);

          return ctx.reply(
            "❌ Erro no banco de dados."
          );
        }

        if (!item) {
          return ctx.reply(
            `❌ Você precisa de uma **${job.itemName}** para isso!`
          );
        }

        // 2. Verifica cooldown
        db.get(
          `SELECT last_${jobType} FROM users WHERE user_id = ?`,
          [id],

          (err, user) => {

            if (err) {
              console.error(err);

              return ctx.reply(
                "❌ Erro no banco de dados."
              );
            }

            if (!user) {
              return ctx.reply(
                "❌ Usuário não encontrado."
              );
            }

            const lastUsed =
              user[`last_${jobType}`] || 0;

            const timeSinceLast =
              now - lastUsed;

            if (timeSinceLast < job.cooldown) {

              const remaining =
                job.cooldown - timeSinceLast;

              const hours = Math.floor(
                remaining / (1000 * 60 * 60)
              );

              const minutes = Math.floor(
                (remaining % (1000 * 60 * 60)) /
                (1000 * 60)
              );

              return ctx.reply(
                `⏳ Aguarde **${hours}h ${minutes}m** para trabalhar novamente.`
              );
            }

            // 3. Falha
            if (Math.random() < job.failChance) {

              const failMsg =
                job.messages.fail[
                  Math.floor(
                    Math.random() *
                    job.messages.fail.length
                  )
                ];

              db.run(
                `UPDATE users
                 SET last_${jobType} = ?
                 WHERE user_id = ?`,
                [now, id]
              );

              const embed = new EmbedBuilder()
                .setTitle("😓 Deu ruim...")
                .setColor("#FF0000")
                .setDescription(failMsg);

              return ctx.reply({
                embeds: [embed]
              });
            }

            // 4. Sucesso
            const moneyEarned =
              Math.floor(
                Math.random() *
                (job.maxMoney - job.minMoney + 1)
              ) + job.minMoney;

            const xpEarned =
              Math.floor(
                Math.random() *
                (job.maxXp - job.minXp + 1)
              ) + job.minXp;

            let successMsg =
              job.messages.success[
                Math.floor(
                  Math.random() *
                  job.messages.success.length
                )
              ];

            successMsg = successMsg.replace(
              "{money}",
              moneyEarned
            );

            db.run(
              `UPDATE users
               SET money = money + ?,
                   last_${jobType} = ?
               WHERE user_id = ?`,
              [moneyEarned, now, id],

              async (err) => {

                if (err) {
                  console.error(err);

                  return ctx.reply(
                    "❌ Erro ao salvar dados."
                  );
                }

                // XP / Level
                const levelUpMessage =
                  await levelSystem.addXp(
                    id,
                    xpEarned
                  );

                const embed = new EmbedBuilder()
                  .setTitle(
                    `✅ Trabalho feito: ${jobType}!`
                  )
                  .setColor("#00FF00")
                  .addFields(
                    {
                      name: "💰 Dinheiro",
                      value: `+ R$ ${moneyEarned}`,
                      inline: true
                    },
                    {
                      name: "✨ XP",
                      value: `+ ${xpEarned}`,
                      inline: true
                    }
                  )
                  .setFooter({
                    text: username,
                    iconURL: avatarURL
                  });

                if (levelUpMessage) {

                  embed.setDescription(
                    successMsg + levelUpMessage
                  );

                } else {

                  embed.setDescription(
                    successMsg
                  );
                }

                ctx.reply({
                  embeds: [embed]
                });
              }
            );
          }
        );
      }
    );
  },
};