import React from 'react';
import useFeatureFlags from '../../hooks/useFeatureFlags';

interface EnvCheckListItemProps {
  name: string;
  isAvailable: boolean;
  description?: string;
}

const EnvCheckListItem: React.FC<EnvCheckListItemProps> = ({ name, isAvailable, description }) => {
  return (
    <div className="flex items-start mb-2 p-2 border-b border-gray-700 last:border-0">
      <div className={`mr-2 text-lg ${isAvailable ? 'text-green-500' : 'text-red-500'}`}>
        {isAvailable ? '✓' : '×'}
      </div>
      <div>
        <div className="font-medium">{name}</div>
        {description && <div className="text-sm text-gray-400">{description}</div>}
      </div>
    </div>
  );
};

const EnvironmentChecker: React.FC = () => {
  const flags = useFeatureFlags();
  
  return (
    <div className="p-6 rounded-lg bg-gray-800 text-white">
      <h2 className="text-xl font-bold mb-4">Environment Check</h2>
      
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">API Keys</h3>
        <div className="rounded-md bg-gray-900 p-3">
          <EnvCheckListItem 
            name="Supabase URL" 
            isAvailable={flags.hasSupabaseUrl}
            description="Required for database and authentication" 
          />
          <EnvCheckListItem 
            name="Supabase Anon Key" 
            isAvailable={flags.hasSupabaseAnonKey}
            description="Required for database and authentication" 
          />
          <EnvCheckListItem 
            name="OpenRouter API Key" 
            isAvailable={flags.hasOpenRouterKey}
            description="Required for AI summaries"
          />
          <EnvCheckListItem 
            name="News API Key" 
            isAvailable={flags.hasNewsApiKey}
            description="Required for headlines and articles"
          />
          <EnvCheckListItem 
            name="The News API Key" 
            isAvailable={flags.hasTheNewsApiKey}
            description="Alternative source for headlines and articles"
          />
          <EnvCheckListItem 
            name="NewsData API Key" 
            isAvailable={flags.hasNewsDataKey}
            description="Alternative source for headlines and articles"
          />
          <EnvCheckListItem 
            name="ApiTube Key" 
            isAvailable={flags.hasApiTubeKey}
            description="Alternative source for headlines and articles"
          />
          <EnvCheckListItem 
            name="Radar API Key" 
            isAvailable={flags.hasRadarKey}
            description="Used for location-based news"
          />
          <EnvCheckListItem 
            name="Google API Key" 
            isAvailable={flags.hasGoogleApiKey}
            description="Used for search functionality"
          />
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Environment</h3>
        <div className="rounded-md bg-gray-900 p-3">
          <div className="flex justify-between mb-2 p-2 border-b border-gray-700">
            <span>Development Mode</span>
            <span className={flags.isDevelopment ? "text-yellow-400" : "text-gray-400"}>
              {flags.isDevelopment ? "Enabled" : "Disabled"}
            </span>
          </div>
          <div className="flex justify-between mb-2 p-2 border-b border-gray-700">
            <span>Production Mode</span>
            <span className={flags.isProduction ? "text-green-400" : "text-gray-400"}>
              {flags.isProduction ? "Enabled" : "Disabled"}
            </span>
          </div>
          <div className="flex justify-between mb-2 p-2 border-b border-gray-700">
            <span>Debug Mode</span>
            <span className={flags.enableDebugMode ? "text-yellow-400" : "text-gray-400"}>
              {flags.enableDebugMode ? "Enabled" : "Disabled"}
            </span>
          </div>
          <div className="flex justify-between p-2">
            <span>Mock Data</span>
            <span className={flags.enableMockData ? "text-yellow-400" : "text-gray-400"}>
              {flags.enableMockData ? "Enabled" : "Disabled"}
            </span>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-2">Browser Information</h3>
        <div className="rounded-md bg-gray-900 p-3 text-sm">
          <div className="grid grid-cols-2 gap-2">
            <div className="text-gray-400">User Agent:</div>
            <div className="truncate">{flags.browserInfo.userAgent}</div>
            
            <div className="text-gray-400">Platform:</div>
            <div>{flags.browserInfo.platform}</div>
            
            <div className="text-gray-400">Language:</div>
            <div>{flags.browserInfo.language}</div>
            
            <div className="text-gray-400">Online Status:</div>
            <div className={flags.browserInfo.online ? "text-green-400" : "text-red-400"}>
              {flags.browserInfo.online ? "Online" : "Offline"}
            </div>
            
            <div className="text-gray-400">Cookies:</div>
            <div className={flags.browserInfo.cookiesEnabled ? "text-green-400" : "text-red-400"}>
              {flags.browserInfo.cookiesEnabled ? "Enabled" : "Disabled"}
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 flex gap-3">
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Reload Page
        </button>
        <button 
          onClick={() => window.location.href = "/"}
          className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
        >
          Go to Home
        </button>
        <button 
          onClick={() => {
            // Create a .env file with all variables
            const envContent = Object.entries(import.meta.env)
              .filter(([key]) => key.startsWith('VITE_'))
              .map(([key, value]) => `${key}=${value}`)
              .join('\n');
            
            // Create download
            const blob = new Blob([envContent], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = '.env.local';
            document.body.appendChild(a);
            a.click();
            URL.revokeObjectURL(url);
            document.body.removeChild(a);
          }}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        >
          Export ENV
        </button>
      </div>
    </div>
  );
};

export default EnvironmentChecker; 