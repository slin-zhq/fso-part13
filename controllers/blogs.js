const router = require('express').Router()
const jwt = require('jsonwebtoken')

const { Blog, User } = require('../models')
const { SECRET } = require('../util/config')

router.get('/', async (req, res) => {
	const blogs = await Blog.findAll({
		attributes: { exclude: ['userId'] },
		include: {
			model: User,
			attributes: ['name']
		}
	})
	res.json(blogs)
})

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      console.log(authorization.substring(7))
      console.log(SECRET)
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
    } catch (error) {
      console.log(error)
      return res.status(401).json({ error: 'token invalid' })
    }
  } else {
    return res.status(401).json({ error: 'token missing' })
  }

  next()
}

router.post('/', tokenExtractor, async (req, res, next) => {
	// try {
	// 	const user = await User.findByPk(req.decodedToken.id)
	// 	const blog = await Blog.create({ ...req.body, userId: user.id, })
	// 	res.json(blog)
	// } catch(error) {
	// 	return res.status(400).json({ error })
	// }

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