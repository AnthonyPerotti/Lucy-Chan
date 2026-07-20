require("dotenv").config();
const { Client, Collection, GatewayIntentBits } = require("discord.js");
const fs = require("fs");
require("./database/db"); // Garante que o banco seja iniciado

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
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
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (err) {
    console.error(err);

    if (!interaction.replied && !interaction.deferred) {
      interaction.reply({
        content: "❌ Erro ao executar comando.",
        ephemeral: true
      });
    }
  }
});

const PREFIX = "lu!";

client.on("messageCreate", async message => {
  if (message.author.bot) return;
  if (!message.content.startsWith(PREFIX)) return;

  const args = message.content.slice(PREFIX.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command = client.commands.get(commandName);

  if (!command) return;

  try {
    await command.execute(message, args);
  } catch (err) {
    console.error(err);
    message.reply("❌ Erro ao executar comando.");
  }
});

client.login(process.env.TOKEN);