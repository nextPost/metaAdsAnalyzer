import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Search as SearchIcon, ChevronDown, Users, Info, CheckCircle, MessageSquare, ArrowUpDown, ArrowUp, ArrowDown, ChevronRight, XCircle, ChevronLeft as ChevronLeftIcon, FileText, SlidersHorizontal, Megaphone } from 'lucide-react';
import SectionStep from './SectionStep';

// --- API Endpoint ---
const API_ENDPOINT = "https://api.antelopeinc.com/chatbots/adsStrategyAnalyzer_testing?origin=slides&action=getSamples&handle=all&libID=999";

// --- Helper function to parse numbers from API strings (e.g., "7.98m+", "63") ---
const parseNumberString = (numStr) => {
  if (!numStr) return 0;
  numStr = String(numStr).toLowerCase().replace(/,/g, ''); // Ensure it's a string and remove commas

  if (numStr.endsWith('m+')) {
    return parseFloat(numStr) * 1000000;
  }
  if (numStr.endsWith('k+')) {
    return parseFloat(numStr) * 1000;
  }
  return parseFloat(numStr);
};

// --- Helper to format large numbers into K (thousands) or M (millions) ---
// (Keeping this for consistency if we re-format the API's 'followers'/'ads' strings for display)
const formatNumber = (num) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(0) + 'K';
  return num.toString();
};

// StatBar component displays a progress-like bar for metrics.
// It visualizes a value relative to a maximum value. (Primarily for Desktop)
const StatBar = ({ value, maxValue, barColorClass = "bg-[#FF6B45]", heightClass = "h-1" }) => {
  const widthPercentage = maxValue > 0 ? Math.min((value / maxValue) * 100, 100) : 0;
  return (
    <div className={`w-full bg-slate-600 rounded-full ${heightClass} mt-1.5 mb-1`}>
      <div className={`${barColorClass} ${heightClass} rounded-full transition-all duration-300 ease-out`}
        style={{ width: `${widthPercentage}%` }}
        aria-valuenow={value} aria-valuemin="0" aria-valuemax={maxValue} role="progressbar"></div>
    </div>
  );
};

