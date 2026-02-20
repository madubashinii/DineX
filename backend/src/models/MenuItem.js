import mongoose from 'mongoose';

const menuItemSchema = mongoose.Schema(
    {
        name: { type: String, required: true },
        description: { type: String },
        price: { type: Number, required: true },
        image: { type: String, required: true },
        category: { type: String, required: true },
    },
    { timestamps: true }
);

const MenuItem = mongoose.model('MenuItem', menuItemSchema);
export default MenuItem;