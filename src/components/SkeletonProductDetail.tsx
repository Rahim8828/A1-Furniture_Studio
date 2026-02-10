import React from 'react';

const SkeletonProductDetail: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image skeleton */}
        <div className="bg-gray-300 rounded-lg h-96"></div>

        {/* Details skeleton */}
        <div>
          <div className="h-8 bg-gray-300 rounded w-3/4 mb-4"></div>
          <div className="h-6 bg-gray-300 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-2/3 mb-6"></div>
          <div className="flex gap-4">
            <div className="h-12 bg-gray-300 rounded w-1/2"></div>
            <div className="h-12 bg-gray-300 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonProductDetail;
