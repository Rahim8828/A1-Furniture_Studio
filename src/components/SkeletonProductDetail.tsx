import React from 'react';

const SkeletonProductDetail: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 animate-pulse">
      {/* Breadcrumb skeleton */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="h-4 bg-gray-200 rounded w-64" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 md:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left — Image gallery skeleton */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-gray-100 aspect-square" />
            <div className="flex gap-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-20 h-20 bg-gray-200 rounded-lg" />
              ))}
            </div>
          </div>

          {/* Right — Info skeleton */}
          <div className="space-y-5">
            <div className="h-5 bg-gray-200 rounded w-24" />
            <div className="h-8 bg-gray-200 rounded w-3/4" />
            <div className="flex items-center gap-3">
              <div className="h-8 w-16 bg-gray-200 rounded-lg" />
              <div className="h-4 w-20 bg-gray-200 rounded" />
            </div>
            <hr className="border-gray-200" />
            <div className="h-10 bg-gray-200 rounded w-40" />
            <div className="h-4 bg-gray-200 rounded w-60" />
            <hr className="border-gray-200" />
            <div className="grid grid-cols-3 gap-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 rounded-lg" />
              ))}
            </div>
            <div className="h-14 bg-gray-200 rounded-lg" />
            <div className="flex items-center gap-4">
              <div className="h-10 w-32 bg-gray-200 rounded-lg" />
              <div className="h-4 w-16 bg-gray-200 rounded" />
            </div>
            <div className="flex gap-3">
              <div className="flex-1 h-14 bg-gray-200 rounded-lg" />
              <div className="flex-1 h-14 bg-gray-200 rounded-lg" />
              <div className="w-14 h-14 bg-gray-200 rounded-lg" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-200 rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonProductDetail;
