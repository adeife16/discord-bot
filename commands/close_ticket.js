const { SlashCommandBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("close_ticket")
		.setDescription("Close the current ticket channel"),
	async execute(interaction) {
		const ticketChannel = interaction.channel;

		if (!ticketChannel.name.startsWith("ticket-")) {
			return interaction.reply({
				content: "This command can only be used in a ticket channel.",
				ephemeral: true,
			});
		}

		await interaction.reply({
			content: "This ticket will be closed in 5 seconds...",
			ephemeral: true,
		});

		setTimeout(() => {
			ticketChannel.delete().catch(console.error);
		}, 5000);
	},
};
