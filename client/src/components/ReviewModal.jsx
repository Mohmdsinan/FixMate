import React, { useState } from 'react';
import { X } from 'lucide-react';
import RatingStars from './RatingStars';
import api from '../api/axios';

const ReviewModal = ({ booking, onClose, onSuccess }) => {
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (rating < 1 || rating > 5) {
      setError('Please select a rating between 1 and 5 stars');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/reviews', {
        booking_id: booking.id,
        rating,
        review_text: reviewText.trim()
      });
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-lg rounded-xl p-6 border border-gray-100 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-[#1B225B] p-1 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <X size={20} />
        </button>

        <h3 className="font-heading font-bold text-xl text-[#1B225B] mb-1">Leave a Review</h3>
        <p className="font-body text-xs text-gray-500 mb-6">
          Rate your experience with <span className="text-[#39A8C7] font-semibold">{booking.worker_name}</span> ({booking.worker_profession})
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs font-body">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Star Selection */}
          <div>
            <label className="block font-heading font-semibold text-xs text-[#1B225B] mb-2">
              Your Rating
            </label>
            <div className="flex items-center space-x-3 bg-[#F6F8FB] p-4 rounded-lg border border-gray-200 justify-center">
              <RatingStars rating={rating} size={32} interactive onSelect={setRating} />
              <span className="font-heading font-bold text-lg text-amber-500 w-8">{rating}★</span>
            </div>
          </div>

          {/* Review Text */}
          <div>
            <label className="block font-heading font-semibold text-xs text-[#1B225B] mb-2">
              Written Feedback (Optional)
            </label>
            <textarea
              rows={4}
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Describe the quality of work, punctuality, and professionalism..."
              className="w-full bg-[#F6F8FB] border border-gray-200 rounded-lg p-3 text-sm font-body text-[#222222] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#39A8C7] focus:border-[#39A8C7]"
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-lg border border-[#1B225B] text-[#1B225B] hover:bg-[#1B225B]/5 text-xs font-heading font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-lg bg-[#39A8C7] hover:bg-[#3195b1] text-white text-xs font-heading font-semibold transition-colors shadow-sm disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;
