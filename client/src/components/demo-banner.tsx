import React from 'react';
import { AlertCircle, X } from 'lucide-react';

export default function DemoModeBanner() {
  const [dismissed, setDismissed] = React.useState(false);

  if (dismissed) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-yellow-50 border-b border-yellow-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0" />
          <div className="text-sm font-medium text-yellow-800">
            <strong>Demo Mode:</strong> This site uses local, simulated data only. No external APIs or real transactions. 
            <a href="/demo" className="ml-2 underline hover:text-yellow-900">Try the demo →</a>
          </div>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="ml-4 text-yellow-600 hover:text-yellow-800 flex-shrink-0"
          aria-label="Dismiss banner"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
