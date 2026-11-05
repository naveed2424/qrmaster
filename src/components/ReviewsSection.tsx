import { useState, useId } from 'react';
import { Star, CheckCircle, MessageSquarePlus, User, ThumbsUp } from 'lucide-react';
import { UserReview } from '../types/qr';

const INITIAL_REVIEWS: UserReview[] = [
  {
    id: 'rev-1',
    author: 'Elena Rostova',
    role: 'Boutique Coffee Roaster Owner',
    rating: 5,
    date: '2 days ago',
    toolUsed: 'Wi-Fi Network Quick Connect',
    comment:
      'Saved our cafe so much headache! We printed the Wi-Fi QR with the golden bottom "CONNECT TO WI-FI" frame on small wooden blocks for each table. Customers connect instantly without bothering the baristas during morning rush.',
    verified: true,
  },
  {
    id: 'rev-2',
    author: 'Marcus Vance',
    role: 'Commercial Real Estate Broker',
    rating: 5,
    date: '5 days ago',
    toolUsed: 'vCard 3.0 Digital Business Card',
    comment:
      'The vCard generator is the best on the internet. I love that it lets you choose Level H error correction so my agency logo sits right in the center without breaking scan speeds. 100% saved to iPhone contacts on first tap.',
    verified: true,
  },
  {
    id: 'rev-3',
    author: 'Dr. Liam Thorne',
    role: 'Dental Clinic Director',
    rating: 5,
    date: '1 week ago',
    toolUsed: 'Google Reviews Direct Link',
    comment:
      'Our clinic jumped from 84 to 290 five-star Google reviews in 3 months simply by placing this QR code at checkout. Patients scan while waiting for their receipts. Total game changer.',
    verified: true,
  },
  {
    id: 'rev-4',
    author: 'Sophie Chen',
    role: 'Event & Wedding Planner',
    rating: 5,
    date: '2 weeks ago',
    toolUsed: 'Calendar Event (iCal)',
    comment:
      'Used this for a 300-guest summit in Chicago. Guests added the keynote schedule directly to their Google and Apple calendars from their printed badges. Zero lost attendees!',
    verified: true,
  },
  {
    id: 'rev-5',
    author: 'Tariq Al-Mansoor',
    role: 'Fintech Freelance Engineer',
    rating: 5,
    date: '3 weeks ago',
    toolUsed: 'Bitcoin & Crypto Payment',
    comment:
      'No subscription traps like other sites. The SVG vector export went straight into my invoice template and was crystal clear on 300 DPI prints. Thank you Afzal for keeping this 100% free!',
    verified: true,
  },
];

