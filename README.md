# Newspaper.AI

Newspaper.AI is an AI-powered news aggregator with personalized content delivery. The app combines TikTok-like consumption speed with AI-generated summaries and analysis of news articles, tailored to each user.

## Features

- Personalized news feed based on user preferences
- AI-generated summaries and relevance explanations
- Dark/light mode themes
- Search functionality
- Authentication system with Supabase
- Responsive design for all device sizes

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Framer Motion
- **Authentication/Database**: Supabase
- **Testing**: Vitest (unit), Playwright (E2E)
- **Deployment**: Render

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/newspaper-ai.git
   cd newspaper-ai
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with your Supabase credentials
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Start the development server
   ```bash
   npm run dev
   ```

## Testing

### Unit Tests

```bash
npm test
```

For watch mode:
```bash
npm run test:watch
```

### E2E Tests

```bash
npm run test:e2e
```

## Deployment

The app can be deployed to Render using the `render.yaml` configuration file. 

### GitHub Actions CI/CD

The repository includes GitHub Actions workflows:
- `ci.yml`: Runs on pull requests to validate code quality and tests
- `deploy.yml`: Deploys to Render when changes are merged to main

### Manual Deployment

1. Create a new static site on Render
2. Connect your GitHub repository
3. Use the following settings:
   - Build Command: `npm ci && npm run build`
   - Publish Directory: `dist`
4. Add environment variables:
   - `VITE_SUPABASE_URL`: Your Supabase URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key

## Project Structure

- `src/components`: Reusable UI components
- `src/pages`: Page components
- `src/contexts`: React contexts for state management
- `src/services`: Service modules for API calls
- `src/types`: TypeScript type definitions
- `tests/`: Test files

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information. 