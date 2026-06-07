// components/product/ProductDetailsSkeleton.tsx
import DefaultLayout from "../../layout/DefaultLayout";

const ProductDetailsSkeleton = () => {
  return (
    <DefaultLayout>
      <div className="min-h-screen bg-white pt-24 pb-16">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Left Column Skeleton */}
            <div className="space-y-4">
              <div className="aspect-[3/4] bg-gray-100 animate-pulse rounded-lg" />
              <div className="flex gap-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-20 h-20 bg-gray-100 animate-pulse rounded"
                  />
                ))}
              </div>
            </div>

            {/* Right Column Skeleton */}
            <div className="space-y-6">
              <div className="h-8 bg-gray-100 animate-pulse w-3/4" />
              <div className="h-6 bg-gray-100 animate-pulse w-1/2" />
              <div className="h-24 bg-gray-100 animate-pulse w-full" />
              <div className="h-12 bg-gray-100 animate-pulse w-full" />
              <div className="h-12 bg-gray-100 animate-pulse w-full" />
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default ProductDetailsSkeleton;
