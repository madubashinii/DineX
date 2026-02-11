import mongoose from 'mongoose';

const cartItemSchema = mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        items: [
            {
                menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem', required: true },
                qty: { type: Number, required: true },
            },
        ],
    },
    { timestamps: true }
);

const Cart = mongoose.model('Cart', cartItemSchema);
export default Cart;