// BrandRowDisplay component renders a single brand's information in a row.
// It adapts its layout for focused view (when a brand is selected for confirmation)
// and has distinct mobile and desktop layouts.
const BrandRowDisplay = ({ brand, maxFollowers, maxTotalAds, onSelect, isFocusedView = false }) => {
  return (
    <div
      className={`
        px-4 py-4
        ${isFocusedView ? 'bg-[#0f1e25] rounded-lg shadow-xl' : 'bg-[#172a33] hover:bg-[#0f1e25] border-b border-gray-800'}
        md:grid md:grid-cols-12 md:gap-x-4 md:items-center 
      `} // Desktop grid layout starts at md breakpoint
    >
      {/* --- Mobile Layout (Default: flex column) --- */}
      <div className="md:hidden flex flex-col">
        {/* Mobile Row 1: Brand Info (Left) & Stats (Right) */}
        <div className="flex justify-between items-start mb-2">
          {/* Brand Info (Logo, Name, Category) */}
          <div className="flex items-center flex-grow mr-2"> {/* Added flex-grow and mr-2 */}
            <img src={brand.logoUrl} alt={`${brand.name} logo`}
              className="w-10 h-10 rounded-full mr-3 object-cover flex-shrink-0"
              onError={(e) => { e.target.onerror = null; e.target.src=`https://placehold.co/40x40/7f1d1d/FFFFFF?text=ERR&font=Inter`; }}/>
            <div className="overflow-hidden"> {/* Added for text truncation */}
              <p className="text-sm font-medium text-white truncate" title={brand.name}>{brand.name}</p>
              <p className="text-xs text-slate-400 truncate">{brand.category}</p>
            </div>
          </div>
          {/* Stats (Followers, Total Ads) - Icon + Number Only */}
          <div className="flex flex-col items-end flex-shrink-0 text-xs"> {/* Aligned to end, smaller text */}
            <div className="flex items-center">
              <Users size={14} className="text-slate-400 mr-1 flex-shrink-0" />
              <span className="text-white font-semibold">{brand.followersFormatted}</span>
            </div>
            <div className="flex items-center mt-0.5"> {/* Reduced margin top */}
              <Megaphone size={14} className="text-slate-400 mr-1 flex-shrink-0" />
              <span className="text-white font-semibold">{brand.totalAdsFormatted}</span>
            </div>
          </div>
        </div>

        {/* Mobile Row 2: Description (Left) & Select Button (Right) */}
        {!isFocusedView && ( // Only show description/select if not in focused view
            <div className="flex items-start justify-between mt-1"> {/* items-start for alignment */}
                <p className="text-xs text-slate-300 leading-relaxed line-clamp-3 flex-grow mr-3" title={brand.description}>
                    {brand.description}
                </p>
                <button 
                    onClick={(e) => { e.stopPropagation(); onSelect(brand);}}
                    className="p-1.5 rounded-md text-[#FF6B45] hover:bg-[#FF6B45]/20 transition-colors flex-shrink-0 self-center" // Centered button vertically
                    aria-label={`Select ${brand.name}`} title={`Select ${brand.name}`}>
                    <ChevronRight size={20} />
                </button>
            </div>
        )}
        {isFocusedView && ( // If focused, just show description full width
             <p className="text-xs text-slate-300 leading-relaxed mt-2" title={brand.description}>
                {brand.description}
            </p>
        )}
      </div>

      {/* --- Desktop Layout (md:grid) --- */}
      {/* Column 1: Brand Info (Logo, Name, Category) - Desktop */}
      <div className="hidden md:flex items-center md:col-span-3">
        <img src={brand.logoUrl} alt={`${brand.name} logo`}
          className="w-10 h-10 rounded-full mr-3 object-cover flex-shrink-0"
          onError={(e) => { e.target.onerror = null; e.target.src=`https://placehold.co/40x40/7f1d1d/FFFFFF?text=ERR&font=Inter`; }}/>
        <div>
          <p className="text-sm font-medium text-white truncate" title={brand.name}>{brand.name}</p>
          <p className="text-xs text-slate-400 truncate">{brand.category}</p>
        </div>
      </div>

      {/* Column 2: Followers Metric - Desktop */}
      <div className="hidden md:block md:col-span-2">
        <div className="flex items-center">
          <Users size={14} className="text-slate-400 mr-1.5 lg:inline-flex flex-shrink-0" />
          <p className="text-sm text-white font-semibold">{brand.followersFormatted}</p>
        </div>
        <StatBar value={brand.followersRaw} maxValue={maxFollowers} barColorClass="bg-[#24AE8D]" />
      </div>

      {/* Column 3: Total Ads Metric - Desktop */}
      <div className="hidden md:block md:col-span-2">
        <div className="flex items-center">
          <Megaphone size={14} className="text-slate-400 mr-1.5 lg:inline-flex flex-shrink-0" />
          <p className="text-sm text-white font-semibold">{brand.totalAdsFormatted}</p>
        </div>
        <StatBar value={brand.totalAdsRaw} maxValue={maxTotalAds} barColorClass="bg-[#24AE8D]" />
      </div>

      {/* Column 4: Description - Desktop */}
      <div className="hidden md:block md:col-span-4">
        <p className={`text-xs text-slate-300 leading-relaxed ${!isFocusedView ? 'line-clamp-3' : ''}`} title={brand.description}>{brand.description}</p>
      </div>

      {/* Column 5: Select Action - Desktop */}
      <div className="hidden md:flex md:col-span-1 justify-end items-center">
        {!isFocusedView && (
        <button onClick={(e) => { e.stopPropagation(); onSelect(brand);}}
            className="p-1.5 rounded-md text-[#FF6B45] hover:bg-[#FF6B45]/20 transition-colors"
            aria-label={`Select ${brand.name}`} title={`Select ${brand.name}`}>
            <ChevronRight size={20} />
        </button>
        )}
      </div>
    </div>
  );
};

