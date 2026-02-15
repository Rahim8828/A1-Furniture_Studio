import React from 'react';

const SkeletonCard: React.FC = () => {
  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden animate-pulse">
      {/* Image placeholder — 4:3 aspect ratio */}
      <div className="aspect-[4/3] bg-gray-200" />
      {/* Info placeholder */}
      <div className="p-4 space-y-2.5">
        <div className="h-3.5 bg-gray-200 rounded-full w-[85%]" />
        <div className="h-3.5 bg-gray-200 rounded-full w-[55%]" />
        <div className="flex items-center gap-2 pt-0.5">
          <div className="h-4 w-10 bg-gray-200 rounded" />
          <div className="h-3 w-8 bg-gray-200 rounded" />
        </div>
        <div className="flex items-baseline gap-2 pt-1">
          <div className="h-5 w-20 bg-gray-200 rounded" />
          <div className="h-3.5 w-14 bg-gray-200 rounded" />
        </div>
        <div className="h-3 w-28 bg-gray-200 rounded" />
      </div>
    </div>
  );
};

export default SkeletonCard;
