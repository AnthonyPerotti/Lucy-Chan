const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const db = require("../database/db");
const jobs = require("../data/jobs");

// MUDE APENAS ISSO PARA OS OUTROS ARQUIVOS
const jobType = "arrastar";

module.exports = {
  data: new SlashCommandBuilder()
    .setName(jobType)
    .setDescription(`Usar seu item para ${jobType}`),

  async execute(interaction) {
    const id = interaction.user.id;
    const job = jobs[jobType];
    const now = Date.now();

    // 1. Verifica se o usuário tem o item necessário
    db.get(
      "SELECT * FROM inventory WHERE user_id = ? AND item = ?",
      [id, job.itemName],
      (err, item) => {
        if (err) return interaction.reply("❌ Erro ao verificar inventário.");
        
        if (!item) {
          return interaction.reply(`❌ Você precisa comprar uma **${job.itemName}** na loja para usar este comando!`);
        }

        // 2. Verifica o Cooldown (Tempo de espera) do usuário
        db.get(`SELECT last_${jobType} FROM users WHERE user_id = ?`, [id], (err, user) => {
          if (err || !user) return interaction.reply("❌ Erro ao acessar perfil.");

          const lastUsed = user[`last_${jobType}`];
          const timeSinceLast = now - lastUsed;

          if (timeSinceLast < job.cooldown) {
            const remaining = job.cooldown - timeSinceLast;
            const hours = Math.floor(remaining / (1000 * 60 * 60));
            const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

            return interaction.reply(`⏳ Você está cansado! Aguarde **${hours}h ${minutes}m ${seconds}s** para ${jobType} novamente.`);
          }

          // 3. Sistema de Falha ou Sucesso
          const isFailure = Math.random() < job.failChance;

          if (isFailure) {
            // Caso Falhe: Atualiza o tempo, mas ganha 0 dinheiro e 0 XP
            const failMsg = job.messages.fail[Math.floor(Math.random() * job.messages.fail.length)];
            
            db.run(`UPDATE users SET last_${jobType} = ? WHERE user_id = ?`, [now, id]);

            const embed = new EmbedBuilder()
              .setTitle(`😓 Falha ao ${jobType}...`)
              .setColor("#FF0000") // Vermelho
              .setDescription(failMsg)
              .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL() });

            return interaction.reply({ embeds: [embed] });
          } 
          
          // Caso Sucesso
          const moneyEarned = Math.floor(Math.random() * (job.maxMoney - job.minMoney + 1)) + job.minMoney;
          const xpEarned = job.xp;
          
          let successMsg = job.messages.success[Math.floor(Math.random() * job.messages.success.length)];
          successMsg = successMsg.replace("{money}", moneyEarned); // Troca o texto {money} pelo valor

          // Atualiza Dinheiro, XP e Tempo no banco
          db.run(
            `UPDATE users SET money = money + ?, xp = xp + ?, last_${jobType} = ? WHERE user_id = ?`,
            [moneyEarned, xpEarned, now, id],
            (err) => {
              if (err) return interaction.reply("❌ Erro ao salvar progresso.");

              const embed = new EmbedBuilder()
                .setTitle(`✅ Sucesso ao ${jobType}!`)
                .setColor("#00FF00") // Verde
                .setDescription(successMsg)
                .addFields({ name: "✨ XP Ganho", value: `+${xpEarned} XP`, inline: true })
                .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL() });

              interaction.reply({ embeds: [embed] });
            }
          );
        });
      }
    );
  }
};