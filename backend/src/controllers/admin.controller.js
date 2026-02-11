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
