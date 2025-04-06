import ReadingMaterial from '../models/ReadingMaterial.js';

// Helper function to filter options
const filterOptions = (type, options) => {
    return options.map(option => {
        let filteredOption = { text: option.text };
        if (type !== 'reorder') {
            filteredOption.isCorrect = option.isCorrect;
        } else {
            filteredOption.order = option.order;
        }
        return filteredOption;
    });
};

// Create new reading material
export const createReadingMaterial = async (req, res) => {
    try {
        const { title, type, content, options, fileUrl, passage, isPremium } = req.body;

        if (!title || !type || !content || !options) {
            return res.status(400).json({ status: false, message: 'Please provide all required fields.' });
        }

        const newReadingMaterial = new ReadingMaterial({
            title,
            type,
            content,
            options,
            fileUrl,
            passage,
            isPremium, // Make sure isPremium is added here
        });

        await newReadingMaterial.save();
        res.status(201).json({
            status: true,
            message: 'Reading material created successfully.',
            readingMaterial: {
                id: newReadingMaterial._id,
                slug: newReadingMaterial.slug,
                title: newReadingMaterial.title,
                type: newReadingMaterial.type,
                content: newReadingMaterial.content,
                options: filterOptions(newReadingMaterial.type, newReadingMaterial.options),
                fileUrl: newReadingMaterial.fileUrl,
                passage: newReadingMaterial.passage,
                isPremium: newReadingMaterial.isPremium, // Include isPremium in the response
                createdAt: newReadingMaterial.createdAt
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: 'Server error, could not create reading material.' });
    }
};

// Get all reading materials
export const getAllReadingMaterials = async (req, res) => {
    try {
        const readingMaterials = await ReadingMaterial.find();
        const formattedMaterials = readingMaterials.map(material => ({
            id: material._id,
            slug: material.slug,
            title: material.title,
            type: material.type,
            content: material.content,
            options: filterOptions(material.type, material.options),
            fileUrl: material.fileUrl,
            passage: material.passage,
            isPremium: material.isPremium, // Include isPremium here as well
            createdAt: material.createdAt
        }));

        res.status(200).json({ status: true, readingMaterials: formattedMaterials });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: 'Failed to retrieve reading materials.' });
    }
};

// Filter reading materials by title only
export const filterReadingMaterials = async (req, res) => {
    try {
        const { title } = req.query;

        if (!title) {
            return res.status(400).json({ status: false, message: 'Title query is required.' });
        }

        const readingMaterials = await ReadingMaterial.find({
            title: { $regex: title, $options: 'i' } // Case-insensitive, partial match
        });

        const formattedMaterials = readingMaterials.map(material => ({
            id: material._id,
            slug: material.slug,
            title: material.title,
            type: material.type,
            content: material.content,
            options: filterOptions(material.type, material.options),
            fileUrl: material.fileUrl,
            passage: material.passage,
            isPremium: material.isPremium,
            createdAt: material.createdAt
        }));

        res.status(200).json({ status: true, readingMaterials: formattedMaterials });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: 'Failed to filter reading materials.' });
    }
};


// Get a specific reading material by slug
export const getReadingMaterialBySlug = async (req, res) => {
    try {
        const material = await ReadingMaterial.findOne({ slug: req.params.slug });
        if (!material) {
            return res.status(404).json({ status: false, message: 'Reading material not found.' });
        }

        res.status(200).json({
            status: true,
            readingMaterial: {
                id: material._id,
                slug: material.slug,
                title: material.title,
                type: material.type,
                content: material.content,
                options: filterOptions(material.type, material.options),
                fileUrl: material.fileUrl,
                passage: material.passage,
                isPremium: material.isPremium, // Include isPremium here as well
                createdAt: material.createdAt
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: 'Failed to retrieve reading material.' });
    }
};

// Update a reading material
export const updateReadingMaterial = async (req, res) => {
    try {
        const updatedMaterial = await ReadingMaterial.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedMaterial) {
            return res.status(404).json({ status: false, message: 'Reading material not found.' });
        }
        res.status(200).json({
            status: true,
            message: 'Reading material updated successfully.',
            readingMaterial: {
                id: updatedMaterial._id,
                slug: updatedMaterial.slug,
                title: updatedMaterial.title,
                type: updatedMaterial.type,
                content: updatedMaterial.content,
                options: filterOptions(updatedMaterial.type, updatedMaterial.options),
                fileUrl: updatedMaterial.fileUrl,
                passage: updatedMaterial.passage,
                isPremium: updatedMaterial.isPremium, // Include isPremium here as well
                createdAt: updatedMaterial.createdAt
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: 'Failed to update reading material.' });
    }
};

// Delete a reading material
export const deleteReadingMaterial = async (req, res) => {
    try {
        const deletedMaterial = await ReadingMaterial.findByIdAndDelete(req.params.id);
        if (!deletedMaterial) {
            return res.status(404).json({ status: false, message: 'Reading material not found.' });
        }
        res.status(200).json({ status: true, message: 'Reading material deleted successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: 'Failed to delete reading material.' });
    }
};
