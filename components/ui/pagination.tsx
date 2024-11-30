import * as React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { ButtonProps, buttonVariants } from "@/components/ui/button";

interface PaginationProps extends React.HTMLAttributes<HTMLDivElement> {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  totalPages,
  currentPage,
  onPageChange,
  className,
  ...props
}: PaginationProps) {
  const generatePages = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    pages.push(1);
    
    if (currentPage > 3) {
      pages.push('...');
    }

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) {
      pages.push('...');
    }

    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div
      className={cn("flex items-center justify-center space-x-2", className)}
      {...props}
    >
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className={buttonVariants({
          variant: "outline",
          size: "icon",
          className: "h-8 w-8",
        })}
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      {generatePages().map((page, i) => (
        <React.Fragment key={i}>
          {typeof page === "string" ? (
            <div className="flex h-8 w-8 items-center justify-center">
              <MoreHorizontal className="h-4 w-4" />
            </div>
          ) : (
            <button
              onClick={() => onPageChange(page)}
              className={buttonVariants({
                variant: currentPage === page ? "default" : "outline",
                size: "icon",
                className: "h-8 w-8",
              })}
            >
              {page}
            </button>
          )}
        </React.Fragment>
      ))}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className={buttonVariants({
          variant: "outline",
          size: "icon",
          className: "h-8 w-8",
        })}
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}