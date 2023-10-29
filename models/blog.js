const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class Blog extends Model {}
Blog.init({
	id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
	author: {
		type: DataTypes.TEXT,
	},
	url: {
    type: DataTypes.TEXT,
    allowNull: false
  },
	title: {
    type: DataTypes.TEXT,
    allowNull: false
  },
	likes: {
		type: DataTypes.INTEGER,
		defaultValue: 0
	},
	year: {
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
	}
}, {
	sequelize,
	underscored: true,
	timestamps: true,
	modelName: 'blog'
})

module.exports = Blog