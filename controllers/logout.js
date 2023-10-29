const router = require('express').Router()

const { tokenExtractor } = require('../util/middleware')
const { ActiveSession } = require('../models')

router.delete('/', tokenExtractor, async (req, res) => {
	const activeSession = await ActiveSession.findByPk(req.decodedToken.sessionId)
	if (activeSession) {
		await activeSession.destroy()
		res.status(204).end()
	} else {
		res.status(401).json({ error: 'Already logged out.' })
	}
})

module.exports = router