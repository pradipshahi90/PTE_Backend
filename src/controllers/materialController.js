import ReadingMaterial from '../models/ReadingMaterial.js';

// Create new reading material
export const createReadingMaterial = async (req, res) => {
    try {
        const { title, type, content, options, fileUrl, passage } = req.body;

        // Validate required fields
        if (!title || !type || !content || !options) {
            return res.status(400).json({ status: false, message: 'Please provide all required fields.' });
        }

        const newReadingMaterial = new ReadingMaterial({
            title,
            type,
            content,
            options,
            fileUrl,
            passage // Optional passage
        });

        await newReadingMaterial.save();
        res.status(201).json({
            status: true,
            message: 'Reading material created successfully.',
            readingMaterial: {
                id: newReadingMaterial._id,
                title: newReadingMaterial.title,
                type: newReadingMaterial.type,
                content: newReadingMaterial.content,
                options: newReadingMaterial.options,
                fileUrl: newReadingMaterial.fileUrl,
                passage: newReadingMaterial.passage, // Include passage in the response
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
            title: material.title,
            type: material.type,
            content: material.content,
            options: material.options,
            fileUrl: material.fileUrl,
            passage: material.passage, // Include passage
            createdAt: material.createdAt
        }));

        res.status(200).json({ status: true, readingMaterials: formattedMaterials });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: 'Failed to retrieve reading materials.' });
    }
};

// Get a specific reading material by ID
export const getReadingMaterialById = async (req, res) => {
    try {
        const material = await ReadingMaterial.findById(req.params.id);
        if (!material) {
            return res.status(404).json({ status: false, message: 'Reading material not found.' });
        }

        res.status(200).json({
            status: true,
            readingMaterial: {
                id: material._id,
                title: material.title,
                type: material.type,
                content: material.content,
                options: material.options,
                fileUrl: material.fileUrl,
                passage: material.passage, // Include passage
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
                title: updatedMaterial.title,
                type: updatedMaterial.type,
                content: updatedMaterial.content,
                options: updatedMaterial.options,
                fileUrl: updatedMaterial.fileUrl,
                passage: updatedMaterial.passage, // Include passage
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