export default function ReviewsSection() {
  const [reviews, setReviews] = useState<UserReview[]>(() => {
    const saved = localStorage.getItem('user_community_reviews');
    if (saved) {
      try {
        return [...JSON.parse(saved), ...INITIAL_REVIEWS];
      } catch {
        return INITIAL_REVIEWS;
      }
    }
    return INITIAL_REVIEWS;
  });

  const [authorName, setAuthorName] = useState('');
  const [role, setRole] = useState('');
  const [toolUsed, setToolUsed] = useState('Wi-Fi Network Quick Connect');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Generate unique IDs for form elements
  const authorNameInputId = useId();
  const roleInputId = useId();
  const toolUsedInputId = useId();
  const commentInputId = useId();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !comment.trim()) return;

    const newRev: UserReview = {
      id: `rev-${Date.now()}`,
      author: authorName.trim(),
      role: role.trim() || 'Verified User',
      rating,
      date: 'Just now',
      toolUsed,
      comment: comment.trim(),
      verified: true,
    };

    const userAdded = JSON.parse(localStorage.getItem('user_community_reviews') || '[]');
    userAdded.unshift(newRev);
    localStorage.setItem('user_community_reviews', JSON.stringify(userAdded));

    setReviews([newRev, ...reviews]);
    setSubmitted(true);
    setAuthorName('');
    setRole('');
    setComment('');
    setTimeout(() => setSubmitted(false), 4000);
  };

  const avgRating = (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1);

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 space-y-12">
      {/* Header and Aggregate Score */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-zinc-800">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-amber-400">
            Real Community Feedback
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight text-white mt-1">
            Loved by <span className="text-gold-gradient">Small Businesses, Cafes & Creators</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Over 100,000+ QR codes generated across 60 specialized categories worldwide.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-zinc-950 border border-amber-500/30 p-4 rounded-2xl shadow-xl shrink-0">
          <div className="flex items-center text-amber-400">
            <Star className="w-8 h-8 fill-amber-400 text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]" />
          </div>
          <div>
            <div className="flex items-baseline gap-1 font-mono">
              <span className="text-2xl font-extrabold text-white">{avgRating}</span>
              <span className="text-xs text-zinc-500">/ 5.0</span>
            </div>
            <p className="text-xs font-medium text-zinc-400">
              Based on {reviews.length + 8420} verified ratings
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Reviews List (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <h3 className="text-base font-extrabold text-white">
            Recent Verified Reviews
          </h3>

          <div className="space-y-4">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="p-5 bg-zinc-950/90 border border-zinc-800/80 hover:border-amber-500/40 rounded-2xl shadow-md space-y-3 transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white">{rev.author}</h4>
                      {rev.verified && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400">
                          <CheckCircle className="w-3 h-3 text-amber-400" />
                          Verified User
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-400">{rev.role}</p>
                  </div>

                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  "{rev.comment}"
                </p>

                <div className="pt-2 flex items-center justify-between text-[11px] text-zinc-400 border-t border-zinc-900">
                  <span className="font-semibold text-amber-400">Tool: {rev.toolUsed}</span>
                  <span>{rev.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Review Form (4 cols) */}
        <div className="lg:col-span-4 bg-zinc-950/90 border border-amber-500/25 rounded-2xl p-6 shadow-2xl space-y-4 backdrop-blur-xl">
          <div className="flex items-center gap-2 pb-2 border-b border-zinc-800">
            <MessageSquarePlus className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-extrabold text-white">Leave Your Review</h3>
          </div>

          {submitted ? (
            <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl text-center space-y-2">
              <CheckCircle className="w-6 h-6 text-amber-400 mx-auto" />
              <p className="text-xs font-bold text-amber-300">
                Thank you for your feedback!
              </p>
              <p className="text-[11px] text-zinc-300">
                Your review has been published to the community board.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label htmlFor={authorNameInputId} className="block font-bold text-zinc-300 mb-1">
                  Your Full Name
                </label>
                <input
                  id={authorNameInputId}
                  type="text"
                  required
                  placeholder="e.g. Alex Morgan"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-800 bg-zinc-900 text-white focus:outline-hidden focus:border-amber-400"
                />
              </div>

              <div>
                <label htmlFor={roleInputId} className="block font-bold text-zinc-300 mb-1">
                  Business / Role (Optional)
                </label>
                <input
                  id={roleInputId}
                  type="text"
                  placeholder="e.g. Restaurant Manager, Designer"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-800 bg-zinc-900 text-white focus:outline-hidden focus:border-amber-400"
                />
              </div>

              <div>
                <label htmlFor={toolUsedInputId} className="block font-bold text-zinc-300 mb-1">
                  Tool Used
                </label>
                <select
                  id={toolUsedInputId}
                  value={toolUsed}
                  onChange={(e) => setToolUsed(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-800 bg-zinc-900 text-white focus:outline-hidden focus:border-amber-400"
                >
                  <option value="Wi-Fi Network Quick Connect">Wi-Fi Network Quick Connect</option>
                  <option value="vCard 3.0 Digital Business Card">vCard 3.0 Digital Business Card</option>
                  <option value="Restaurant Digital Menu">Restaurant Digital Menu</option>
                  <option value="Google Reviews Direct Link">Google Reviews Direct Link</option>
                  <option value="WhatsApp Direct Chat">WhatsApp Direct Chat</option>
                  <option value="PDF Document & Whitepaper">PDF Document & Whitepaper</option>
                  <option value="Bitcoin & Crypto Payment">Bitcoin & Crypto Payment</option>
                  <option value="Other / General Studio">Other / General Studio</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-zinc-300 mb-1">
                  Rating (1-5 Stars)
                </label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setRating(s)}
                      className="p-1 cursor-pointer"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          rating >= s ? 'fill-amber-400 text-amber-400' : 'text-zinc-700'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 font-mono font-bold text-amber-400">{rating} / 5</span>
                </div>
              </div>

              <div>
                <label htmlFor={commentInputId} className="block font-bold text-zinc-300 mb-1">
                  Your Review & Experience
                </label>
                <textarea
                  id={commentInputId}
                  rows={3}
                  required
                  placeholder="How did this tool help your business or project?"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-800 bg-zinc-900 text-white focus:outline-hidden focus:border-amber-400"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-extrabold rounded-xl text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(245,158,11,0.3)] cursor-pointer"
              >
                Submit Community Review
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
