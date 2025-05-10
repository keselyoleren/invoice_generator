import React from 'react';
import { Outlet } from 'react-router-dom';
import { FileText } from 'lucide-react';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-semibold text-gray-900">Invoice Generator</span>
            </div>
          </div>
        </div>
      </nav>
      <main className="pb-12">
        <Outlet />
      </main>
      <footer className="bg-white py-4 border-t">
        <div className="container mx-auto px-4">
          <p className="text-center text-gray-600 text-sm">
            &copy; {new Date().getFullYear()} Invoice Generator. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;