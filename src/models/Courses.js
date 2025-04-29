import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
    course_name: { type: String, required: [true,'Name is required'] },
    course_image: { type: String, required: [true, 'Image is required'] },
    course_url: { type: String, required: [true, 'Course url is required'] },
  }, { timestamps: true });
  
  const Course = mongoose.model('Course', courseSchema);

  export default Course;