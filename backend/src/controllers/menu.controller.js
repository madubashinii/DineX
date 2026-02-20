import MenuItem from '../models/menuItem.js';

export const getMenuItems = async (req, res) => {
    try {
        const items = await MenuItem.find();
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createMenuItem = async (req, res) => {
    try {
        const { name, description, price, category, image } = req.body;

        const item = new MenuItem({
            name,
            description,
            price,
            category,
            image,
        });

        const createdItem = await item.save();
        res.status(201).json(createdItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};