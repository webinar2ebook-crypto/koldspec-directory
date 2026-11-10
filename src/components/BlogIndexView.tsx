import React, { useState, useMemo } from 'react';
import { BlogArticle } from '../types/blog';
import { BLOG_ARTICLES } from '../data/blogArticles';
import { Search, Clock, ArrowRight, BookOpen, ShieldCheck, Sparkles, Filter } from 'lucide-react';

interface BlogIndexViewProps {
  onSelectArticle: (slug: string) => void;
  onNavigateToDirectory: () => void;
}

export const BlogIndexView: React.FC<BlogIndexViewProps> = ({
  onSelectArticle,
  onNavigateToDirectory,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['All', 'Buying Guides', 'Energy Efficiency', 'Equipment Standards'];

  const filteredArticles = useMemo(() => {
    return BLOG_ARTICLES.filter((article) => {
      const matchCategory = selectedCategory === 'All' || article.category === selectedCategory;
      const matchSearch =
        searchQuery.trim() === '' ||
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCategory && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  const featuredArticle = BLOG_ARTICLES[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Blog Hero Section */}
      <div className="border-b border-slate-200 pb-8">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-blue-600 mb-2">
            <span>Knowledge Base & Engineering Guides</span>
            <span aria-hidden="true">·</span>
            <span>Independent Equipment Advisory</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Commercial Ice Equipment Guides & Insights
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
            Engineering benchmarks, sizing formulas, AHRI 810 test interpretations, and procurement guidance written for foodservice directors, facility engineers, and commercial kitchen operators.
          </p>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="mt-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Interactive Category Segmented Control */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg overflow-x-auto max-w-full">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-white text-slate-900 font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search guides, sizing formulas..."
              className="w-full pl-9 pr-3.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 placeholder:text-slate-400 text-slate-800"
            />
          </div>
        </div>
      </div>

      {/* Featured Lead Guide (Hero Card) */}
      {selectedCategory === 'All' && searchQuery === '' && featuredArticle && (
        <article className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:border-slate-300 transition-all duration-200 group">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-stretch">
            <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
              <div>
                {/* Zero-Pill Unboxed Metadata */}
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-3 font-medium">
                  <span className="text-blue-700 font-semibold">{featuredArticle.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>Featured Engineering Guide</span>
                  <span aria-hidden="true">·</span>
                  <span>{featuredArticle.readTime}</span>
                  <span aria-hidden="true">·</span>
                  <span>{featuredArticle.publishDate}</span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight group-hover:text-blue-700 transition-colors">
                  <button
                    onClick={() => onSelectArticle(featuredArticle.slug)}
                    className="text-left cursor-pointer focus:outline-none focus:underline"
                  >
                    {featuredArticle.title}
                  </button>
                </h2>

                <p className="mt-4 text-sm text-slate-600 leading-relaxed">
                  {featuredArticle.excerpt}
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                    MV
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-900">{featuredArticle.author.name}</div>
                    <div className="text-[11px] text-slate-500">{featuredArticle.author.role}</div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectArticle(featuredArticle.slug)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
                >
                  <span>Read Complete Guide</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 relative min-h-[260px] lg:min-h-full bg-slate-900 overflow-hidden">
              <img
                src={featuredArticle.heroImage}
                alt={featuredArticle.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent lg:hidden" />
            </div>
          </div>
        </article>
      )}

      {/* Articles Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">
            {selectedCategory === 'All' ? 'All Practical Guides & Articles' : `${selectedCategory} Articles`}
          </h3>
          <span className="text-xs text-slate-500 font-mono">
            {filteredMachinesMessage(filteredArticles.length)}
          </span>
        </div>

        {filteredArticles.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-3">
            <BookOpen className="w-8 h-8 text-slate-400 mx-auto" />
            <h4 className="text-sm font-bold text-slate-900">No articles match your search</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try clearing your search query or switching to another category.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="px-3.5 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => (
              <article
                key={article.slug}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:border-slate-300 hover:shadow-sm transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  <div className="aspect-video w-full relative bg-slate-100 overflow-hidden">
                    <img
                      src={article.heroImage}
                      alt={article.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-300"
                    />
                  </div>

                  <div className="p-5 space-y-2.5">
                    {/* Zero-Pill Unboxed Metadata */}
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                      <span className="text-blue-700 font-semibold">{article.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>{article.readTime}</span>
                      <span aria-hidden="true">·</span>
                      <span>{article.publishDate}</span>
                    </div>

                    <h4 className="text-base font-bold text-slate-900 leading-snug group-hover:text-blue-700 transition-colors">
                      <button
                        onClick={() => onSelectArticle(article.slug)}
                        className="text-left cursor-pointer focus:outline-none focus:underline"
                      >
                        {article.title}
                      </button>
                    </h4>

                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {article.excerpt}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-900 truncate max-w-[170px]">
                      {article.author.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => onSelectArticle(article.slug)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
                    >
                      <span>Read Guide</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Directory Adjacency Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="max-w-xl space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-400">
            <ShieldCheck className="w-4 h-4 text-blue-400" />
            <span>KoldSpec Commercial Equipment Directory</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
            Ready to compare tested machine models?
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Filter through all 651 AHRI 810 certified commercial ice machines by brand, harvest rate, kilowatt-hour efficiency, and potable water usage.
          </p>
        </div>

        <button
          type="button"
          onClick={onNavigateToDirectory}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-colors whitespace-nowrap shadow-xs cursor-pointer"
        >
          Explore 651 Machine Models
        </button>
      </div>
    </div>
  );
};

function filteredMachinesMessage(count: number): string {
  if (count === 1) return '1 article available';
  return `${count} articles available`;
}
