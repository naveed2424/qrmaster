import { useState } from 'react';
import { BookOpen, Calendar, Clock, User, ArrowLeft, Share2, Tag, Check, Sparkles } from 'lucide-react';
import { BlogPost } from '../types/qr';
import { BLOG_POSTS } from '../data/blogPosts';

export default function BlogSection() {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  if (selectedPost) {
    return (
      <div className="max-w-4xl mx-auto py-10 px-4 space-y-8">
        <button
          onClick={() => setSelectedPost(null)}
          className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 hover:text-yellow-300 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Articles</span>
        </button>

        <article className="bg-zinc-950/90 border border-amber-500/25 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6 backdrop-blur-xl">
          <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400 font-medium">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              {selectedPost.date}
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              {selectedPost.readTime}
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-amber-400" />
              {selectedPost.author}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            <span className="text-gold-gradient">{selectedPost.title}</span>
          </h1>

          <div className="flex flex-wrap gap-1.5 pt-1 pb-4 border-b border-zinc-800">
            {selectedPost.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 text-xs font-semibold rounded-md bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1"
              >
                <Tag className="w-3 h-3 text-amber-400" />
                {tag}
              </span>
            ))}
          </div>

          <div className="space-y-4 text-sm sm:text-base leading-relaxed text-zinc-300">
            {selectedPost.content.split('\n\n').map((paragraph, idx) => {
              if (paragraph.startsWith('### ')) {
                return (
                  <h3 key={idx} className="text-xl font-bold text-amber-300 pt-4">
                    {paragraph.replace('### ', '')}
                  </h3>
                );
              }
              if (paragraph.startsWith('#### ')) {
                return (
                  <h4 key={idx} className="text-base font-bold text-white pt-2">
                    {paragraph.replace('#### ', '')}
                  </h4>
                );
              }
              if (paragraph.startsWith('- ')) {
                const items = paragraph.split('\n- ');
                return (
                  <ul key={idx} className="list-disc pl-5 space-y-1.5 text-sm text-zinc-300">
                    {items.map((item, itemIdx) => (
                      <li key={itemIdx}>{item.replace(/^- /, '')}</li>
                    ))}
                  </ul>
                );
              }
              return (
                <p key={idx} className="text-zinc-300 leading-relaxed text-sm sm:text-base">
                  {paragraph}
                </p>
              );
            })}
          </div>

          <div className="pt-8 border-t border-zinc-800 flex items-center justify-between">
            <button
              onClick={() => setSelectedPost(null)}
              className="text-xs font-bold text-zinc-400 hover:text-amber-400 transition-colors cursor-pointer"
            >
              &larr; Return to Blog Catalog
            </button>
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-extrabold rounded-xl text-xs transition-all shadow-[0_0_15px_rgba(245,158,11,0.3)] cursor-pointer"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Link Copied!' : 'Share Article'}</span>
            </button>
          </div>
        </article>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-amber-400 uppercase tracking-wider">
          <BookOpen className="w-4 h-4" />
          <span>Knowledge & Customization Guides</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          Latest Updates, Guides & <span className="text-gold-gradient">Customization Tips</span>
        </h2>
        <p className="text-sm text-zinc-400 leading-relaxed">
          Master physical print conversions, Reed-Solomon error correction mathematics, and strategies to profit from QR codes in 2026.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {BLOG_POSTS.map((post) => (
          <article
            key={post.id}
            onClick={() => setSelectedPost(post)}
            className="p-6 sm:p-8 bg-zinc-950/90 border border-zinc-800/80 hover:border-amber-500/50 rounded-3xl hover:shadow-[0_4px_30px_rgba(245,158,11,0.2)] transition-all cursor-pointer flex flex-col justify-between group backdrop-blur-md"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-xs text-amber-400/80 font-mono">
                <span>{post.date}</span>
                <span>·</span>
                <span>{post.readTime}</span>
              </div>

              <h3 className="text-xl font-bold text-white group-hover:text-amber-300 transition-colors leading-snug">
                {post.title}
              </h3>

              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed line-clamp-3">
                {post.excerpt}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center justify-between">
              <div className="flex flex-wrap gap-1">
                {post.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 text-[11px] font-bold rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <span className="text-xs font-bold text-amber-400 group-hover:text-yellow-300 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                Read Article &rarr;
              </span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
