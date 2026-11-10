import React, { useEffect, useState } from 'react';
import { ArrowLeft, CheckCircle2, ShieldCheck, Clock, FileText, Phone, Mail, Building2, HelpCircle } from 'lucide-react';

interface QuotePageViewProps {
  onBackToDirectory: () => void;
  prefilledMachine?: string;
}

export const QuotePageView: React.FC<QuotePageViewProps> = ({
  onBackToDirectory,
  prefilledMachine = '',
}) => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    // Check if user returned from Formspree redirect
    if (typeof window !== 'undefined' && window.location.search.includes('submitted=true')) {
      setIsSubmitted(true);
    }
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Breadcrumb Navigation */}
      <div className="border-b border-slate-200 pb-4">
        <button
          type="button"
          onClick={onBackToDirectory}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Directory Catalog</span>
        </button>
      </div>

      {/* Success Notification if redirected from Formspree */}
      {isSubmitted && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3 text-xs text-emerald-900">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-sm text-emerald-950">
              Quote Request Submitted Successfully!
            </h3>
            <p className="mt-0.5 text-emerald-800 leading-relaxed">
              Thank you for reaching out. Your request has been transmitted directly to our equipment team via Formspree. An equipment specialist will review your specifications and contact you shortly.
            </p>
          </div>
        </div>
      )}

      {/* Page Title & Intro */}
      <div className="max-w-2xl">
        <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-blue-600 mb-2">
          <span>B2B Commercial Equipment Procurement</span>
          <span aria-hidden="true">·</span>
          <span>AHRI Standard 810</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Get a Commercial Quote
        </h1>
        <p className="mt-3 text-sm text-slate-600 leading-relaxed">
          Request wholesale pricing, freight estimates, and delivery lead times across all 651 ENERGY STAR® certified commercial ice makers. Direct dealer routing with zero sales pressure.
        </p>
      </div>

      {/* Two Column Layout: Simple HTML Form + Trust Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Direct Formspree Form */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs">
          <h2 className="text-base font-bold text-slate-900 mb-1">
            Quote Inquiry Form
          </h2>
          <p className="text-xs text-slate-500 mb-6">
            Fill out the details below. This form submits directly to our Formspree inbox.
          </p>

          {/* Native HTML Form Submitting Directly to Formspree Endpoint */}
          <form
            action="https://formspree.io/f/myeerwpl"
            method="POST"
            className="space-y-4"
          >
            {/* Hidden Formspree Subject */}
            <input
              type="hidden"
              name="_subject"
              value="New Commercial Ice Machine Quote Request - KoldSpec"
            />

            {/* Which machine are you interested in */}
            <div className="space-y-1">
              <label
                htmlFor="field-machine"
                className="block text-xs font-bold text-slate-800"
              >
                Which machine are you interested in? <span className="text-red-500">*</span>
              </label>
              <input
                id="field-machine"
                type="text"
                name="machine_of_interest"
                required
                defaultValue={prefilledMachine}
                placeholder="e.g. Hoshizaki KM-1900SAJ3, Scotsman Prodigy Plus, or 500 lb Nugget Maker..."
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900 font-medium transition-colors"
              />
              <span className="text-[11px] text-slate-400 block">
                Specify a brand, model number, or daily harvest capacity (e.g., 500 lbs/day cube ice).
              </span>
            </div>

            {/* Full Name */}
            <div className="space-y-1">
              <label
                htmlFor="field-name"
                className="block text-xs font-bold text-slate-800"
              >
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                id="field-name"
                type="text"
                name="name"
                required
                placeholder="e.g. Chef Sarah Jenkins"
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900 transition-colors"
              />
            </div>

            {/* Contact Grid: Email & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label
                  htmlFor="field-email"
                  className="block text-xs font-bold text-slate-800"
                >
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  id="field-email"
                  type="email"
                  name="_replyto"
                  required
                  placeholder="sarah@bistrokitchens.com"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900 transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="field-phone"
                  className="block text-xs font-bold text-slate-800"
                >
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  id="field-phone"
                  type="tel"
                  name="phone"
                  required
                  placeholder="(555) 234-5678"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900 transition-colors"
                />
              </div>
            </div>

            {/* Restaurant / Facility Name */}
            <div className="space-y-1">
              <label
                htmlFor="field-company"
                className="block text-xs font-bold text-slate-800"
              >
                Restaurant / Business Name (Optional)
              </label>
              <input
                id="field-company"
                type="text"
                name="company"
                placeholder="e.g. Hudson Valley Hospitality LLC"
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900 transition-colors"
              />
            </div>

            {/* Target Timeline */}
            <div className="space-y-1">
              <label
                htmlFor="field-timeline"
                className="block text-xs font-bold text-slate-800"
              >
                Target Timeline
              </label>
              <select
                id="field-timeline"
                name="timeline"
                defaultValue="Within 30 Days"
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 font-medium transition-colors cursor-pointer"
              >
                <option value="Immediate Replacement (Down Equipment)">Immediate Replacement (Down Equipment)</option>
                <option value="Within 30 Days">Within 30 Days (Upcoming Opening/Remodel)</option>
                <option value="1 - 3 Months">1 – 3 Months (Capital Planning)</option>
                <option value="Budgetary Pricing">Budgetary / Exploratory</option>
              </select>
            </div>

            {/* Notes / Special Requirements */}
            <div className="space-y-1">
              <label
                htmlFor="field-message"
                className="block text-xs font-bold text-slate-800"
              >
                Project Notes or Special Requirements (Optional)
              </label>
              <textarea
                id="field-message"
                name="message"
                rows={3}
                placeholder="e.g., Need 115V single phase, rooftop remote condenser line set, or matching ice storage bin..."
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900 transition-colors resize-none"
              />
            </div>

            {/* Direct Form Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-xs transition-colors text-center cursor-pointer active:scale-[0.99] flex items-center justify-center gap-2"
              >
                <FileText className="w-4 h-4" />
                <span>Submit Quote Request</span>
              </button>
            </div>

            <p className="text-[11px] text-slate-400 text-center pt-1">
              Protected by Formspree · Submits directly to our secure inbox.
            </p>
          </form>
        </div>

        {/* Right Column: Information & Trust Cards */}
        <div className="lg:col-span-5 space-y-5">
          {/* Response Promise Card */}
          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-wider">
              <Clock className="w-4 h-4 text-blue-600" />
              <span>What Happens Next?</span>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-600">
              <li className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 font-mono font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  1
                </span>
                <span>
                  <strong>Formspree Notification:</strong> Your inquiry is received instantly by our commercial equipment desk.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 font-mono font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  2
                </span>
                <span>
                  <strong>Specification Verification:</strong> We check inventory, freight logistics, and voltage/electrical compatibility.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 font-mono font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  3
                </span>
                <span>
                  <strong>Formal Quote Delivery:</strong> You receive an itemized quote with factory warranty and delivery timeframe.
                </span>
              </li>
            </ul>
          </div>

          {/* Independent Database Trust Card */}
          <div className="p-5 bg-slate-100/80 rounded-2xl border border-slate-200 text-xs space-y-3">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Independent Directory Advantage</span>
            </div>
            <p className="text-slate-600 leading-relaxed text-xs">
              Unlike single-brand equipment dealers, KoldSpec indexes 651 commercial models across all top manufacturers: Hoshizaki, Scotsman, Manitowoc, Ice-O-Matic, Follett, and ICETRO.
            </p>
            <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-[11px] text-slate-500 font-mono">
              <span>AHRI 810/820 Verified</span>
              <span>ENERGY STAR® Data</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
