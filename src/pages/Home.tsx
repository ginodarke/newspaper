import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <h1 className="text-4xl font-bold mb-6">Newspaper.AI</h1>
      <p className="text-xl mb-8 max-w-2xl">
        Personalized news summaries powered by AI. Get the news that matters to you,
        summarized in seconds.
      </p>
      <div className="flex gap-4">
        <Link 
          to="/auth" 
          className="px-6 py-2 bg-primary text-white rounded-md hover:opacity-90 transition-opacity"
        >
          Get Started
        </Link>
      </div>
    </div>
  );
} 