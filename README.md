# Watchable Frontend

A modern, responsive web application for discovering movies and TV shows, built with Angular 19. Watchable allows users to explore trending content, maintain personal watchlists, rate movies and shows, and discover new entertainment powered by The Movie Database (TMDB) API.

This application demonstrates modern web development practices, advanced architectural patterns, and professional-grade implementation of a full-featured entertainment discovery platform.

## Live Demo

**Production**: [https://watchable-frontend.netlify.app](https://watchable-frontend.netlify.app)

## Project Showcase

### Professional Skills Demonstrated

This project showcases expertise in:

-   **Modern Frontend Architecture**: Angular 19 with standalone components and reactive programming
-   **API Integration Excellence**: Comprehensive RESTful API integration with structured architectural layers
-   **User Experience Design**: Responsive, accessible, and intuitive interface design
-   **Authentication Systems**: Secure OAuth implementation with complex authentication flows
-   **Performance Engineering**: Lazy loading, infinite scroll, and optimized data fetching strategies

### Technical Excellence

-   **Clean Architecture**: Demonstrates SOLID principles with clear separation of concerns
-   **Design Patterns**: Professional implementation of Facade, Gateway, and Driver patterns
-   **Reactive Programming**: Advanced RxJS usage for complex asynchronous operations

### Industry-Ready Features

-   Comprehensive TypeScript implementation with strict type safety
-   Enterprise-level error handling and user feedback systems
-   Scalable codebase architecture for future expansion

## Features

### Content Discovery

-   **Trending Content**: Browse trending movies, TV shows, and people with daily/weekly filtering
-   **Advanced Search**: Multi-search functionality across movies, TV shows, and people
-   **Detailed Information**: Comprehensive details including cast, crew, trailers, reviews, and similar content
-   **Genre Filtering**: Explore content by specific genres
-   **Multiple Categories**: Popular, top-rated, now playing, and upcoming content

### User Features

-   **TMDB Authentication**: Secure login using The Movie Database credentials
-   **Personal Watchlist**: Add and manage movies and TV shows to watch later
-   **Rating System**: Rate movies, TV shows, and individual episodes
-   **Cross-Platform**: Responsive design optimized for desktop and mobile devices

### User Experience

-   **Modern UI**: Clean, beautiful interface with smooth animations
-   **Infinite Scroll**: Seamless content loading for better performance
-   **Loading States**: Elegant loading indicators and skeleton screens
-   **Snackbar Notifications**: User-friendly feedback system
-   **Back to Top**: Quick navigation enhancement
-   **Mobile Navigation**: Optimized mobile menu system

## Tech Stack

### Frontend Framework

-   **Angular 19.2.14** - Latest Angular framework with standalone components
-   **TypeScript 5.8.3** - Type-safe development
-   **SCSS** - Advanced CSS preprocessing
-   **RxJS 7.8.0** - Reactive programming for state management

### UI & Styling

-   **FontAwesome 6.7.2** - Icon library
-   **Swiper 11.2.5** - Touch slider component
-   **Custom SCSS** - Responsive design system
-   **CSS Grid & Flexbox** - Modern layout techniques

### Development Tools

-   **ESLint** - Code quality and consistency
-   **Prettier** - Code formatting
-   **Angular CLI** - Project tooling and build system

### Architecture Patterns

-   **Facade Pattern** - Service layer abstraction
-   **Gateway Pattern** - API integration layer
-   **Driver Pattern** - HTTP service abstraction
-   **Reactive Programming** - RxJS observables throughout
-   **Standalone Components** - Modern Angular architecture

## Project Structure

```
src/
├── app/
│   ├── features/              # Feature modules
│   │   ├── trending/          # Trending content pages
│   │   ├── movies/            # Movie-specific features
│   │   ├── tv-shows/          # TV show features
│   │   ├── people/            # People/cast features
│   │   ├── search/            # Search functionality
│   │   ├── watchlist/         # User watchlist
│   │   └── ratings/           # User ratings
│   └── shared/                # Shared utilities
│       ├── components/        # Reusable UI components
│       ├── services/          # Core services
│       ├── facades/           # Business logic layer
│       ├── gateways/          # API integration layer
│       ├── drivers/           # HTTP drivers
│       ├── models/            # TypeScript interfaces
│       ├── guards/            # Route guards
│       ├── pipes/             # Custom pipes
│       ├── directives/        # Custom directives
│       └── helpers/           # Utility functions
├── environments/              # Environment configurations
└── assets/                    # Static assets
```

## Getting Started

### Prerequisites

-   **Node.js** (version specified in `.nvmrc`)
-   **npm** or **yarn**
-   **Git**

### Installation

1. **Clone the repository**

    ```bash
    git clone https://github.com/Angelos-Barmpoutis/watchable.frontend.git
    cd watchable.frontend
    ```

2. **Install dependencies**

    ```bash
    npm install
    ```

3. **Environment Setup**

    - The application uses TMDB API with pre-configured authentication tokens
    - For development, the default configuration should work out of the box
    - For production deployment, ensure environment variables are properly set

4. **Start development server**

    ```bash
    npm start
    # or
    ng serve
    ```

5. **Open your browser**
   Navigate to `http://localhost:4200`

## Available Scripts

| Command          | Description               |
| ---------------- | ------------------------- |
| `npm start`      | Start development server  |
| `npm run build`  | Build for production      |
| `npm run watch`  | Build with file watching  |
| `npm test`       | Run unit tests            |
| `npm run lint`   | Run ESLint                |
| `npm run format` | Format code with Prettier |

## Deployment

### Netlify (Recommended)

The application is configured for Netlify deployment with:

-   **SPA Routing**: Proper redirect rules for Angular routing
-   **Security Headers**: Enhanced security configuration
-   **Asset Caching**: Optimized caching for static assets
-   **Build Configuration**: Automatic deployment from Git

### Manual Deployment

1. Build the application:
    ```bash
    npm run build
    ```
2. Deploy the `dist/watchable.frontend/` directory to your hosting provider

## Configuration

### Environment Variables

The application supports different environments:

-   **Development** (`src/environments/environment.ts`)
-   **Production** (`src/environments/environment.prod.ts`)

Key configuration options:

-   `TMDBBaseUrl`: The Movie Database API base URL
-   `authToken`: TMDB API authentication token
-   `origin`: Application origin URL for authentication redirects
-   `imageBaseUrl`: TMDB image service base URL

### TMDB API Integration

This application integrates with The Movie Database (TMDB) API:

-   **Authentication**: OAuth-based user authentication
-   **Content Data**: Movies, TV shows, and people information
-   **Media Assets**: Posters, backdrops, and video content
-   **User Features**: Watchlists, ratings, and account management

## Browser Support

-   **Chrome** (latest)
-   **Firefox** (latest)
-   **Safari** (latest)
-   **Edge** (latest)
-   **Mobile browsers** (iOS Safari, Chrome Mobile)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

-   Follow Angular style guide and conventions
-   Use TypeScript interfaces for type safety
-   Follow the established architecture patterns
-   Ensure responsive design compatibility

## Technical Highlights

### Architecture & Code Quality

-   **Component Architecture**: 20+ reusable components following Angular best practices
-   **Service Layer**: Comprehensive service architecture with facades, gateways, and drivers
-   **Type Safety**: Full TypeScript implementation with strict type checking
-   **Responsive Design**: Mobile-first approach with support for all device sizes
-   **Performance**: Optimized bundle sizes and lazy loading implementation

### Complex Problem Solving

-   **Authentication Flow**: Sophisticated TMDB OAuth authentication with popup and redirect handling
-   **State Management**: Complex state management across multiple feature modules
-   **Cross-browser Compatibility**: Consistent experience across all major browsers
-   **Mobile Optimization**: Touch-friendly interfaces and responsive navigation

### Potential Enhancements

-   **Progressive Web App**: Complete PWA implementation with offline capabilities
-   **Social Features**: User reviews and community-driven content
-   **AI Integration**: Machine learning-based content recommendations
-   **Accessibility**: WCAG 2.1 AA compliance for inclusive design
-   **Internationalization**: Multi-language support for global audience

## Open Source Contribution

This project is open for contributions! Whether you're:

-   **Learning Angular**: Great codebase to study modern Angular patterns
-   **Building Portfolio**: Contribute to a professional-grade application
-   **Improving Skills**: Work with real-world architectural challenges
-   **Adding Features**: Help expand the platform's capabilities

### How to Contribute

I welcome contributions of all kinds:

-   Bug fixes and improvements
-   New features and enhancements
-   Documentation improvements
-   UI/UX enhancements
-   Performance optimizations

## References & Documentation

### Technical References

-   Angular Team. (2024). _Angular Framework Documentation_. Retrieved from https://angular.io/
-   The Movie Database. (2024). _TMDB API Documentation_. Retrieved from https://developers.themoviedb.org/
-   Mozilla Developer Network. (2024). _Web APIs_. Retrieved from https://developer.mozilla.org/

## Acknowledgments

-   **The Movie Database (TMDB)** - For providing the comprehensive movie and TV show data API
-   **Angular Team** - For the excellent framework and tooling
-   **Open Source Community** - For the amazing libraries and tools that make this project possible
-   **Contributors** - Thank you to everyone who helps improve this project

## Support & Contact

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/Angelos-Barmpoutis/watchable.frontend/issues) page
2. Create a new issue with detailed information
3. For general questions, use the [Discussions](https://github.com/Angelos-Barmpoutis/watchable.frontend/discussions) section
4. For professional inquiries, feel free to reach out through GitHub
