import express from 'express';
import { createCourse, deleteCourse, getCourseById, getCourses, updateCourse } from '../controllers/courseController.js';

const router = express.Router();

router.get('/get-courses', getCourses);
router.post('/add-course',createCourse);
router.get('/:id', getCourseById); 
router.put('/:id',updateCourse);
router.delete('/:id',deleteCourse)

export default router;