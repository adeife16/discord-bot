const {
	SlashCommandBuilder,
	ActionRowBuilder,
	StringSelectMenuBuilder,
} = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("command2")
		.setDescription("Perform specific tasks using static options"),
	async execute(interaction) {
		const optionsMenu = new ActionRowBuilder().addComponents(
			new StringSelectMenuBuilder()
				.setCustomId("static-options")
				.setPlaceholder("Choose an option")
				.addOptions([
					{
						label: "Check Server Info",
						description: "Get details about the server.",
						value: "server_info",
					},
					{
						label: "Get Bot Info",
						description: "Get details about this bot.",
						value: "bot_info",
					},
					{
						label: "List Commands",
						description: "See all available commands.",
						value: "list_commands",
					},
				])
		);

		await interaction.reply({
			content: "Select an option from the dropdown:",
			components: [optionsMenu],
			ephemeral: true,
		});
	},
};
