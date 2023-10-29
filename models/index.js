const Blog = require('./blog')
const User = require('./user')
const ReadingList = require('./reading_list')
const ActiveSession = require('./active_session')

User.hasMany(Blog)
Blog.belongsTo(User)

User.belongsToMany(Blog, { through: ReadingList, as: 'readings' })
Blog.belongsToMany(User, { through: ReadingList })

// Blog.sync({ alter: true })
// User.sync({ alter: true })

module.exports = {
	Blog, User, ReadingList, ActiveSession
}