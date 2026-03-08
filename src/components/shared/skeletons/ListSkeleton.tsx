import React from "react";
import { Card } from "@/components/ui/Card";

const ListSkeleton: React.FC<{ items?: number }> = ({ items = 5 }) => {
  return (
    <div className="space-y-4 animate-pulse">
      {[...Array(items)].map((_, i) => (
        <Card key={i} className="p-4 md:p-6 rounded-[20px] border-gray-100 flex flex-col md:flex-row items-center gap-4">
          <div className="w-12 h-12 bg-gray-200 rounded-2xl shrink-0"></div>
          <div className="flex-1 space-y-2 w-full">
            <div className="w-1/3 h-5 bg-gray-200 rounded-md"></div>
            <div className="w-1/4 h-3 bg-gray-100 rounded-md"></div>
          </div>
          <div className="w-24 h-8 bg-gray-200 rounded-xl shrink-0"></div>
          <div className="w-32 h-10 bg-gray-50 rounded-xl shrink-0"></div>
        </Card>
      ))}
    </div>
  );
};

export default ListSkeleton;
