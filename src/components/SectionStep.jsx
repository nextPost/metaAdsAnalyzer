import React from 'react';

const SectionStep = ({ step, totalSteps, title, progressPercent, children }) => {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold text-slate-100 flex items-center">
          <span className="mr-2">Step {step}:</span> {title}
        </h2>
        <div className="flex items-center text-xs font-semibold">
          <span className="bg-[#ff6b45] text-white w-5 h-5 rounded-full flex items-center justify-center mr-1.5 text-sm">{step}</span>
          <span className="text-slate-300"><span className="opacity-75 text-slate-400">of</span> {totalSteps}</span>
        </div>
      </div>
      <div className="w-full bg-slate-700 rounded-full h-1.5">
        <div className="bg-[#ff6b45] h-1.5 rounded-full" style={{ width: progressPercent }}></div>
      </div>
      {children}
    </div>
  );
};

export default SectionStep; 