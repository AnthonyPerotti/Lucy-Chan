const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const db = require("../database/db");
const jobs = require("../data/jobs");
const levelSystem = require("../utils/levelSystem");

const jobType = "cortar";

module.exports = {
  data: new SlashCommandBuilder()
    .setName(jobType)
    .setDescription(`Executar trabalho de ${jobType}`),

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
    const job = jobs[jobType];
    const now = Date.now();

    // 1. Verifica inventário
    db.get(
      "SELECT * FROM inventory WHERE user_id = ? AND item = ?",
      [id, job.itemName],
      (err, item) => {
        if (err) return reply("❌ Erro no banco de dados.");

        if (!item) {
          return reply(`❌ Você precisa de uma **${job.itemName}** para isso!`);
        }

        // 2. Verifica cooldown
        db.get(
          `SELECT last_${jobType} FROM users WHERE user_id = ?`,
          [id],
          (err, userData) => {
            if (!userData) {
              return reply("❌ Usuário não encontrado.");
            }

            const lastUsed = userData[`last_${jobType}`] || 0;
            const timeSinceLast = now - lastUsed;

            if (timeSinceLast < job.cooldown) {
              const remaining = job.cooldown - timeSinceLast;

              const hours = Math.floor(
                remaining / (1000 * 60 * 60)
              );

              const minutes = Math.floor(
                (remaining % (1000 * 60 * 60)) / (1000 * 60)
              );

              return reply(
                `⏳ Aguarde **${hours}h ${minutes}m** para trabalhar novamente.`
              );
            }

            // 3. Falha
            if (Math.random() < job.failChance) {
              const failMsg =
                job.messages.fail[
                  Math.floor(Math.random() * job.messages.fail.length)
                ];

              db.run(
                `UPDATE users SET last_${jobType} = ? WHERE user_id = ?`,
                [now, id]
              );

              const embed = new EmbedBuilder()
                .setTitle("😓 Deu ruim...")
                .setColor("#FF0000")
                .setDescription(failMsg);

              return reply({ embeds: [embed] });
            }

            // 4. Sucesso
            const moneyEarned =
              Math.floor(
                Math.random() * (job.maxMoney - job.minMoney + 1)
              ) + job.minMoney;

            const xpEarned =
              Math.floor(
                Math.random() * (job.maxXp - job.minXp + 1)
              ) + job.minXp;

            let successMsg =
              job.messages.success[
                Math.floor(Math.random() * job.messages.success.length)
              ];

            successMsg = successMsg.replace(
              "{money}",
              moneyEarned
            );

            db.run(
              `UPDATE users
               SET money = money + ?, last_${jobType} = ?
               WHERE user_id = ?`,
              [moneyEarned, now, id],
              async (err) => {
                if (err) {
                  return reply("❌ Erro ao salvar dados.");
                }

                const levelUpMessage =
                  await levelSystem.addXp(id, xpEarned);

                const embed = new EmbedBuilder()
                  .setTitle(`✅ Trabalho feito: ${jobType}!`)
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
                    text: user.username,
                    iconURL: user.displayAvatarURL()
                  });

                if (levelUpMessage) {
                  embed.setDescription(
                    successMsg + levelUpMessage
                  );
                } else {
                  embed.setDescription(successMsg);
                }

                reply({ embeds: [embed] });
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