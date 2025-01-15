const { SlashCommandBuilder } = require("@discordjs/builders");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { clientId, guildId, token } = require("./config.json"); // Ensure this file contains the correct values

// Define your commands
const commands = [
	new SlashCommandBuilder()
		.setName("command1")
		.setDescription("Select an option")
		.addStringOption((option) =>
			option
				.setName("option")
				.setDescription("Choose an option")
				.setRequired(true)
				.addChoices(
					{ name: "Option 1", value: "option1" },
					{ name: "Option 2", value: "option2" },
					{ name: "Option 3", value: "option3" }
				)
		),
	new SlashCommandBuilder()
		.setName("command2")
		.setDescription("Create a support ticket"),
	new SlashCommandBuilder()
		.setName("command3")
		.setDescription("Only Admins can set options for command1"),
].map((command) => command.toJSON());

// Set up the REST client
const rest = new REST({ version: "9" }).setToken(token);

(async () => {
	try {
		console.log("Started refreshing application (/) commands.");

		// Register commands for a specific server (guild)
		await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
			body: commands,
		});

		console.log("Successfully reloaded application (/) commands.");
	} catch (error) {
		console.error("Error registering commands:", error);
	}
})();
