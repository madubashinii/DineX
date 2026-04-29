import User from '../models/User.js';

// Validation helpers
const validateProfileName = (name) => {
    return name && name.trim().length >= 2 && name.trim().length <= 100;
};

const validateProfilePhone = (phone) => {
    if (!phone || phone.trim() === '') return true; // Phone is optional
    const phoneRegex = /^[\d\s()+-]+$/;
    const digitsOnly = phone.replace(/\D/g, '');
    return phoneRegex.test(phone) && digitsOnly.length >= 7;
};

// get logged-in user profile
export const getUserProfile = async (req, res) => {
    const user = req.user;

    if (user) {
        res.status(200).json({
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone || '',
            address: user.address || '',
            city: user.city || '',
            zipCode: user.zipCode || '',
            role: user.role,
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// update user profile
export const updateUserProfile = async (req, res) => {
    try {
        const { name, phone, address, city, zipCode } = req.body;
        const userId = req.user._id;

        // Validate inputs
        if (name !== undefined && !validateProfileName(name)) {
            return res.status(400).json({ message: 'Name must be between 2 and 100 characters' });
        }

        if (phone !== undefined && !validateProfilePhone(phone)) {
            return res.status(400).json({ message: 'Invalid phone number. Must contain at least 7 digits' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (name) user.name = name.trim();
        if (phone !== undefined) user.phone = phone ? phone.trim() : '';
        if (address !== undefined) user.address = address ? address.trim() : '';
        if (city !== undefined) user.city = city ? city.trim() : '';
        if (zipCode !== undefined) user.zipCode = zipCode ? zipCode.trim().toUpperCase() : '';

        const updatedUser = await user.save();

        res.status(200).json({
            message: 'Profile updated successfully',
            user: {
                id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                phone: updatedUser.phone || '',
                address: updatedUser.address || '',
                city: updatedUser.city || '',
                zipCode: updatedUser.zipCode || '',
                role: updatedUser.role,
            },
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
