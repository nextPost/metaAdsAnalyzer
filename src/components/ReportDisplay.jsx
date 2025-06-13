import React from 'react';
import { ExternalLink } from 'lucide-react';
import SectionStep from './SectionStep';

const ReportDisplay = ({ reportUrl, brandName }) => {
  // Convert preview URL to view URL
  const viewUrl = reportUrl ? reportUrl.replace('/preview', '/view') : null;

  return (
    <div className="">
      <div className="relative">
        {/* Main content */}
        <div className="text-slate-200 font-sans">
          <SectionStep step={3} totalSteps={3} title="Get Report" progressPercent="100%" />
          {/* Header Section */}
          <div className="mb-6 text-center">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-2">Your Presentation is Ready!</h2>
            <p className="text-slate-400 text-sm md:text-base">
              Your comprehensive Meta Ads competitive analysis for <span className="font-semibold text-white">{brandName}</span> is ready. Access your full Google Slides report below with strategic insights and actionable recommendations.
            </p>
          </div>

          {/* Iframe for the report */}
          {reportUrl ? (
            <div className="mb-6 aspect-video rounded-lg overflow-hidden">
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
              href={viewUrl}
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
      </div>
    </div>
  );
};

export default ReportDisplay; 