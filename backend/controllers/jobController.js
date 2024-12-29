const Job = require('../models/Job');

// Post a new job listing
exports.createJob = async (req, res) => {
    try {
        const { title, description, requirements, location, deadline } = req.body;
        const newJob = new Job({
            title, description, requirements, location, deadline, employerId: req.userId
        });
        await newJob.save();
        res.status(201).json(newJob);
    } catch (err) {
        res.status(500).json({ error: 'Server Error' });
    }
};

// Get all job listings
exports.getJobs = async (req, res) => {
    try {
        const jobs = await Job.find().populate('employerId', 'username');
        res.json(jobs);
    } catch (err) {
        res.status(500).json({ error: 'Server Error' });
    }
};

// Apply for a job
exports.applyJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.jobId);
        if (job.applicants.includes(req.userId)) return res.status(400).json({ error: 'Already applied' });

        job.applicants.push(req.userId);
        await job.save();
        res.json({ message: 'Applied successfully!' });
    } catch (err) {
        res.status(500).json({ error: 'Server Error' });
    }
};

// Delete a job listing (Employer only)
exports.deleteJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.jobId);
        if (!job || job.employerId.toString() !== req.userId.toString()) {
            return res.status(403).json({ error: 'Not authorized' });
        }
        await job.remove();
        res.json({ message: 'Job deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Server Error' });
    }
};
