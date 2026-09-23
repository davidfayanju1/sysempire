import type { ReactNode } from "react";
import { formatNaira } from "../../lib/format";

interface MobileSummaryProps {
  image: string | undefined;
  fallback: ReactNode;
  summary: string;
  estimate: number;
  className?: string;
}

const MobileSummary = ({
  image,
  fallback,
  summary,
  estimate,
  className = "",
}: MobileSummaryProps) => {
  return (
    <div
      className={`flex items-center gap-3.5 border border-line bg-white p-2.5 pr-3.5 ${className}`}
    >
      <div className="flex h-20 w-[60px] shrink-0 items-center justify-center bg-paper p-1.5 text-neutral-500">
        {image ? (
          <img src={image} alt="" className="h-full w-full object-contain" />
        ) : (
          fallback
        )}
      </div>
      <div className="flex min-w-0 flex-col gap-1">
        <span className="text-[10px] tracking-[0.2em] text-muted">
          YOUR GARMENT
        </span>
        <span className="truncate text-sm text-ink">
          {summary || "Start choosing below"}
        </span>
        <span className="font-display text-xl text-ink">
          From {formatNaira(estimate)}
        </span>
      </div>
    </div>
  );
};

export default MobileSummary;
