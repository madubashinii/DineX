// get logged-in user profile
export const getUserProfile = async (req, res) => {
    const user = req.user;

    if (user) {
        res.status(200).json({
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};
