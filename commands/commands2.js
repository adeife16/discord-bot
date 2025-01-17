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
				.setPlaceholder("Choose a category")
				.addOptions([
					{
						label: "Validate Wallet",
						description: "Assistance with wallet validation.",
						value: "validate_wallet",
					},
					{
						label: "Assets/Token Recovery",
						description: "Help recovering assets or tokens.",
						value: "assets_token_recovery",
					},
					{
						label: "Rectification",
						description: "Resolve discrepancies or errors.",
						value: "rectification",
					},
					{
						label: "High Gas Fees",
						description: "Issues related to gas fees.",
						value: "high_gas_fees",
					},
					{
						label: "Claim Reward",
						description: "Assistance in claiming rewards.",
						value: "claim_reward",
					},
					{
						label: "Deposit & Withdrawals",
						description: "Issues with deposits or withdrawals.",
						value: "deposit_withdrawals",
					},
					{
						label: "Slippage Error",
						description: "Help with slippage-related issues.",
						value: "slippage_error",
					},
					{
						label: "Transaction Error",
						description: "Fix errors during transactions.",
						value: "transaction_error",
					},
					{
						label: "Cross Chain Transfer",
						description: "Problems with cross-chain transfers.",
						value: "cross_chain_transfer",
					},
					{
						label: "Staking",
						description: "Support for staking-related queries.",
						value: "staking",
					},
				])
		);

		await interaction.reply({
			content: "Select a category from the dropdown:",
			components: [optionsMenu],
			ephemeral: true,
		});
	},
};
