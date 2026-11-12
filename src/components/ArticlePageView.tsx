import React, { useState, useEffect } from 'react';
import { BlogArticle } from '../types/blog';
import { BLOG_ARTICLES } from '../data/blogArticles';
import { ArrowLeft, Share2, Check, Printer, Clock, User, ChevronRight, Bookmark, ArrowRight, ShieldCheck, CheckCircle2, AlertTriangle, Lightbulb } from 'lucide-react';
import { DOMAIN } from '../utils/sitemapGenerator';
import { BlogDataGraphic } from './BlogDataGraphic';

interface ArticlePageViewProps {
  article: BlogArticle;
  onBackToBlog: () => void;
  onSelectArticle: (slug: string) => void;
  onNavigateToDirectory: () => void;
  onOpenQuote?: (prefilledInterest?: string) => void;
}

export const ArticlePageView: React.FC<ArticlePageViewProps> = ({
  article,
  onBackToBlog,
  onSelectArticle,
  onNavigateToDirectory,
  onOpenQuote,
}) => {
  const [copied, setCopied] = useState(false);

  // Schema.org Article / BlogPosting structured data injection
  useEffect(() => {
    const articleUrl = `${DOMAIN}/blog/${article.slug}`;
    const schemaData = {
      '@context': 'https://schema.org',
      '@type': 'TechArticle',
      'headline': article.title,
      'description': article.excerpt,
      'image': `${DOMAIN}/og-image.jpg`,
      'datePublished': '2026-11-09T08:00:00+00:00',
      'dateModified': '2026-11-09T08:00:00+00:00',
      'author': {
        '@type': 'Person',
        'name': article.author.name,
        'jobTitle': article.author.role,
      },
      'publisher': {
        '@type': 'Organization',
        'name': 'KoldSpec',
        'url': DOMAIN,
        'logo': {
          '@type': 'ImageObject',
          'url': `${DOMAIN}/og-image.jpg`,
        },
      },
      'mainEntityOfPage': {
        '@type': 'WebPage',
        '@id': articleUrl,
      },
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'article-structured-data';
    script.text = JSON.stringify(schemaData);
    document.head.appendChild(script);

    return () => {
      const existing = document.getElementById('article-structured-data');
      if (existing) existing.remove();
    };
  }, [article]);

  const handleShare = () => {
    const url = `${DOMAIN}/blog/${article.slug}`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  // Ensure top of page is visible when article opens
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [article.slug]);

  const relatedArticles = BLOG_ARTICLES.filter((a) => a.slug !== article.slug).slice(0, 2);

  return (
    <div
      className="w-full max-w-[800px] mx-auto space-y-8 pb-16"
      style={{ maxWidth: '800px', margin: '0 auto' }}
    >
      {/* Top Breadcrumb & Share/Print Bar */}
      <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <button
          type="button"
          onClick={onBackToBlog}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to All Guides</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer shadow-2xs"
            title="Copy shareable link"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-bold">Link Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-slate-500" />
                <span>Share Guide</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="p-1.5 text-slate-500 hover:text-slate-800 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
            title="Print Guide"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 1. Article Title / Header at the Top */}
      <header className="w-full space-y-4">
        {/* Zero-Pill Unboxed Metadata */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 font-medium">
          <span className="text-blue-700 font-semibold">{article.category}</span>
          <span aria-hidden="true">·</span>
          <span>{article.publishDate}</span>
          <span aria-hidden="true">·</span>
          <span>{article.readTime}</span>
          <span aria-hidden="true">·</span>
          <span>AHRI Standard 810 Reference</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight text-balance">
          {article.title}
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
          {article.subtitle}
        </p>

        {/* Author Byline */}
        <div className="pt-2 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
            {article.author.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900">{article.author.name}</div>
            <div className="text-[11px] text-slate-500">{article.author.role}</div>
          </div>
        </div>
      </header>

      {/* 2. Data Chart / Visualization directly below the title, spanning the full width */}
      <div className="w-full">
        <BlogDataGraphic article={article} variant="full" />
      </div>

      {/* 3. Article text below the chart, in the single centered column (max-width: 800px) */}
      <div className="w-full space-y-10">
        {/* Quick Jump Table of Contents */}
        <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-3">
          <div className="font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-2">
            <span>Table of Contents</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {article.sections.map((section, idx) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="text-slate-600 hover:text-blue-700 hover:underline flex items-start gap-1.5 transition-colors cursor-pointer"
              >
                <span className="font-mono text-slate-400 shrink-0">{String(idx + 1).padStart(2, '0')}.</span>
                <span className="truncate">{section.heading.replace(/^[0-9.]+\s*/, '')}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Main Body Content Sections */}
        <div className="space-y-12 text-slate-800 text-base leading-relaxed divide-y divide-slate-100">
          {article.sections.map((section) => (
            <section key={section.id} id={section.id} className="pt-8 space-y-5 scroll-mt-24">
              <div className="space-y-1">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  {section.heading}
                </h2>
                {section.subheading && (
                  <p className="text-xs sm:text-sm font-medium text-slate-500">
                    {section.subheading}
                  </p>
                )}
              </div>

              {/* Paragraphs */}
              <div className="space-y-4 text-slate-700 leading-relaxed font-normal">
                {section.paragraphs.map((p, pIdx) => (
                  <p key={pIdx}>{p}</p>
                ))}
              </div>

              {/* Structured Sizing Table */}
              {section.table && (
                <div className="my-6 space-y-2">
                  <div className="overflow-x-auto border border-slate-200 rounded-xl bg-white shadow-2xs">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-slate-100/80 text-slate-700 font-semibold text-[11px] border-b border-slate-200 uppercase tracking-wider">
                        <tr>
                          {section.table.headers.map((h, hIdx) => (
                            <th key={hIdx} className="px-4 py-3">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {section.table.rows.map((row, rIdx) => (
                          <tr key={rIdx} className="hover:bg-slate-50/70 transition-colors">
                            {row.map((cell, cIdx) => (
                              <td
                                key={cIdx}
                                className={`px-4 py-3 ${
                                  cIdx === 0
                                    ? 'font-medium text-slate-900'
                                    : cIdx === 2
                                    ? 'font-mono text-slate-600'
                                    : 'text-slate-700'
                                }`}
                              >
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {section.table.caption && (
                    <p className="text-[11px] text-slate-400 italic">
                      Source: {section.table.caption}
                    </p>
                  )}
                </div>
              )}

              {/* Technical Callout Card */}
              {section.callout && (
                <div
                  className={`p-4 rounded-xl border flex items-start gap-3 my-5 ${
                    section.callout.type === 'warning'
                      ? 'bg-amber-50/60 border-amber-200 text-amber-900'
                      : section.callout.type === 'tip'
                      ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900'
                      : 'bg-blue-50/60 border-blue-200 text-blue-900'
                  }`}
                >
                  {section.callout.type === 'warning' ? (
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  ) : section.callout.type === 'tip' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <Lightbulb className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-1">
                    <div className="text-xs font-bold">{section.callout.title}</div>
                    <div className="text-xs opacity-90 leading-relaxed">
                      {section.callout.text}
                    </div>
                  </div>
                </div>
              )}

              {/* Key Takeaways Checklist */}
              {section.keyTakeaways && (
                <div className="p-6 bg-slate-900 text-white rounded-2xl space-y-4 my-6 shadow-sm">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Key Procurement Takeaways</span>
                  </div>
                  <ul className="space-y-2.5 text-xs text-slate-200">
                    {section.keyTakeaways.map((item, tIdx) => (
                      <li key={tIdx} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          ))}
        </div>

        {/* Interactive Directory Search & Contact Us / Quote CTA Banner */}
        <div className="p-6 sm:p-8 bg-slate-900 text-white rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 my-10 shadow-md">
          <div className="space-y-1.5 max-w-xl">
            <div className="text-xs font-bold uppercase tracking-wider text-blue-400">
              Commercial Equipment Advisory
            </div>
            <h3 className="text-xl font-extrabold text-white">
              Have Questions or Need a Custom Sizing Audit?
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Use our Contact Us form to consult with our commercial equipment engineers. Receive customized sizing recommendations, itemized wholesale pricing, and logistics quotes for your restaurant or cafe.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {onOpenQuote && (
              <button
                type="button"
                onClick={() => onOpenQuote(article.title)}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-colors whitespace-nowrap shadow-xs cursor-pointer active:scale-[0.99]"
              >
                Contact Us for Sizing & Quotes
              </button>
            )}
            <button
              type="button"
              onClick={onNavigateToDirectory}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors whitespace-nowrap cursor-pointer"
            >
              Browse All 651 Models
            </button>
          </div>
        </div>

        {/* Related Articles Section */}
        {relatedArticles.length > 0 && (
          <div className="pt-8 border-t border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Related Technical Guides
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {relatedArticles.map((rel) => (
                <div
                  key={rel.slug}
                  onClick={() => onSelectArticle(rel.slug)}
                  className="p-4 bg-white rounded-xl border border-slate-200 hover:border-slate-300 transition-all cursor-pointer space-y-2 group shadow-2xs"
                >
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                    <span className="text-blue-700 font-semibold">{rel.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{rel.readTime}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors leading-snug">
                    {rel.title}
                  </h4>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {rel.excerpt}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
