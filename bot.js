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
		// Handle slash commands
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
		// Handle select menu interactions
		const option = interaction.values[0];

		switch (option) {
			case "validate_wallet":
				await interaction.reply({
					content: "You selected: Validate Wallet",
					ephemeral: true,
				});
				break;
			case "assets_token_recovery":
				await interaction.reply({
					content: "You selected: Assets/Token Recovery",
					ephemeral: true,
				});
				break;
			case "rectification":
				await interaction.reply({
					content: "You selected: Rectification",
					ephemeral: true,
				});
				break;
			case "high_gas_fees":
				await interaction.reply({
					content: "You selected: High Gas Fees",
					ephemeral: true,
				});
				break;
			case "claim_reward":
				await interaction.reply({
					content: "You selected: Claim Reward",
					ephemeral: true,
				});
				break;
			case "deposit_withdrawals":
				await interaction.reply({
					content: "You selected: Deposit & Withdrawals",
					ephemeral: true,
				});
				break;
			case "slippage_error":
				await interaction.reply({
					content: "You selected: Slippage Error",
					ephemeral: true,
				});
				break;
			case "transaction_error":
				await interaction.reply({
					content: "You selected: Transaction Error",
					ephemeral: true,
				});
				break;
			case "cross_chain_transfer":
				await interaction.reply({
					content: "You selected: Cross Chain Transfer",
					ephemeral: true,
				});
				break;
			case "staking":
				await interaction.reply({
					content: "You selected: Staking",
					ephemeral: true,
				});
				break;
			default:
				await interaction.reply({
					content: "Unknown selection.",
					ephemeral: true,
				});
		}
	}
});

// Login to Discord using the token from config.json
client.login(config.token);
