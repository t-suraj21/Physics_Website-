import React from 'react';
import { Loader2, Inbox, AlertTriangle, RefreshCw } from 'lucide-react';
import Button from './Button';
import Card from './Card';

// 1. LoadingState (Spinner and Skeletons)
export const LoadingState = ({
  fullPage = false,
  message = 'Loading...',
  skeleton = false,
  count = 3,
}) => {
  if (skeleton) {
    return (
      <div className="space-y-4 w-full">
        {Array.from({ length: count }).map((_, idx) => (
          <div key={idx} className="animate-pulse flex space-x-4 p-4 border border-slate-800 rounded-3xl bg-slate-900/30">
            <div className="rounded-full bg-slate-800 h-10 w-10"></div>
            <div className="flex-1 space-y-3 py-1">
              <div className="h-2 bg-slate-850 rounded col-span-2"></div>
              <div className="space-y-2">
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-2 bg-slate-850 rounded col-span-2"></div>
                  <div className="h-2 bg-slate-850 rounded col-span-1"></div>
                </div>
                <div className="h-2 bg-slate-850 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const spinner = (
    <div className="flex flex-col items-center justify-center space-y-3 p-8">
      <Loader2 className="w-9 h-9 text-primary-500 animate-spin" />
      {message && <p className="text-sm font-bold text-slate-400">{message}</p>}
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md">
        {spinner}
      </div>
    );
  }

  return spinner;
};

// 2. EmptyState
export const EmptyState = ({
  title = 'No items found',
  description = 'There are no items to show at the moment.',
  icon: Icon = Inbox,
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 border border-dashed border-slate-800 rounded-3xl bg-slate-900/10 ${className}`}>
      <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-500 mb-4">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-base font-bold text-slate-200 mb-1">
        {title}
      </h3>
      <p className="text-sm text-slate-400 max-w-sm mb-5 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="primary" size="sm">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

// 3. ErrorState
export const ErrorState = ({
  title = 'Something went wrong',
  description = 'We encountered an error loading the resources. Please try again.',
  onRetry,
  className = '',
}) => {
  return (
    <Card className={`flex flex-col items-center justify-center text-center p-8 border-rose-950/40 bg-rose-950/5 ${className}`}>
      <div className="p-3 bg-rose-950/20 text-rose-455 rounded-xl mb-4">
        <AlertTriangle className="w-8 h-8" />
      </div>
      <h3 className="text-base font-bold text-slate-200 mb-1">
        {title}
      </h3>
      <p className="text-sm text-slate-500 max-w-sm mb-5 leading-relaxed">
        {description}
      </p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" size="sm" icon={RefreshCw}>
          Retry Connection
        </Button>
      )}
    </Card>
  );
};
