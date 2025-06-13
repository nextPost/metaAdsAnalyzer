import React, { useState, useEffect, useRef } from 'react';
import BrandLeaderboard from './components/BrandSelector';
import ReportOverview from './components/ReportOverview';
import Header from './components/Header';

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
    <div className="bg-[#0a1419] text-white min-h-screen">
      <Header />
      <main className="container mx-auto px-1 sm:px-4 py-8">
        <div className="flex flex-col items-center w-full">
          {!selectedBrand && (
            <div className="text-center mb-8 sm:mb-12 px-1 sm:px-4">
              <h2 className="text-[#ff6b45] text-sm uppercase tracking-wider mb-2">Antelope Analytics</h2>
              <h1 className="text-2xl sm:text-3xl font-bold mb-4">Meta Ads Analyzer</h1>
              <p className="text-gray-400 max-w-2xl mx-auto">Select a brand from the leaderboard below to begin your Meta Ads analysis.</p>
            </div>
          )}

          <div className="w-full max-w-[960px] px-2 sm:px-4">
            <div className="bg-[#0f1e25] rounded-lg border border-gray-800 w-full max-w-full">
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
            </div>
          </div>
          
          <footer className="text-center py-8 mt-8 text-slate-500 text-sm"></footer>
          
        </div>
      </main>
    </div>
  );
}

export default App; 