# Trading Strategy Visualizer

A comprehensive web application for visualizing and testing various trading strategies with real-time market data integration.

## Features

### Update 24.02.24 
There is just so much I have to understand first before circling back to this. But the idea is to have a single interface that is the strategy files. that are bound to Hbots. with performance. so you can slect the strategy see where its running and how its doing and be able to make adjustments.. "Backurner project" 

- Multiple trading strategies:
  - Simple PMM (Pure Market Making)
  - Dynamic PMM
  - Base Strategy Implementation
  - Experimental Strategy
  - Bollinger Bands Strategy
  - TWAP Strategy
  - Funding Rate Arbitrage
- Real-time market data visualization
- Exchange integration with credentials management
- Interactive strategy configuration
- Performance analytics and visualization
- Docker support with dynamic port allocation

## Prerequisites

- Docker
- Node.js 18+ (for local development)
- npm or yarn

## Quick Start

### Using Docker

1. Build the Docker image:
```bash
docker build -t trading-strategy-visualizer .
```

2. Run the container:
```bash
docker run -d -p 3000-4000:3000-4000 trading-strategy-visualizer
```

The application will automatically find an available port in the range 3000-4000.

### Local Development

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

4. Preview production build:
```bash
npm run preview
```

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=your_api_url
VITE_WS_URL=your_websocket_url
```

## Project Structure

```
├── src/
│   ├── components/        # React components
│   ├── services/         # API and data services
│   ├── strategies/       # Trading strategy implementations
│   ├── types/           # TypeScript type definitions
│   └── utils/           # Utility functions
├── public/              # Static assets
└── docker/             # Docker configuration files
```

## Command Cheat Sheet

### Docker Commands

```bash
# Build image
docker build -t trading-strategy-visualizer .

# Run container
docker run -d -p 3000-4000:3000-4000 trading-strategy-visualizer

# View logs
docker logs <container_id>

# Stop container
docker stop <container_id>

# Remove container
docker rm <container_id>

# Remove image
docker rmi trading-strategy-visualizer
```

### Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm run test

# Lint code
npm run lint

# Format code
npm run format
```

### Git Commands

```bash
# Clone repository
git clone <repository_url>

# Create new branch
git checkout -b feature/new-feature

# Stage changes
git add .

# Commit changes
git commit -m "feat: add new feature"

# Push changes
git push origin feature/new-feature
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
