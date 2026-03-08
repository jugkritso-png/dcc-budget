import React from "react";
import { Card, CardContent } from "@/components/ui/Card";

const DashboardSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Stat Skeletons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="p-6 rounded-[28px] border-gray-100/60 bg-gray-50/10">
            <div className="w-10 h-10 bg-gray-200 rounded-xl mb-4"></div>
            <div className="w-20 h-8 bg-gray-200 rounded-md mb-2"></div>
            <div className="w-24 h-4 bg-gray-100 rounded-md"></div>
          </Card>
        ))}
      </div>

      {/* Charts Skeletons */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <Card key={i} className="p-8 rounded-[24px] border-gray-100/60 h-[450px]">
            <div className="w-48 h-6 bg-gray-200 rounded-md mb-2"></div>
            <div className="w-32 h-4 bg-gray-100 rounded-md mb-8"></div>
            <div className="w-full h-[300px] bg-gray-50 rounded-[20px] flex items-end justify-between p-6">
               {[...Array(12)].map((_, j) => (
                 <div key={j} className="w-[6%] bg-gray-200 rounded-t-md" style={{ height: `${20 + Math.random() * 60}%` }}></div>
               ))}
            </div>
          </Card>
        ))}
      </div>

      {/* Category Skeletons */}
      <Card className="p-8 rounded-[24px] border-gray-100/60">
        <div className="w-64 h-7 bg-gray-200 rounded-md mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="p-6 rounded-[24px] border border-gray-100 bg-gray-50/30">
              <div className="flex justify-between items-start mb-6">
                <div className="space-y-2">
                  <div className="w-16 h-4 bg-gray-200 rounded-md"></div>
                  <div className="w-32 h-6 bg-gray-200 rounded-md"></div>
                </div>
                <div className="w-20 h-6 bg-gray-200 rounded-md"></div>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full mb-6"></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="w-full h-8 bg-gray-100 rounded-lg"></div>
                <div className="w-full h-8 bg-gray-100 rounded-lg"></div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default DashboardSkeleton;
