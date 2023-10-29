const { DataTypes } = require('sequelize')

module.exports = {
	up: async ({ context: queryInterface }) => {
		await queryInterface.addColumn('blogs', 'year', {
			type: DataTypes.INTEGER,
			defaultValue: new Date().getFullYear(),
      allowNull: true,
			validate: {
				min: {
					args: [1991],
					msg: 'Year must be no earlier than 1991.',
				}, 
				max: {
					args: [new Date().getFullYear()],
					msg: `Year must be no later than current year (${new Date().getFullYear()}).`,
				}
			},
			after: 'id',
		})
	},
	down: async ({ context: queryInterface }) => {
		await queryInterface.removeColumn('blogs', 'year')
	},
}