const router = require('express').Router()

const { tokenExtractor } = require('../util/middleware')
const { ReadingList, ActiveSession } = require('../models')

router.get('/', async (req, res) => {
	const readingLists = await ReadingList.findAll({})
	res.json(readingLists)
})

router.post('/', async (req, res) => {
	const readingListItem = await ReadingList.create(req.body)
	res.json(readingListItem)
})

router.put('/:id', tokenExtractor, async (req, res) => {
	const activeSession = await ActiveSession.findByPk(req.decodedToken.sessionId)
	if (!activeSession) {
		return res.status(401).json({ error: 'Your token has expired. Log in and try again.' })
	}

	const readingListItem = await ReadingList.findByPk(req.params.id)
	if (readingListItem) {
		if (req.decodedToken.id === readingListItem.userId) {
			readingListItem.markedAsRead = req.body.markedAsRead
			await readingListItem.save()
			res.json(readingListItem)
		} else {
			res.status(401).json({ error: 'Users can only mark the blogs in their own reading list as read.' })
		}
	} else {
		res.status(404).end()
	}
})

module.exports = router