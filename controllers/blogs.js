const router = require('express').Router()
const { Op } = require('sequelize')

const { tokenExtractor } = require('../util/middleware')
const { Blog, User, ActiveSession } = require('../models')

router.get('/', async (req, res) => {
	let where = {}

	if (req.query.search) {
		where = {
			[Op.or]: [
				{ 
					title: {
						[Op.iLike]: `%${req.query.search}%`
					}
				},
				{ 
					author: {
						[Op.iLike]: `%${req.query.search}%`
					}
				},
			]
		}
	}

	const blogs = await Blog.findAll({
		attributes: { exclude: ['userId'] },
		include: {
			model: User,
			attributes: ['name']
		},
		where,
		order: [
			['likes', 'DESC'],
		],
	})
	res.json(blogs)
})

router.post('/', tokenExtractor, async (req, res, next) => {
	// try {
	// 	const user = await User.findByPk(req.decodedToken.id)
	// 	const blog = await Blog.create({ ...req.body, userId: user.id, })
	// 	res.json(blog)
	// } catch(error) {
	// 	return res.status(400).json({ error })
	// }
	const activeSession = await ActiveSession.findByPk(req.decodedToken.sessionId)
	if (!activeSession) {
		return res.status(401).json({ error: 'Your token has expired. Log in and try again.' })
	}
	
	const user = await User.findByPk(req.decodedToken.id)
	const blog = await Blog.create({ ...req.body, userId: user.id, })
	res.json(blog)
})

const blogFinder = async (req, res, next) => {
	req.blog = await Blog.findByPk(req.params.id)
	next()
}

router.get('/:id', blogFinder, async (req, res) => {
	if (req.blog) {
		res.json(blog)
	} else {
		res.status(404).end()
	}
})

router.delete('/:id', tokenExtractor, blogFinder, async (req, res) => {
	const activeSession = await ActiveSession.findByPk(req.decodedToken.sessionId)
	if (!activeSession) {
		return res.status(401).json({ error: 'Your token has expired. Log in and try again.' })
	}

	if (req.blog) {
		if (req.decodedToken.id === req.blog.userId) {
			await req.blog.destroy()
		} else {
			res.status(401).json({ error: 'Only creator of the blog can delete the blog.' })
		}
	} 
	res.status(204).end()
})

router.put('/:id', blogFinder, async (req, res, next) => {
	if (req.blog) {
		// try {
		// 	req.blog.likes = req.body.likes
		// 	await req.blog.save()
		// 	res.json(req.blog)
		// } catch(error) {
		// 	next(error)
		// }
		req.blog.likes = req.body.likes
		await req.blog.save()
		res.json(req.blog)
	} else {
		res.status(404).end()
	}
})

module.exports = router