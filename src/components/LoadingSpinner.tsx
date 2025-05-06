interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
}

export default function LoadingSpinner({ size = 'medium' }: LoadingSpinnerProps) {
  const sizeClasses = {
    small: 'w-5 h-5',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };
  
  const spinnerSize = sizeClasses[size];
  
  return (
    <div className="flex flex-col items-center justify-center">
      <div className={`${spinnerSize} animate-spin rounded-full border-4 border-blue-200 border-t-blue-600 dark:border-gray-700 dark:border-t-blue-500`}></div>
      {size === 'large' && (
        <p className="mt-3 text-gray-600 dark:text-gray-400">Loading content...</p>
      )}
    </div>
  );
} 