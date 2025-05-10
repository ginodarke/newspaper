# Newspaper.AI

An AI-powered news aggregator with personalized content delivery. Combines TikTok-like consumption speed with AI-generated summaries and analysis of news articles.

## Features

- 🌙 Dark theme with beautiful 3D card effects
- 🤖 AI-generated summaries of articles
- 📰 Real-time news from multiple sources
- 🔍 Personalized content based on interests
- 📱 Responsive design for all devices
- 🗺️ Local news based on your location
- 🔥 Trending news section
- 🌎 National and global news

## Setup Instructions

### Prerequisites

- Node.js 16+ and npm
- API keys for the supported news services

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/newspaper-ai.git
cd newspaper-ai
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on the `.env.example` and add your API keys:
```
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# News API Keys
VITE_NEWSAPI_KEY=your_newsapi_key_here
VITE_THENEWSAPI_KEY=your_thenewsapi_key_here
VITE_NEWSDATA_KEY=your_newsdata_key_here
VITE_APITUBE_KEY=your_apitube_key_here

# OpenAI API Key for AI summaries
VITE_OPENAI_API_KEY=your_openai_key_here

# Radar API Key for location services
VITE_RADAR_PUBLISHABLE_KEY=your_radar_publishable_key_here
```

4. Start the development server:
```bash
npm run dev
```

### Getting API Keys

- **NewsAPI**: Register at [newsapi.org](https://newsapi.org) to get a free API key
- **TheNewsAPI**: Sign up at [thenewsapi.com](https://thenewsapi.com) for an API key
- **NewsData.io**: Get your API key from [newsdata.io](https://newsdata.io)
- **APITube**: Obtain a key from [apitube.io](https://apitube.io)
- **OpenAI**: Get your API key from [platform.openai.com](https://platform.openai.com)
- **Radar**: Sign up at [radar.io](https://radar.io) for location services

## Architecture

The app is built with:
- **Frontend**: React, Tailwind CSS, Framer Motion
- **State Management**: React Context API
- **Authentication**: Supabase Auth
- **Database**: Supabase
- **News Data**: Multiple news APIs
- **AI**: OpenAI for summaries and relevance scoring

## Dark Theme

The application uses a modern dark theme with 3D card effects. Key components of the theme include:

- **Core Color Palette**: Dark backgrounds with high contrast text and vibrant accents
- **3D Card System**: Cards use perspective transforms and subtle shadows
- **Typography System**: Responsive typography with well-defined hierarchy
- **Animation System**: Smooth transitions and interactions throughout the app

For more details on the dark theme implementation, see [DARK_THEME.md](./DARK_THEME.md).

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run serve` - Preview the production build
- `npm run test` - Run tests
- `npm run lint` - Run linter

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
