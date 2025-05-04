import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  showBackButton?: boolean;
  backButtonUrl?: string;
}

export function PageHeader({
  title,
  description,
  action,
  showBackButton = false,
  backButtonUrl = '/'
}: PageHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div className="flex-1">
        {showBackButton && (
          <Link href={backButtonUrl}>
            <Button variant="ghost" size="sm" className="mb-2 -ml-2 text-gray-500 hover:text-gray-800">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
          </Link>
        )}
        <h1 className="text-2xl md:text-3xl font-bold text-[#13294B]">{title}</h1>
        {description && <p className="text-gray-600 mt-1">{description}</p>}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}