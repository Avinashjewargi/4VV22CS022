
const mongoose = require('mongoose');

const clickSchema = new mongoose.Schema({
    timestamp: { type: Date, default: Date.now },
    source: { type: String, default: 'unknown' }, // Referrer
    coarse_grained_geographical_location: { type: String, default: 'unknown' }
});

const urlSchema = new mongoose.Schema({
    originalUrl: {
        type: String,
        required: true,
        unique: true 
    },
    shortCode: {
        type: String,
        required: true,
        unique: true, 
        index: true
    },
    creationDate: {
        type: Date,
        default: Date.now
    },
    expiryDate: {
        type: Date,
        required: true
    },
    clicks: [clickSchema] 
});

module.exports = mongoose.model('Url', urlSchema);