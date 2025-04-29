import Course from "../models/Courses.js";

export const getCourses = async (req, res) => {
    try {
        const courses = await Course.find();

        res.status(200).json({
            success: true,
            count: courses.length,
            data: courses
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
        const { course_name, course_image, course_url } = req.body;

        if (!course_name || !course_image || !course_url) {
            return res.status(400).json({
                status: false,
                message: 'Please provide name, image, and url.'
            });
        }

        const newCourse=new Course({
            course_name,course_image,course_url
        });

        await newCourse.save();

        res.status(201).json({
            status: true,
            message: 'Course created successfully.',
            course: {
                id: newCourse._id,
                course_image: newCourse.name,
                image: newCourse.image,
                course_url: newCourse.url,
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

        res.status(200).json({
            success: true,
            data: course
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
        const course = await Course.findByIdAndUpdate(
            req.params.id,
            { ...req.body, updatedAt: Date.now() },
            { new: true, runValidators: true }
        );

        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        res.status(200).json({
            success: true,
            data: course
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
        const course = await Course.findByIdAndDelete(req.params.id);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

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
