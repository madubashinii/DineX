import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },

        password: {
            type: String,
            required: true,
            minlength: 6,
        },

        role: {
            type: String,
            enum: ['customer', 'admin'],
            default: 'customer',
        },

        phone: {
            type: String,
            trim: true,
        },

        address: {
            type: String,
            trim: true,
        },

        city: {
            type: String,
            trim: true,
        },

        zipCode: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model('User', userSchema);
export default User;
