import Order from '../models/orderModel.js';
import Cart from '../models/cartModel.js';
import asyncHandler from 'express-async-handler';

// Validation helpers
const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const validatePhone = (phone) => {
    const phoneRegex = /^[\d\s()+-]+$/;
    const digitsOnly = phone.replace(/\D/g, '');
    return phoneRegex.test(phone) && digitsOnly.length >= 7;
};

const validateName = (name) => {
    return name && name.trim().length >= 2 && name.trim().length <= 100;
};

const validateAddress = (address) => {
    return address && address.trim().length >= 5 && address.trim().length <= 200;
};

const validateZipcode = (zipcode) => {
    const zipcodeRegex = /^[A-Z0-9\s-]{3,10}$/i;
    return zipcodeRegex.test(zipcode);
};

// place an order
export const placeOrder = asyncHandler(async (req, res) => {
    const { deliveryAddress } = req.body;

    // Validate delivery address
    if (!deliveryAddress) {
        return res.status(400).json({ message: 'Delivery address is required' });
    }

    const { fullName, email, phone, address, city, zipCode } = deliveryAddress;

    // Validate required fields
    if (!fullName || !fullName.trim()) {
        return res.status(400).json({ message: 'Full name is required' });
    }
    if (!email || !email.trim()) {
        return res.status(400).json({ message: 'Email is required' });
    }
    if (!phone || !phone.trim()) {
        return res.status(400).json({ message: 'Phone number is required' });
    }
    if (!address || !address.trim()) {
        return res.status(400).json({ message: 'Address is required' });
    }
    if (!city || !city.trim()) {
        return res.status(400).json({ message: 'City is required' });
    }
    if (!zipCode || !zipCode.trim()) {
        return res.status(400).json({ message: 'Zip code is required' });
    }

    // Validate field formats
    if (!validateName(fullName)) {
        return res.status(400).json({ message: 'Full name must be between 2 and 100 characters' });
    }
    if (!validateEmail(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
    }
    if (!validatePhone(phone)) {
        return res.status(400).json({ message: 'Invalid phone number. Must contain at least 7 digits' });
    }
    if (!validateAddress(address)) {
        return res.status(400).json({ message: 'Address must be between 5 and 200 characters' });
    }
    if (!validateName(city)) {
        return res.status(400).json({ message: 'City name must be valid' });
    }
    if (!validateZipcode(zipCode)) {
        return res.status(400).json({ message: 'Invalid zip code format' });
    }

    const cart = await Cart.findOne({ user: req.user._id }).populate('items.menuItem');
    if (!cart || cart.items.length === 0) {
        return res.status(400).json({ message: 'Cart is empty' });
    }

    const orderItems = cart.items.map(item => ({
        name: item.menuItem.name,
        qty: item.qty,
        price: item.menuItem.price,
        menuItem: item.menuItem._id,
    }));

    const totalPrice = orderItems.reduce((acc, item) => acc + item.qty * item.price, 0);

    const order = await Order.create({
        user: req.user._id,
        orderItems,
        totalPrice,
        deliveryAddress: {
            fullName: fullName.trim(),
            email: email.trim().toLowerCase(),
            phone: phone.trim(),
            address: address.trim(),
            city: city.trim(),
            zipCode: zipCode.trim().toUpperCase(),
        },
    });

    // Clear cart after order
    cart.items = [];
    await cart.save();

    res.status(201).json(order);
});

//get user's orders
export const getUserOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id }).populate('orderItems.menuItem');
    res.json(orders);
});
