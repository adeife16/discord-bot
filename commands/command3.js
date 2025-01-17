const { SlashCommandBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("command3")
		.setDescription("Send a custom response in the current ticket channel")
		.addStringOption((option) =>
			option
				.setName("message")
				.setDescription("The message to send")
				.setRequired(true)
		),
	async execute(interaction) {
		if (!interaction.member.permissions.has("ADMINISTRATOR")) {
			return interaction.reply({
				content: "You do not have permission to use this command.",
				ephemeral: true,
			});
		}

		const message = interaction.options.getString("message");
		const ticketChannel = interaction.channel;

		if (!ticketChannel.name.startsWith("ticket-")) {
			return interaction.reply({
				content: "This command can only be used in a ticket channel.",
				ephemeral: true,
			});
		}

		await ticketChannel.send(message);
		await interaction.reply({
			content: "Message sent to the ticket channel.",
			ephemeral: true,
		});
	},
};
