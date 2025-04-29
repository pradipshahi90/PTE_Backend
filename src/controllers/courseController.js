import Course from "../models/Courses.js";
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Get the directory name using fileURLToPath
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

export const getCourses = async (req, res) => {
    try {
        const courses = await Course.find();

        // For each course, construct the full image URL
        const coursesWithImageUrls = courses.map(course => {
            const courseObj = course.toObject();
            if (courseObj.course_image && !courseObj.course_image.startsWith('http')) {
                courseObj.course_image = `http://localhost:5001/uploads/${courseObj.course_image}`;
            }
            return courseObj;
        });

        res.status(200).json({
            success: true,
            count: courses.length,
            data: coursesWithImageUrls
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const createCourse = async (req, res) => {
    try {
        const { course_name, course_url } = req.body;
        let imagePath = null;

        // Check if we have the required fields
        if (!course_name || !course_url) {
            return res.status(400).json({
                status: false,
                message: 'Please provide name and url.'
            });
        }

        // Handle the image file if it exists
        if (!req.file) {
            return res.status(400).json({
                status: false,
                message: 'Please provide an image file.'
            });
        }

        // Save file information
        imagePath = req.file.filename;

        const newCourse = new Course({
            course_name,
            course_image: imagePath,
            course_url
        });

        await newCourse.save();

        res.status(201).json({
            status: true,
            message: 'Course created successfully.',
            course: {
                id: newCourse._id,
                course_name: newCourse.course_name,
                course_image: `http://localhost:5001/uploads/${imagePath}`,
                course_url: newCourse.course_url,
                createdAt: newCourse.createdAt
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: false,
            message: 'Server error, could not create course.'
        });
    }
};

export const getCourseById = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        // Construct proper image URL
        const courseObj = course.toObject();
        if (courseObj.course_image && !courseObj.course_image.startsWith('http')) {
            courseObj.course_image = `http://localhost:5001/uploads/${courseObj.course_image}`;
        }

        res.status(200).json({
            success: true,
            data: courseObj
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const updateCourse = async (req, res) => {
    try {
        const { course_name, course_url } = req.body;
        let updateData = { course_name, course_url, updatedAt: Date.now() };

        // If new file is uploaded, update the image path
        if (req.file) {
            updateData.course_image = req.file.filename;

            // Delete old image if exists
            const oldCourse = await Course.findById(req.params.id);
            if (oldCourse && oldCourse.course_image && !oldCourse.course_image.startsWith('http')) {
                const oldImagePath = path.join(uploadsDir, oldCourse.course_image);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }
        }

        const course = await Course.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        // Prepare response with complete image URL
        const responseData = course.toObject();
        if (responseData.course_image && !responseData.course_image.startsWith('http')) {
            responseData.course_image = `http://localhost:5001/uploads/${responseData.course_image}`;
        }

        res.status(200).json({
            success: true,
            data: responseData
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

export const deleteCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        // Delete the image file if it exists
        if (course.course_image && !course.course_image.startsWith('http')) {
            const imagePath = path.join(uploadsDir, course.course_image);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        await Course.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Course deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error, could not delete course.'
        });
    }
};