const ProductGridSkeleton = ({ count = 8 }: { count?: number }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 md:gap-8 gap-4">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index}>
          <div className="aspect-[3/4] bg-gray-100 animate-pulse mb-4" />
          <div className="flex flex-col items-center gap-2">
            <div className="h-2 w-16 bg-gray-100 animate-pulse" />
            <div className="h-3 w-24 bg-gray-100 animate-pulse" />
            <div className="h-3 w-12 bg-gray-100 animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductGridSkeleton;
