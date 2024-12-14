const Event = require('../models/Event');
const { User, RSVP } = require('../models/User');

exports.getEvents = async (req, res) => {
    try {
        const events = await Event.find();
        res.status(200).json({
            success: true,
            data: events
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching events',
            error: error.message
        });
    }
};

exports.createEvent = async (req, res) => {
    try {
        const { name, date, time, location, capacity } = req.body;
        
        const event = new Event({
            name,
            date,
            time,
            location,
            capacity,
            availableSeats: capacity
        });

        await event.save();
        
        res.status(201).json({
            success: true,
            message: 'Event created successfully',
            data: event
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error creating event',
            error: error.message
        });
    }
};

exports.rsvpEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        if (event.availableSeats <= 0) {
            return res.status(400).json({
                success: false,
                message: 'No seats available'
            });
        }

        // Update event seats
        event.availableSeats -= 1;
        await event.save();

        // If user is authenticated, create RSVP
        if (req.user) {
            const user = await User.findById(req.user._id);
            await user.addRSVP(event._id);
        }

        res.json({
            success: true,
            message: 'RSVP successful',
            event
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error processing RSVP',
            error: error.message
        });
    }
};

exports.getUserRSVPs = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const rsvps = await user.getRSVPs();
        
        res.json({
            success: true,
            data: rsvps
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching RSVPs',
            error: error.message
        });
    }
};
