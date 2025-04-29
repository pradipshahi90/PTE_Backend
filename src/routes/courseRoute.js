import express from 'express';
import { createCourse, deleteCourse, getCourseById, getCourses, updateCourse } from '../controllers/courseController.js';
import upload from "../middleware/upload.js";


const router = express.Router();


router.get('/get-courses', getCourses);
router.post('/add-course', upload.single('course_image'), createCourse);  // 🛑 Added middleware here
router.get('/:id', getCourseById);
router.put('/:id', upload.single('course_image'), updateCourse); // 🛑 Also added for update
router.delete('/:id', deleteCourse);

export default router;