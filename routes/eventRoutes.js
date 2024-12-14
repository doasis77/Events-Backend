const express = require('express');
const { createEvent, getEvents, rsvpEvent, getUserRSVPs } = require('../controllers/eventController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getEvents);
router.post('/', createEvent);
router.put('/:id/rsvp', rsvpEvent);
router.get('/user-rsvps', authMiddleware(), getUserRSVPs);

module.exports = router;
