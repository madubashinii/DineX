import Reservation from '../models/reservationModel.js';
import asyncHandler from 'express-async-handler';

// create a reservation
export const createReservation = asyncHandler(async (req, res) => {
    const { guests, date, time, specialRequests } = req.body;

    const reservation = await Reservation.create({
        user: req.user._id,
        guests,
        date,
        time,
        specialRequests,
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
