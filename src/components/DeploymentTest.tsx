import React from 'react';

export const DeploymentTest: React.FC = () => {
  return (
    <div className="mb-4 p-4 bg-emerald-100 dark:bg-emerald-900 rounded-lg">
      <h3 className="text-xl font-bold text-emerald-700 dark:text-emerald-300">
        Deployment Test
      </h3>
      <p className="text-emerald-600 dark:text-emerald-400">
        This component was added on {new Date().toLocaleString()} - If you see this,
        your deployment is working correctly!
      </p>
    </div>
  );
};

export default DeploymentTest; 