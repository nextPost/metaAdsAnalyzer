import React from 'react';
import { ExternalLink } from 'lucide-react';

const ReportDisplay = ({ reportUrl, brandName }) => {
  return (
    <div className="bg-slate-900 p-4 md:p-6 rounded-xl shadow-2xl text-slate-200 font-sans">
      {/* Step Indicator Header (NEW) */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold text-slate-100">Your Report</h2>
          <div className="flex items-center text-xs font-semibold">
            <span className="bg-[#FF6B45] text-white w-5 h-5 rounded-full flex items-center justify-center mr-1.5 text-sm">3</span>
            <span className="text-slate-300"><span className="opacity-75 text-slate-400">of</span> 3</span>
          </div>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-1.5"><div className="bg-[#FF6B45] h-1.5 rounded-full" style={{ width: '100%' }}></div></div>
      </div>

      {/* Header Section */}
      <div className="mb-6 text-center">
        <h2 className="text-xl md:text-2xl font-bold text-white mb-2">Your Presentation is Ready!</h2>
        <p className="text-slate-400 text-sm md:text-base">
          Here is your free Meta Ads analysis for <span className="font-semibold text-white">{brandName}</span>. You can view and download it using the link below:
        </p>
      </div>

      {/* Iframe for the report */}
      {reportUrl ? (
        <div className="mb-6 aspect-video rounded-lg overflow-hidden border border-slate-700">
          <iframe
            src={reportUrl}
            width="100%"
            height="100%"
            frameBorder="0"
            allowFullScreen
            className="rounded-lg"
            title={`${brandName} Meta Ads Analysis`}
          ></iframe>
        </div>
      ) : (
        <div className="mb-6 p-8 bg-slate-800 rounded-lg text-center text-slate-400">
          No report URL available. Please try again.
        </div>
      )}

      {/* Open Presentation Button */}
      <div className="text-center">
        <a
          href={reportUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center bg-[#FF6B45] hover:bg-[#E05230] text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-150 text-base disabled:opacity-50 disabled:cursor-not-allowed"
          // Adding disabled styling if reportUrl is not available
        >
          <ExternalLink size={20} className="mr-2" />
          Open Presentation
        </a>
      </div>
    </div>
  );
};

export default ReportDisplay; 