// BrandLeaderboard component is the main UI for displaying, searching, sorting, and selecting brands.
const BrandLeaderboard = ({ onSelectBrand }) => {
  // State for all brands fetched
  const [allBrands, setAllBrands] = useState([]);
  // State for the current search term
  const [searchTerm, setSearchTerm] = useState('');
  // State for the number of brands currently displayed in the list
  const [displayedBrandsCount, setDisplayedBrandsCount] = useState(10);
  // State to indicate if data is currently being loaded
  const [isLoading, setIsLoading] = useState(true);
  // State for the current sort key (e.g., 'name', 'followersRaw')
  const [sortKey, setSortKey] = useState('followersRaw');
  // State for the current sort direction ('asc' or 'desc')
  const [sortDirection, setSortDirection] = useState('desc');
  // State to hold the brand selected for confirmation before proceeding
  const [brandForConfirmation, setBrandForConfirmation] = useState(null);
  // State to manage the visibility of the mobile sort options dropdown
  const [isMobileSortOpen, setIsMobileSortOpen] = useState(false);
  // State for error handling
  const [error, setError] = useState(null);

  // Configuration for the sample brands carousel
  const SAMPLES_TO_SHOW_IN_CAROUSEL = 3;
  // State for the current index of the carousel
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0);
  // Ref for the carousel container to manage scroll/transform
  const carouselContainerRef = useRef(null);

  // Effect to fetch brand data from API on component mount
  useEffect(() => {
    const fetchBrands = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(API_ENDPOINT);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();

        if (result.success && Array.isArray(result.data)) {
          const transformedBrands = result.data.map(item => {
            const followersRaw = parseNumberString(item.followers);
            const totalAdsRaw = parseNumberString(item.ads);

            return {
              id: item.brand.replace(/\s+/g, '-').toLowerCase(),
              name: item.brand,
              logoUrl: item.pic,
              followersFormatted: item.followers,
              followersRaw: followersRaw,
              totalAdsFormatted: item.ads,
              totalAdsRaw: totalAdsRaw,
              description: item.description,
              category: item.category || 'N/A',
              quality: item.quality || 'N/A',
              handle: item.handle || item.brand.replace(/\s+/g, '').toLowerCase(),
            };
          });
          setAllBrands(transformedBrands);
        } else {
          throw new Error("API response was not successful or data format was unexpected.");
        }
      } catch (e) {
        console.error("Failed to fetch brand data:", e);
        setError("Failed to load brands. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBrands();
  }, []); // Empty dependency array means this runs once on mount

  // Memoized array of sample brands for the carousel: Filtered to 'Superb' quality
  const sampleBrands = useMemo(() => {
    // Filter all brands for those with 'Superb' quality
    const superbBrands = allBrands.filter(brand => brand.quality === 'Superb');
    // REMOVED: The slicing limit, so all superb brands will be included
    return superbBrands;
  }, [allBrands]);

  // Console log to see the content of sampleBrands after memoization
  // This will show you the exact array of brands that the carousel is trying to display.
  // console.log("Sample Brands for Carousel:", sampleBrands.map(b => ({ name: b.name, reportUrl: b.reportUrl, quality: b.quality })));

  // Memoized calculation of the total number of shifts/slides possible for single-item scrolling
  // This variable determines the maximum `currentCarouselIndex` value.
  const totalCarouselSlides = Math.max(0, sampleBrands.length - SAMPLES_TO_SHOW_IN_CAROUSEL + 1);

  // Handlers for carousel navigation (remains single-item scrolling as requested)
  const handleNextSample = () => setCurrentCarouselIndex(prev => Math.min(prev + 1, totalCarouselSlides -1));
  const handlePrevSample = () => setCurrentCarouselIndex(prev => Math.max(prev - 1, 0));
  const handleDotClick = (index) => setCurrentCarouselIndex(index);

  // Memoized array of brands after filtering by search term and sorting
  const sortedAndFilteredBrands = useMemo(() => {
    let brandsArray = [...allBrands];
    if (searchTerm) {
      const lowercasedFilter = searchTerm.toLowerCase();
      brandsArray = brandsArray.filter(brand =>
        brand.name.toLowerCase().includes(lowercasedFilter) ||
        brand.description.toLowerCase().includes(lowercasedFilter) || // Search in description too
        (brand.category && brand.category.toLowerCase().includes(lowercasedFilter)) // Search in category if it exists
      );
    }
    if (sortKey) {
      brandsArray.sort((a, b) => {
        const valA = a[sortKey];
        const valB = b[sortKey];
        let comparison = 0;
        if (typeof valA === 'string' && typeof valB === 'string') comparison = valA.localeCompare(valB);
        else if (typeof valA === 'number' && typeof valB === 'number') comparison = valA - valB;
        return sortDirection === 'asc' ? comparison : comparison * -1;
      });
    }
    return brandsArray;
  }, [allBrands, searchTerm, sortKey, sortDirection]);

  // Memoized array of brands to actually display based on displayedBrandsCount
  const brandsToShow = useMemo(() => sortedAndFilteredBrands.slice(0, displayedBrandsCount), [sortedAndFilteredBrands, displayedBrandsCount]);
  // Memoized maximum follower count for scaling stat bars
  const maxFollowers = useMemo(() => allBrands.length ? Math.max(...allBrands.map(b => b.followersRaw), 1) : 1, [allBrands]);
  // Memoized maximum total ads count for scaling stat bars
  const maxTotalAds = useMemo(() => allBrands.length ? Math.max(...allBrands.map(b => b.totalAdsRaw), 1) : 1, [allBrands]);

  // Handler for search input changes
  const handleSearchChange = (event) => { setSearchTerm(event.target.value); setDisplayedBrandsCount(10); /* Removed setBrandForConfirmation(null) here as samples should persist */ };
  // Handler for the "Load More" button
  const handleLoadMore = () => setDisplayedBrandsCount(prevCount => prevCount + 10);

  // Handler to initiate the brand selection process (sets brand for confirmation)
  const handleInitiateSelection = (brand) => setBrandForConfirmation(brand);

  // Handler to confirm the selected brand and proceed
  const handleConfirmSelection = () => {
    if (brandForConfirmation) {
      if (onSelectBrand) onSelectBrand(brandForConfirmation); // Callback to parent
      else console.log(`Brand confirmed: ${brandForConfirmation.name}. Further analysis module would be triggered here.`); // Fallback if no callback
    }
  };

  // Handler to change the selection (clears brand for confirmation)
  const handleChangeSelection = () => setBrandForConfirmation(null);

  // Handler for selecting a brand from the sample reports carousel
  const handleSampleSelect = (sampleBrand) => {
    // Instead of opening the report directly, we'll select the brand
    // This will trigger the normal flow through email validation
    if (onSelectBrand) {
      onSelectBrand(sampleBrand);
    }
  };

  // Handler for applying a sort option
  const handleSort = (key, direction) => {
    setSortKey(key);
    setSortDirection(direction);
    setDisplayedBrandsCount(10); 
    setIsMobileSortOpen(false); 
  };

  // Component to display the appropriate sort icon (up, down, or default) for desktop table headers
  const DesktopSortIcon = ({ columnKey }) => {
    if (sortKey !== columnKey) return <ArrowUpDown size={14} className="ml-1.5 text-slate-500" />;
    return sortDirection === 'asc' ? <ArrowUp size={14} className="ml-1.5 text-[#FF6B45]" /> : <ArrowDown size={14} className="ml-1.5 text-[#FF6B45]" />;
  };

  // Array of available sort options for both desktop and mobile
  const sortOptions = [
    { label: "Name (A-Z)", key: "name", direction: "asc" },
    { label: "Name (Z-A)", key: "name", direction: "desc" },
    { label: "Followers (High-Low)", key: "followersRaw", direction: "desc" },
    { label: "Followers (Low-High)", key: "followersRaw", direction: "asc" },
    { label: "Total Ads (High-Low)", key: "totalAdsRaw", direction: "desc" },
    { label: "Total Ads (Low-High)", key: "totalAdsRaw", direction: "asc" },
  ];

  // Function to get the human-readable label for the current sort option (for mobile display)
  const getCurrentSortLabel = () => {
    if (!sortKey) return "Default";
    const option = sortOptions.find(opt => opt.key === sortKey && opt.direction === sortDirection);
    return option ? option.label : "Default";
  };

  // Loading and Error state display
  if (isLoading) {
    return (
      <div className="bg-[#0a1419] p-6 rounded-xl shadow-2xl text-center text-slate-300 min-h-[400px] flex items-center justify-center">
        Loading brands...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#0a1419] p-6 rounded-xl shadow-2xl text-center text-red-400 min-h-[400px] flex items-center justify-center">
        Error: {error}
      </div>
    );
  }

  // If no brands are loaded after fetching (e.g., empty data from API)
  if (!allBrands.length && !isLoading && !error) {
    return (
      <div className="bg-[#0a1419] p-6 rounded-xl shadow-2xl text-center text-slate-400 min-h-[400px] flex items-center justify-center">
        No brands found.
      </div>
    );
  }

  return (
    <div className="w-full max-w-[960px] mx-auto px-2 sm:px-4">
      <div className="relative">
        {/* Main content */}
        <div className="p-4 md:p-6 text-slate-200 font-sans">
          <SectionStep step={1} totalSteps={3} title="Search Brands" progressPercent="33.33%">
            <div>
              <div className="mb-6 pt-4">
                <h2 className="text-2xl font-semibold text-white mb-1 text-center">Meta Ads Analysis</h2>
                {!brandForConfirmation && (
                    <p className="text-slate-400 mb-4 text-sm hidden md:block text-center">
                    Search our database of 100+ leading brands across major industries and get a ready-to-use Google Slides deck analyzing any competitor's Meta ad strategy with actionable insights.
                    </p>
                )}
                 {brandForConfirmation && (
                    <p className="text-slate-400 mb-4 text-sm text-center">
                      Search our database of 100+ leading brands across major industries and get a ready-to-use Google Slides deck analyzing any competitor's Meta ad strategy with actionable insights.
                    </p>
                )}
                <div className="relative">
                  <SearchIcon size={20} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input type="text" placeholder="Search by brand name or category..." value={searchTerm} onChange={handleSearchChange}
                    className="w-full bg-[#0a1419] border border-gray-800 text-white rounded-lg py-3 pl-10 pr-4 focus:ring-2 focus:ring-[#ff6b45] focus:border-[#ff6b45] outline-none placeholder-slate-500 transition-colors"/>
                </div>
              </div>
            </div>
          </SectionStep>

          {!searchTerm && sampleBrands.length > 0 && (
            <div className="my-8">
              <h3 className="text-sm font-semibold text-slate-300 mb-4">Or, Explore Sample Reports</h3>
              <div className="relative">
                <div className="overflow-hidden" ref={carouselContainerRef}>
                  <div className="flex transition-transform duration-300 ease-in-out" style={{ transform: `translateX(-${currentCarouselIndex * (100 / SAMPLES_TO_SHOW_IN_CAROUSEL)}%)` }}>
                    {sampleBrands.map((sample) => (
                      <div key={sample.id} className="group relative flex-shrink-0 p-2" style={{ width: `${100 / SAMPLES_TO_SHOW_IN_CAROUSEL}%` }}>
                        <div className="bg-[#0a1419] rounded-lg p-4 flex flex-col items-center h-full group-hover:bg-[#0f1e25] transition-all">
                          <img src={sample.logoUrl} alt={`${sample.name} logo`}
                            className="w-16 h-16 rounded-full mb-3 object-cover"
                            onError={(e) => { e.target.onerror = null; e.target.src=`https://placehold.co/64x64/7f1d1d/FFFFFF?text=ERR&font=Inter`; }}/>
                          <p className="text-xs text-slate-200 font-medium text-center truncate w-full mb-2 flex-grow">{sample.name}</p>
                          <button onClick={() => handleSampleSelect(sample)}
                            className="absolute inset-0 m-auto w-36 h-10 bg-[#ff6b45] text-white text-xs font-semibold rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-in-out flex items-center justify-center focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-[#ff6b45]"
                            aria-label={`Open report for ${sample.name}`}>
                            <FileText size={14} className="mr-1.5" /> Open Report
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Carousel Navigation Buttons */}
                {totalCarouselSlides > 1 && ( <>
                    <button onClick={handlePrevSample} disabled={currentCarouselIndex === 0} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 sm:-translate-x-full bg-[#0a1419] hover:bg-[#ff6b45] text-white p-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-all z-10" aria-label="Previous sample reports"><ChevronLeftIcon size={20} /></button>
                    <button onClick={handleNextSample} disabled={currentCarouselIndex >= totalCarouselSlides -1} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 sm:translate-x-full bg-[#0a1419] hover:bg-[#ff6b45] text-white p-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-all z-10" aria-label="Next sample reports"><ChevronRight size={20} /></button></>)}
              </div>
              {/* Carousel Dot Indicators */}
              {totalCarouselSlides > 1 && ( <div className="flex justify-center mt-4 space-x-1.5"> {Array.from({ length: totalCarouselSlides }).map((_, idx) => (<button key={`dot-${idx}`} onClick={() => handleDotClick(idx)} className={`w-2 h-2 rounded-full transition-all duration-300 ${currentCarouselIndex === idx ? 'bg-[#ff6b45] scale-125' : 'bg-slate-600 hover:bg-slate-500'}`} aria-label={`Go to sample slide ${idx + 1}`}/> ))}</div>)}
            </div>
          )}

          {!brandForConfirmation && !searchTerm && ( 
            <div className="md:hidden mb-4 relative">
                <button onClick={() => setIsMobileSortOpen(prev => !prev)} className="w-full flex items-center justify-between text-left p-3 bg-[#0a1419] hover:bg-[#0f1e25] rounded-md text-slate-200 text-sm">
                    <span className="flex-grow">
                        Showing {brandsToShow.length} of {sortedAndFilteredBrands.length} brands.
                        Sorted by: <span className="font-semibold text-white">{getCurrentSortLabel()}</span>
                    </span>
                    <SlidersHorizontal size={18} className="text-slate-400 ml-2 flex-shrink-0" />
                </button>
                {isMobileSortOpen && (
                    <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-[#0a1419] border border-gray-800 rounded-md shadow-lg py-1">
                        {sortOptions.map(opt => (<button key={opt.label} onClick={() => handleSort(opt.key, opt.direction)}
                                className={`w-full text-left px-4 py-2 text-sm hover:bg-[#0f1e25] ${sortKey === opt.key && sortDirection === opt.direction ? 'text-[#ff6b45] font-semibold' : 'text-slate-200'}`}>
                                {opt.label}</button>))}
                    </div>
                )}
            </div>
          )}

          {brandForConfirmation ? (
            <div className="my-6 animate-fadeIn">
              <BrandRowDisplay brand={brandForConfirmation} maxFollowers={maxFollowers} maxTotalAds={maxTotalAds} isFocusedView={true}/>
              <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-end">
                <button onClick={handleChangeSelection} className="flex-1 sm:flex-none bg-[#0a1419] hover:bg-[#0f1e25] text-slate-200 font-medium py-2.5 px-5 rounded-md transition-colors duration-150 text-sm flex items-center justify-center"><XCircle size={18} className="mr-2" /> Change Selection</button>
                <button onClick={handleConfirmSelection} className="flex-1 sm:flex-none bg-[#ff6b45] hover:bg-[#e55a35] text-white font-semibold py-2.5 px-5 rounded-md transition-colors duration-150 text-sm flex items-center justify-center"><CheckCircle size={18} className="mr-2" /> Confirm & Proceed</button>
              </div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <div className="min-w-full">
                  {/* Desktop Table Headers */}
                  <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider bg-[#0a1419] rounded-t-md">
                    <div className="md:col-span-3 flex items-center cursor-pointer hover:text-[#ff6b45] transition-colors" onClick={() => handleSort('name', sortDirection === 'asc' && sortKey === 'name' ? 'desc' : 'asc')}>Brand <DesktopSortIcon columnKey="name" /></div>
                    <div className="md:col-span-2 flex items-center cursor-pointer hover:text-[#ff6b45] transition-colors" onClick={() => handleSort('followersRaw', sortDirection === 'asc' && sortKey === 'followersRaw' ? 'desc' : 'asc')}>Followers <DesktopSortIcon columnKey="followersRaw" /></div>
                    <div className="md:col-span-2 flex items-center cursor-pointer hover:text-[#ff6b45] transition-colors" onClick={() => handleSort('totalAdsRaw', sortDirection === 'asc' && sortKey === 'totalAdsRaw' ? 'desc' : 'asc')}>Total Ads <DesktopSortIcon columnKey="totalAdsRaw" /></div>
                    <div className="md:col-span-4 flex items-center">Description</div>
                    <div className="md:col-span-1 text-right flex items-center justify-end">Select</div>
                  </div>
                  {/* Brand Rows */}
                  {brandsToShow.map((brand, index) => (
                    <div key={brand.id}
                        className={`cursor-pointer ${index === 0 && !searchTerm && !brandForConfirmation && 'md:rounded-t-none'} ${index === brandsToShow.length -1 && 'rounded-b-md border-b-0'}`} 
                        onClick={() => handleInitiateSelection(brand)} role="button" tabIndex={0}
                        onKeyPress={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleInitiateSelection(brand); }}}>
                      <BrandRowDisplay brand={brand} maxFollowers={maxFollowers} maxTotalAds={maxTotalAds} onSelect={handleInitiateSelection}/>
                    </div>
                  ))}
                </div>
              </div>
              {/* Load More Button */}
              {displayedBrandsCount < sortedAndFilteredBrands.length && (
                <div className="mt-8 text-center"><button onClick={handleLoadMore} className="bg-[#0a1419] hover:bg-[#0f1e25] text-slate-200 font-semibold py-2.5 px-6 rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#ff6b45] focus:ring-offset-2 focus:ring-offset-[#0f1e25] flex items-center justify-center mx-auto"><ChevronDown size={20} className="mr-2" />Load More Brands ({sortedAndFilteredBrands.length - displayedBrandsCount} remaining)</button></div>)}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// This is the only export from this file now
export default BrandLeaderboard;
