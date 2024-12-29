const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    requirements: { type: String },
    location: { type: String },
    deadline: { type: Date },
    employerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    isFilled: { type: Boolean, default: false },
});

module.exports = mongoose.model('Job', jobSchema);
