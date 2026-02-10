# A1 Furniture Studio E-Commerce Website

A modern, premium furniture e-commerce platform built with React, TypeScript, and Tailwind CSS.

## Project Structure

```
src/
├── components/     # Reusable UI components
├── services/       # Business logic and API services
├── models/         # TypeScript interfaces and types
├── pages/          # Page components
├── utils/          # Utility functions
├── tests/          # Test files and setup
└── assets/         # Static assets (images, fonts, etc.)
```

## Tech Stack

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS 4
- **Routing**: React Router v7
- **Testing**: Vitest + React Testing Library + fast-check (PBT)
- **Code Quality**: ESLint + Prettier

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
cd a1-furniture-studio
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run tests once
- `npm run test:watch` - Run tests in watch mode
- `npm run test:ui` - Run tests with UI
- `npm run lint` - Lint code
- `npm run format` - Format code with Prettier

## Testing

The project uses a dual testing approach:

- **Unit Tests**: Verify specific examples and edge cases
- **Property-Based Tests**: Verify universal properties across all inputs using fast-check

Run tests:
```bash
npm run test
```

## Configuration

- **TypeScript**: Strict mode enabled in `tsconfig.app.json`
- **ESLint**: Configured in `eslint.config.js`
- **Prettier**: Configured in `.prettierrc`
- **Tailwind CSS**: Configured in `tailwind.config.js`
- **Vitest**: Configured in `vitest.config.ts`

## Features

- 🛋️ Product browsing by category
- 🔍 Product search functionality
- 🛒 Shopping cart management
- ❤️ Wishlist functionality
- 👤 User authentication
- 💳 Guest checkout support
- 📱 Responsive design (mobile-first)
- ⚡ Fast performance with lazy loading
- 🎨 Premium UI with Tailwind CSS
- ✅ Comprehensive testing with PBT

## License

Private - A1 Furniture Studio
