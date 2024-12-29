const express = require('express');
const { createJob, getJobs, applyJob, deleteJob } = require('../controllers/jobController');
const { protect, employer } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', protect, employer, createJob); // Create job (Employer only)
router.get('/', getJobs); // Get all jobs (Public)
router.post('/:jobId/apply', protect, applyJob); // Apply to a job (Authenticated users)
router.delete('/:jobId', protect, employer, deleteJob); // Delete job (Employer only)

module.exports = router;
