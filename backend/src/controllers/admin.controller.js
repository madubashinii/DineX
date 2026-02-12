import MenuItem from '../models/menuItem.js';
import Reservation from '../models/reservationModel.js';
import asyncHandler from 'express-async-handler';

// get all menu items (admin)
export const getMenuItems = asyncHandler(async (req, res) => {
    const menuItems = await MenuItem.find({});
    res.json(menuItems);
});

// create new menu item
export const createMenuItem = asyncHandler(async (req, res) => {
    const { name, description, price, emoji, category } = req.body;

    const menuItem = new MenuItem({
        name,
        description,
        price,
        emoji,
        category,
    });

    const createdItem = await menuItem.save();
    res.status(201).json(createdItem);
});

// update menu item
export const updateMenuItem = asyncHandler(async (req, res) => {
    const menuItem = await MenuItem.findById(req.params.id);

    if (menuItem) {
        menuItem.name = req.body.name || menuItem.name;
        menuItem.description = req.body.description || menuItem.description;
        menuItem.price = req.body.price || menuItem.price;
        menuItem.emoji = req.body.emoji || menuItem.emoji;
        menuItem.category = req.body.category || menuItem.category;

        const updatedItem = await menuItem.save();
        res.json(updatedItem);
    } else {
        res.status(404);
        throw new Error('Menu item not found');
    }
});

// delete menu item
export const deleteMenuItem = asyncHandler(async (req, res) => {
    const menuItem = await MenuItem.findById(req.params.id);

    if (menuItem) {
        await menuItem.remove();
        res.json({ message: 'Menu item removed' });
    } else {
        res.status(404);
        throw new Error('Menu item not found');
    }
});

// get all reservations (admin)
export const getAllReservations = asyncHandler(async (req, res) => {
    const reservations = await Reservation.find({}).populate('user', 'name email');
    res.json(reservations);
});

// Update reservation status (Pending, Confirmed, Cancelled)
export const updateReservationStatus = asyncHandler(async (req, res) => {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
        res.status(404);
        throw new Error('Reservation not found');
    }
    const { status } = req.body;
    if (!['Pending', 'Confirmed', 'Cancelled'].includes(status)) {
        res.status(400);
        throw new Error('Invalid status value');
    }
    reservation.status = status;
    const updatedReservation = await reservation.save();
    res.json(updatedReservation);
});

// ========================= ORDERS ========================
export const getAllOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({}).populate('user', 'name email');
    res.json(orders);
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (!order) {
        res.status(404);
        throw new Error('Order not found');
    }
    const { status } = req.body;
    if (!['Pending', 'Processing', 'Completed', 'Cancelled'].includes(status)) {
        res.status(400);
        throw new Error('Invalid status value');
    }
    order.status = status;
    const updatedOrder = await order.save();
    res.json(updatedOrder);
});

// ========================= USERS =========================
export const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find({}).select('-password');
    res.json(users);
});

export const updateUserRole = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }
    const { role } = req.body;
    if (!['customer', 'admin'].includes(role)) {
        res.status(400);
        throw new Error('Invalid role');
    }
    user.role = role;
    const updatedUser = await user.save();
    res.json(updatedUser);
});