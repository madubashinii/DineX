import Cart from '../models/cartModel.js';
import MenuItem from '../models/menuItem.js';
import asyncHandler from 'express-async-handler';

// add/update item in cart
export const addToCart = asyncHandler(async (req, res) => {
    const { menuItemId, qty } = req.body;
    const userId = req.user._id;

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
        cart = new Cart({ user: userId, items: [{ menuItem: menuItemId, qty }] });
    } else {
        const itemIndex = cart.items.findIndex(item => item.menuItem.toString() === menuItemId);
        if (itemIndex > -1) {
            cart.items[itemIndex].qty = qty;
        } else {
            cart.items.push({ menuItem: menuItemId, qty });
        }
    }

    await cart.save();
    const populatedCart = await cart.populate('items.menuItem');
    res.status(200).json(populatedCart);
});

//get cart items
export const getCart = asyncHandler(async (req, res) => {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.menuItem');
    res.json(cart || { items: [] });
});

// remove item from cart
export const removeFromCart = asyncHandler(async (req, res) => {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = cart.items.filter(item => item.menuItem.toString() !== req.params.menuItemId);
    await cart.save();
    res.status(200).json(cart);
});
