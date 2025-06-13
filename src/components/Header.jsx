import React from 'react';

const Header = () => {
  return (
    <header className="sticky top-0 z-10 bg-[#122830] border-b border-gray-800">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <a className="flex items-center" href="https://antelopeinc.com/">
            <div className="w-8 h-8 mr-2">
              <img 
                alt="Antelope Logo" 
                width="32" 
                height="32" 
                className="w-full h-full object-contain"
                src="https://images.antelopeinc.com/chatbots/slidesTool/logo_color_transparency.png"
              />
            </div>
            <span className="text-white font-medium">Antelope</span>
          </a>
        </div>
        <nav className="hidden md:flex space-x-8">
          <a className="text-white hover:text-[#ff6b45] transition" href="https://antelopeinc.com/">Home</a>
          <a className="text-white hover:text-[#ff6b45] transition" href="https://antelopeinc.com/#benefits">What We Do</a>
          <a className="text-white hover:text-[#ff6b45] transition" href="https://antelopeinc.com/case-study">Our Reports</a>
          <a className="text-white hover:text-[#ff6b45] transition" href="https://antelopeinc.com/#process">Process</a>
          <a className="text-white hover:text-[#ff6b45] transition" href="https://antelopeinc.com/blog/">Blog</a>
        </nav>
        <a 
          href="https://www.linkedin.com/in/danielryanrobinson/" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="bg-[#ff6b45] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#e55a35] transition"
        >
          Get in touch
        </a>
      </div>
    </header>
  );
};

export default Header; 