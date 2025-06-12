import React, { useState, useEffect, useRef } from 'react';
import BrandLeaderboard from './components/BrandSelector';
import ReportOverview from './components/ReportOverview';

function App() {
  const [selectedBrand, setSelectedBrand] = useState(null);
  const reportOverviewRef = useRef(null);

  const handleSelectBrand = (brand) => {
    setSelectedBrand(brand);
    console.log("App.jsx: selectedBrand state set to:", brand);
  };

  const handleBackToSelection = () => {
    setSelectedBrand(null);
    console.log("App.jsx: selectedBrand state cleared.");
  };

  useEffect(() => {
    if (selectedBrand && reportOverviewRef.current) {
      reportOverviewRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [selectedBrand]);

  return (
    <div className="bg-slate-800 min-h-screen p-4 md:p-8 selection:bg-[#FF6B45] selection:text-white">
      <div className="max-w-4xl mx-auto">
        {!selectedBrand && (
          <header className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-white">Brand Analysis Platform</h1>
            <p className="text-slate-400">Select a brand from the leaderboard below to begin.</p>
          </header>
        )}

        <BrandLeaderboard onSelectBrand={handleSelectBrand} />

        {selectedBrand && (
          <div ref={reportOverviewRef} className="mt-8">
            <ReportOverview
              key={selectedBrand.id}
              selectedBrand={selectedBrand}
              onBackToSelection={handleBackToSelection}
            />
          </div>
        )}
        
        <footer className="text-center py-8 mt-8 text-slate-500 text-sm">
          Component Demo
        </footer>
      </div>
    </div>
  );
}

export default App; 