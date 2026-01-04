require("dotenv").config();
const { Client, Collection, GatewayIntentBits } = require("discord.js");
const fs = require("fs");
require("./database/db"); // Garante que o banco seja iniciado

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds // Só precisamos disso para Slash Commands
  ]
});

client.commands = new Collection();

// Carrega os comandos da pasta src/commands
const commandFiles = fs
  .readdirSync("./src/commands")
  .filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  if (command.data && command.execute) {
    client.commands.set(command.data.name, command);
  }
}

client.once("clientReady", require("./events/ready"));

client.on("interactionCreate", async interaction => {
  // Ignora se não for comando de chat (Slash)
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (err) {
    console.error(err);
    // Evita erro se a interação já foi respondida
    if (!interaction.replied && !interaction.deferred) {
      interaction.reply({ content: "❌ Erro ao executar comando.", ephemeral: true });
    }
  }
});

client.login(process.env.TOKEN);