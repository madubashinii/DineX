import Order from '../models/orderModel.js';
import Cart from '../models/cartModel.js';
import asyncHandler from 'express-async-handler';

// place an order
export const placeOrder = asyncHandler(async (req, res) => {
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
