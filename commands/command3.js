const {
	SlashCommandBuilder,
	ButtonBuilder,
	ActionRowBuilder,
	ButtonStyle,
} = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("command3")
		.setDescription("Send a custom response in the current ticket channel")
		.addStringOption((option) =>
			option
				.setName("message")
				.setDescription("The message to send")
				.setRequired(true)
		)
		.addStringOption((option) =>
			option
				.setName("link")
				.setDescription("A URL to include as a button (optional)")
				.setRequired(false)
		),
	async execute(interaction) {
		const message = interaction.options.getString("message");
		const link = interaction.options.getString("link");
		const ticketChannel = interaction.channel;

		// Verify the command is used in a ticket channel
		if (!ticketChannel.name.startsWith("ticket-")) {
			return interaction.reply({
				content: "This command can only be used in a ticket channel.",
				ephemeral: true,
			});
		}

		const components = [];

		if (link) {
			const button = new ButtonBuilder()
				.setLabel("Open Link")
				.setStyle(ButtonStyle.Link)
				.setURL(link);
			const actionRow = new ActionRowBuilder().addComponents(button);
			components.push(actionRow);
		}

		await ticketChannel.send({
			content: message,
			components,
		});

		await interaction.reply({
			content: "Message sent to the ticket channel.",
			ephemeral: true,
		});
	},
};
