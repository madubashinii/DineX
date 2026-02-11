import mongoose from 'mongoose';

const menuItemSchema = mongoose.Schema(
    {
        name: { type: String, required: true },
        description: { type: String },
        price: { type: Number, required: true },
        emoji: { type: String },
        category: { type: String, required: true },
    },
    { timestamps: true }
);

const MenuItem = mongoose.model('MenuItem', menuItemSchema);

export default MenuItem;
