import React from 'react';
import { LeftPanel } from './LeftPanel';
import { CenterPanel } from './CenterPanel';
import { RightPanel } from './RightPanel';

export const TestLayout: React.FC = () => {
  return (
    <div className="max-w-[1400px] mx-auto min-h-screen p-4 md:p-6 lg:p-8">
      {/* Header mock simulating the browser bar in images */}
      <header className="mb-6 pb-4 border-b border-gray-300">
        <h1 className="text-2xl font-bold text-gray-800">Sample Test for the Entrance Exam SaaS</h1>
      </header>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Sidebar */}
        <aside className="w-full lg:w-[200px] flex-shrink-0">
          <LeftPanel />
        </aside>

        {/* Center Main Content */}
        <main className="flex-grow bg-white rounded-lg shadow-sm border border-gray-200">
          <CenterPanel />
        </main>

        {/* Right Sidebar */}
        <aside className="w-full lg:w-[250px] flex-shrink-0">
          <RightPanel />
        </aside>
      </div>
    </div>
  );
};
