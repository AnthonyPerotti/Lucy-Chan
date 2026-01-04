require("dotenv").config();
const { Client, Collection, GatewayIntentBits } = require("discord.js");
const fs = require("fs");
require("./database/db");

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.commands = new Collection();

const commandFiles = fs
  .readdirSync("./src/commands")
  .filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
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
    interaction.reply({ content: "❌ Erro ao executar comando.", ephemeral: true });
  }
});

client.login(process.env.TOKEN);
