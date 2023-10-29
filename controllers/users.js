const router = require('express').Router()

const { User, Blog, ReadingList } = require('../models')

router.get('/', async (req, res) => {
	const users = await User.findAll({
		include: {
			model: Blog, 
			attributes: { exclude: ['userId'] }
		}
	})
	res.json(users)
})

router.get('/:id', async (req, res) => {
	const where = {}

	if (req.query.read) {
		where.markedAsRead = req.query.read === "true"
	}

	const user = await User.findByPk(req.params.id, {
		include: [
			{
				model: Blog,
				as: 'readings',
				through: {
					attributes: ['id', 'markedAsRead'],
					where
				},
			}
		]
	})
  if (user) {
    res.json(user)
  } else {
    res.status(404).end()
  }
})

router.post('/', async (req, res, next) => {
	try {
		const user = await User.create(req.body)
		res.json(user)
	} catch(error) {
		next(error)
	}
})

router.put('/:username', async (req, res) => {
	const user = await User.findOne({
		where: {
			username: req.params.username
		},
	})
	if (user) {
		user.username = req.body.username
		await user.save()
		res.json(user)
	} else {
		res.status(404).end()
	}
})

module.exports = router