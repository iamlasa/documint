import * as React from "react";
import { useState, useEffect } from "react"; // Add this line
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
  const [isNavigating, setIsNavigating] = useState(false);
  const [localCurrentPage, setLocalCurrentPage] = useState(currentPage);

  // Update local state when prop changes
  useEffect(() => {
    setLocalCurrentPage(currentPage);
    setIsNavigating(false);
  }, [currentPage]);

  const handlePageChange = async (page: number) => {
    setIsNavigating(true);
    setLocalCurrentPage(page);
    onPageChange(page);
  };

  const generatePages = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    pages.push(1);
    
    if (localCurrentPage > 3) {
      pages.push('...');
    }

    const start = Math.max(2, localCurrentPage - 1);
    const end = Math.min(totalPages - 1, localCurrentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (localCurrentPage < totalPages - 2) {
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
        onClick={() => handlePageChange(localCurrentPage - 1)}
        disabled={localCurrentPage <= 1 || isNavigating}
        className={cn(
          buttonVariants({
            variant: "ghost",
            size: "icon",
          }),
          "h-8 w-8 border-none hover:bg-gray-100"
        )}
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      {generatePages().map((page, i) => (
        <React.Fragment key={i}>
          {typeof page === "string" ? (
            <div className="flex h-8 w-8 items-center justify-center text-gray-500">
              <MoreHorizontal className="h-4 w-4" />
            </div>
          ) : (
            <button
              onClick={() => handlePageChange(page)}
              disabled={isNavigating}
              className={cn(
                buttonVariants({
                  variant: "ghost",
                  size: "icon",
                }),
                "h-8 w-8 border-none transition-colors duration-200",
                localCurrentPage === page 
                  ? "bg-gray-100 text-gray-900" 
                  : "text-gray-500 hover:bg-gray-50"
              )}
            >
              {page}
            </button>
          )}
        </React.Fragment>
      ))}
      <button
        onClick={() => handlePageChange(localCurrentPage + 1)}
        disabled={localCurrentPage >= totalPages || isNavigating}
        className={cn(
          buttonVariants({
            variant: "ghost",
            size: "icon",
          }),
          "h-8 w-8 border-none hover:bg-gray-100"
        )}
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}