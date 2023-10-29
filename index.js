const express = require('express')
require('express-async-errors')
const app = express()

const { PORT } = require('./util/config')
const { connectToDatabase } = require('./util/db')

const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

app.use(express.json())

const errorHandler = (error, req, res, next) => {
	let errorInResponse = error
	if (error.name === "SequelizeValidationError") {
		if (error.errors[0].message === "Validation isEmail on username failed") {
			errorInResponse = {
				error: `'username' must be a valid email address. "${error.errors[0].value} is not."`
			}
		}
	}

	return res.status(400).json({ errorInResponse })
}

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use(errorHandler)

const start = async () => {
	await connectToDatabase()
	app.listen(PORT, () => {
		console.log(`Server running on port ${PORT}`)
	})
}

start()