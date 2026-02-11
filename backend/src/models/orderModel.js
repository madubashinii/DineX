import mongoose from 'mongoose';

const orderSchema = mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        orderItems: [
            {
                name: { type: String, required: true },
                qty: { type: Number, required: true },
                price: { type: Number, required: true },
                menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem', required: true },
            },
        ],
        totalPrice: { type: Number, required: true },
        status: {
            type: String,
            enum: ['Pending', 'Processing', 'Completed', 'Cancelled'],
            default: 'Pending',
        },
    },
    { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);

export default Order;
