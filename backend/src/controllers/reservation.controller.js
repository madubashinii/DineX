import Reservation from '../models/reservationModel.js';
import asyncHandler from 'express-async-handler';

// Validation helpers
const validateName = (name) => {
    return name && name.trim().length >= 2 && name.trim().length <= 100;
};

const validatePhone = (phone) => {
    const phoneRegex = /^[\d\s()+-]+$/;
    const digitsOnly = phone.replace(/\D/g, '');
    return phoneRegex.test(phone) && digitsOnly.length >= 7;
};

// create a reservation
export const createReservation = asyncHandler(async (req, res) => {
    const { name, phone, guests, date, time, specialRequests, specialRequest } = req.body;
    const normalizedSpecialRequests = specialRequests ?? specialRequest ?? '';

    // Validation
    if (!validateName(name)) {
        return res.status(400).json({ message: 'Name must be between 2 and 100 characters' });
    }

    if (!validatePhone(phone)) {
        return res.status(400).json({ message: 'Invalid phone number. Must contain at least 7 digits' });
    }

    if (!guests || guests < 1) {
        return res.status(400).json({ message: 'Number of guests must be at least 1' });
    }

    if (!date) {
        return res.status(400).json({ message: 'Date is required' });
    }

    if (!time) {
        return res.status(400).json({ message: 'Time is required' });
    }

    const reservation = await Reservation.create({
        user: req.user._id,
        name: name.trim(),
        phone: phone.trim(),
        guests,
        date,
        time,
        specialRequests: normalizedSpecialRequests,
    });

    res.status(201).json(reservation);
});

// get user's reservations
export const getUserReservations = asyncHandler(async (req, res) => {
    const reservations = await Reservation.find({ user: req.user._id });
    res.json(reservations);
});

// cancel a reservation
export const cancelReservation = asyncHandler(async (req, res) => {
    const reservation = await Reservation.findOne({ _id: req.params.id, user: req.user._id });
    if (!reservation) return res.status(404).json({ message: 'Reservation not found' });

    reservation.status = 'Cancelled';
    await reservation.save();
    res.json({ message: 'Reservation cancelled', reservation });
});

// update a reservation (user)
export const updateReservation = asyncHandler(async (req, res) => {
    const { date, time, guests, specialRequests } = req.body;

    const reservation = await Reservation.findOne({ _id: req.params.id, user: req.user._id });
    if (!reservation) return res.status(404).json({ message: 'Reservation not found' });

    if (reservation.status === 'Cancelled') {
        return res.status(400).json({ message: 'Cannot modify a cancelled reservation' });
    }

    // Basic validation
    if (!date) return res.status(400).json({ message: 'Date is required' });
    if (!time) return res.status(400).json({ message: 'Time is required' });
    if (!guests || guests < 1) return res.status(400).json({ message: 'Guests must be at least 1' });

    reservation.date = date;
    reservation.time = time;
    reservation.guests = guests;
    reservation.specialRequests = specialRequests ?? reservation.specialRequests;

    const updated = await reservation.save();
    res.json(updated);
});
