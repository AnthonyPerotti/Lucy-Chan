const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const db = require("../database/db");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("assaltar")
    .setDescription("Tentar roubar a carteira de outro usuário (PvP)")
    .addUserOption(option =>
      option.setName("vitima")
        .setDescription("Quem você quer roubar?")
        .setRequired(true)
    ),

  async execute(interaction) {
    const ladraoId = interaction.user.id;
    const vitimaUser = interaction.options.getUser("vitima");
    const vitimaId = vitimaUser.id;
    const now = Date.now();
    const cooldown = 10 * 60 * 1000; // 10 minutos

    // Validações básicas
    if (ladraoId === vitimaId) return interaction.reply("❌ Você não pode se auto-assaltar.");
    if (vitimaUser.bot) return interaction.reply("🤖 Tentar roubar um robô? Má ideia.");

    // 1. Verifica se o ladrão tem a Pistola
    db.get("SELECT * FROM inventory WHERE user_id = ? AND item = ?", [ladraoId, "🔫 Pistola"], (err, item) => {
      if (!item) {
        return interaction.reply("❌ Você precisa de uma **🔫 Pistola** (Kit Roubo) para assaltar pessoas!");
      }

      // 2. Busca dados do Ladrão e da Vítima
      db.get("SELECT money, last_assaltar FROM users WHERE user_id = ?", [ladraoId], (err, ladrao) => {
        if (!ladrao) return interaction.reply("❌ Erro ao ler seus dados.");

        // Verifica Cooldown
        const timeSince = now - (ladrao.last_assaltar || 0);
        if (timeSince < cooldown) {
          const remaining = Math.ceil((cooldown - timeSince) / 60000);
          return interaction.reply(`police_car: A polícia está rondando a área! Espere **${remaining} minutos** para assaltar novamente.`);
        }

        db.get("SELECT money FROM users WHERE user_id = ?", [vitimaId], (err, vitima) => {
          if (!vitima || vitima.money < 500) {
            return interaction.reply("🤷 Essa pessoa tem menos de R$ 500 na carteira. Não vale o risco!");
          }

          // 3. Mecânica de Risco (Rolar os dados)
          const sucesso = Math.random() < 0.40; // 40% de chance de sucesso

          if (sucesso) {
            // SUCESSO: Rouba 10% a 30% da vítima
            const porcentagem = (Math.random() * 0.20) + 0.10;
            const valorRoubado = Math.floor(vitima.money * porcentagem);

            db.serialize(() => {
              // Tira da vítima
              db.run("UPDATE users SET money = money - ? WHERE user_id = ?", [valorRoubado, vitimaId]);
              // Dá pro ladrão e atualiza cooldown
              db.run("UPDATE users SET money = money + ?, last_assaltar = ? WHERE user_id = ?", [valorRoubado, now, ladraoId]);
            });

            const embed = new EmbedBuilder()
              .setTitle("🔫 Assalto Bem-sucedido!")
              .setColor("#00FF00")
              .setDescription(`Você rendeu **${vitimaUser.username}** e levou **R$ ${valorRoubado}** da carteira dele!`)
              .setFooter({ text: "O crime compensa... por enquanto." });

            return interaction.reply({ embeds: [embed] });

          } else {
            // FALHA: Paga multa de R$ 500 a R$ 2000 (ou o que tiver)
            const multa = Math.min(ladrao.money, Math.floor(Math.random() * 1500) + 500);

            db.serialize(() => {
              // Tira do ladrão (Multa some da economia)
              db.run("UPDATE users SET money = money - ?, last_assaltar = ? WHERE user_id = ?", [multa, now, ladraoId]);
            });

            const falhas = [
              `A polícia chegou na hora! Você pagou **R$ ${multa}** de suborno para não ser preso.`,
              `**${vitimaUser.username}** sabia karatê e te deu uma surra. Você perdeu **R$ ${multa}** em remédios.`,
              `Sua arma era de brinquedo e ninguém acreditou. Você fugiu deixando cair **R$ ${multa}**.`,
              `Você tropeçou na hora H e a polícia te multou em **R$ ${multa}** por perturbação.`
            ];
            const msgFalha = falhas[Math.floor(Math.random() * falhas.length)];

            const embed = new EmbedBuilder()
              .setTitle("🚨 Assalto Falhou!")
              .setColor("#FF0000")
              .setDescription(msgFalha)
              .setFooter({ text: "Melhor sorte (ou habilidade) na próxima." });

            return interaction.reply({ embeds: [embed] });
          }
        });
      });
    });
  }
};