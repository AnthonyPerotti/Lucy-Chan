const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const db = require("../database/db");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("assaltar")
    .setDescription("Tentar roubar a carteira de outro usuário (PvP)")
    .addUserOption(option =>
      option
        .setName("vitima")
        .setDescription("Quem você quer roubar?")
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

    let vitimaUser;

    if (isSlash) {
      vitimaUser = ctx.options.getUser("vitima");
    } else {
      vitimaUser =
        ctx.mentions.users.first() ||
        (args[0]
          ? await ctx.client.users.fetch(args[0]).catch(() => null)
          : null);
    }

    if (!vitimaUser) {
      return reply(
        "❌ Você precisa mencionar alguém.\nExemplo: `lu!assaltar @usuario`"
      );
    }

    const ladraoId = user.id;
    const vitimaId = vitimaUser.id;

    const now = Date.now();
    const cooldown = 10 * 60 * 1000;

    // Validações
    if (ladraoId === vitimaId) {
      return reply("❌ Você não pode se auto-assaltar.");
    }

    if (vitimaUser.bot) {
      return reply("🤖 Tentar roubar um robô? Má ideia.");
    }

    // Verifica pistola
    db.get(
      "SELECT * FROM inventory WHERE user_id = ? AND item = ?",
      [ladraoId, "🔫 Pistola"],
      (err, item) => {
        if (!item) {
          return reply(
            "❌ Você precisa de uma **🔫 Pistola** (Kit Roubo) para assaltar pessoas!"
          );
        }

        // Dados do ladrão
        db.get(
          "SELECT money, last_assaltar FROM users WHERE user_id = ?",
          [ladraoId],
          (err, ladrao) => {
            if (!ladrao) {
              return reply("❌ Erro ao ler seus dados.");
            }

            // Cooldown
            const timeSince = now - (ladrao.last_assaltar || 0);

            if (timeSince < cooldown) {
              const remaining = Math.ceil(
                (cooldown - timeSince) / 60000
              );

              return reply(
                `🚔 A polícia está rondando a área! Espere **${remaining} minutos** para assaltar novamente.`
              );
            }

            // Dados vítima
            db.get(
              "SELECT money FROM users WHERE user_id = ?",
              [vitimaId],
              (err, vitima) => {
                if (!vitima || vitima.money < 500) {
                  return reply(
                    "🤷 Essa pessoa tem menos de R$ 500 na carteira. Não vale o risco!"
                  );
                }

                // Chance sucesso
                const sucesso = Math.random() < 0.40;

                // =========================
                // SUCESSO
                // =========================
                if (sucesso) {
                  const porcentagem =
                    (Math.random() * 0.20) + 0.10;

                  const valorRoubado = Math.floor(
                    vitima.money * porcentagem
                  );

                  db.serialize(() => {
                    db.run(
                      "UPDATE users SET money = money - ? WHERE user_id = ?",
                      [valorRoubado, vitimaId]
                    );

                    db.run(
                      `UPDATE users
                       SET money = money + ?, last_assaltar = ?
                       WHERE user_id = ?`,
                      [valorRoubado, now, ladraoId]
                    );
                  });

                  const embed = new EmbedBuilder()
                    .setTitle("🔫 Assalto Bem-sucedido!")
                    .setColor("#00FF00")
                    .setDescription(
                      `Você rendeu **${vitimaUser.username}** e levou **R$ ${valorRoubado}** da carteira dele!`
                    )
                    .setFooter({
                      text: "O crime compensa... por enquanto."
                    });

                  return reply({ embeds: [embed] });
                }

                // =========================
                // FALHA
                // =========================
                const multa = Math.min(
                  ladrao.money,
                  Math.floor(Math.random() * 1500) + 500
                );

                db.run(
                  `UPDATE users
                   SET money = money - ?, last_assaltar = ?
                   WHERE user_id = ?`,
                  [multa, now, ladraoId]
                );

                const falhas = [
                  `A polícia chegou na hora! Você pagou **R$ ${multa}** de suborno para não ser preso.`,
                  `**${vitimaUser.username}** sabia karatê e te deu uma surra. Você perdeu **R$ ${multa}** em remédios.`,
                  `Sua arma era de brinquedo e ninguém acreditou. Você fugiu deixando cair **R$ ${multa}**.`,
                  `Você tropeçou na hora H e a polícia te multou em **R$ ${multa}** por perturbação.`
                ];

                const msgFalha =
                  falhas[
                    Math.floor(Math.random() * falhas.length)
                  ];

                const embed = new EmbedBuilder()
                  .setTitle("🚨 Assalto Falhou!")
                  .setColor("#FF0000")
                  .setDescription(msgFalha)
                  .setFooter({
                    text: "Melhor sorte (ou habilidade) na próxima."
                  });

                return reply({ embeds: [embed] });
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