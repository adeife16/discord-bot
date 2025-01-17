const {
	Client,
	GatewayIntentBits,
	Collection,
	REST,
	Routes,
} = require("discord.js");
const fs = require("fs");
const path = require("path");
const config = require("./config.json"); // Load the token, clientId, and guildId from config.json

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildMembers,
	],
});

client.commands = new Collection();

// Load commands dynamically
const commands = [];
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
	.readdirSync(commandsPath)
	.filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
	const command = require(path.join(commandsPath, file));
	client.commands.set(command.data.name, command);
	commands.push(command.data.toJSON());
}

// Register slash commands
const rest = new REST({ version: "10" }).setToken(config.token);

(async () => {
	try {
		console.log("Registering slash commands...");
		await rest.put(
			Routes.applicationGuildCommands(config.clientId, config.guildId),
			{
				body: commands,
			}
		);
		console.log("Slash commands registered.");
	} catch (error) {
		console.error("Error registering slash commands:", error);
	}
})();

client.once("ready", () => {
	console.log(`Bot is online as ${client.user.tag}`);
});

client.on("interactionCreate", async (interaction) => {
	if (interaction.isCommand()) {
		const command = client.commands.get(interaction.commandName);
		if (command) {
			try {
				await command.execute(interaction);
			} catch (error) {
				console.error(
					`Error executing command ${interaction.commandName}:`,
					error
				);
				await interaction.reply({
					content: "There was an error executing this command.",
					ephemeral: true,
				});
			}
		}
	} else if (
		interaction.isStringSelectMenu() &&
		interaction.customId === "static-options"
	) {
		const option = interaction.values[0];

		if (option === "server_info") {
			const serverInfo = `
        **Server Name**: ${interaction.guild.name}
        **Total Members**: ${interaction.guild.memberCount}
      `;
			await interaction.reply({ content: serverInfo, ephemeral: true });
		} else if (option === "bot_info") {
			const botInfo = `
        **Bot Name**: ${client.user.username}
        **Created On**: ${client.user.createdAt.toDateString()}
      `;
			await interaction.reply({ content: botInfo, ephemeral: true });
		} else if (option === "list_commands") {
			const commandsList = `
        **Available Commands**:
        - \`/command2\`: Perform tasks via dropdown options.
        - \`/open_ticket\`: Open a new support ticket.
        - \`/command3\`: Send custom responses in ticket channels (Admins only).
      `;
			await interaction.reply({ content: commandsList, ephemeral: true });
		}
	}
});

// Login to Discord using the token from config.json
client.login(config.token);
