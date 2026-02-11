import mongoose from 'mongoose';

const reservationSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        guests: { type: Number, required: true },
        date: { type: Date, required: true },
        time: { type: String, required: true },
        status: {
            type: String,
            enum: ['Pending', 'Confirmed', 'Cancelled'],
            default: 'Pending',
        },
        specialRequests: { type: String },
    },
    { timestamps: true }
);

const Reservation = mongoose.model('Reservation', reservationSchema);

export default Reservation;
