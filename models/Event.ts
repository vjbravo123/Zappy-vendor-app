import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema({
  vendorId: String,
  status: { type: String, enum: ['idle', 'checked_in', 'started', 'completed'], default: 'idle' },
  checkIn: {
    photo: String,
    location: { lat: Number, lng: Number },
    timestamp: Date,
  },
  setup: {
    prePhoto: String,
    postPhoto: String,
    notes: String,
  },
  createdAt: { type: Date, default: Date.now }
});

export const Event = mongoose.models.Event || mongoose.model('Event', EventSchema);