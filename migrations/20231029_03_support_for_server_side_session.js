const { DataTypes } = require('sequelize')

module.exports = {
	up: async ({ context: queryInterface }) => {
		await queryInterface.addColumn('users', 'disabled', {
			type: DataTypes.BOOLEAN,
			defaultValue: false
		})
		await queryInterface.createTable('active_sessions', {
			id: {
				type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
			},
			user_id: {
				type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
			},
		})
	}, 
	down: async ({ context: queryInterface }) => {
		await queryInterface.removeColumn('users', 'disabled')
		await queryInterface.dropTable('active_sessions')
	}, 
}