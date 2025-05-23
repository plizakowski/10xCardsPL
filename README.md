# Fiszki - Developer Learning Platform

[![Project Status: Active](https://img.shields.io/badge/repo_status-active-brightgreen.svg)](https://github.com/your-username/fiszki)

## Project Description

AI-powered flashcard application for mastering programming concepts through spaced repetition. Key features:

- Smart content generation using AI models
- Multi-language programming support
- Cross-device synchronization
- Progress tracking analytics
- Customizable learning paths

## Tech Stack

**Frontend**  
![Astro](https://img.shields.io/badge/Astro-5.0-FF5D01?logo=astro)  
![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react)  
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript)  
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3-06B6D4?logo=tailwind-css)

**Backend**  
![Supabase](https://img.shields.io/badge/Supabase-3.0-3ECF8E?logo=supabase)  
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql)

**AI Integration**  
![OpenRouter](https://img.shields.io/badge/OpenRouter.ai-1.0-4B32C3)

**Infrastructure**  
![DigitalOcean](https://img.shields.io/badge/DigitalOcean-1.0-0080FF?logo=digitalocean)  
![Docker](https://img.shields.io/badge/Docker-24.0-2496ED?logo=docker)

**Testing**  
![Vitest](https://img.shields.io/badge/Vitest-1.0-6E9F18?logo=vitest)  
![React Testing Library](https://img.shields.io/badge/Testing_Library-14.0-E33332?logo=testing-library)  
![Playwright](https://img.shields.io/badge/Playwright-1.40-2EAD33?logo=playwright)  
![Mock Service Worker](https://img.shields.io/badge/MSW-2.0-FF6A33)

## Getting Started Locally

1. **Clone repository**

   ```bash
   git clone https://github.com/your-username/fiszki.git
   cd fiszki
   ```

2. **Install dependencies**

   ```bash
   nvm use 20
   npm install
   ```

3. **Configure environment**

   ```bash
   cp .env.example .env
   ```

   Update values in `.env` file:

   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `OPENROUTER_API_KEY`

4. **Start development server**
   ```bash
   npm run dev
   ```

## Available Scripts

```bash
npm run dev    # Start dev server
npm run build  # Production build
npm run preview  # Preview production build
npm run check  # TypeScript validation
npm run format  # Code formatting
npm run test   # Run unit tests with Vitest
npm run test:ui # Run Vitest with UI
npm run test:e2e # Run E2E tests with Playwright
```

## Project Scope

| Feature                | Status         | Details                   |
| ---------------------- | -------------- | ------------------------- |
| AI Content Generation  | ✅ Implemented | OpenRouter.ai integration |
| Spaced Repetition      | ✅ Implemented | SM-2 algorithm            |
| Multi-language Support | 🚧 In Progress | Python/JS/TS              |
| User Authentication    | ✅ Implemented | Supabase Auth             |
| Analytics Dashboard    | ⏳ Planned     | Q3 2024                   |

## Project Status

**Current Version:** 0.8.0 Beta  
**Latest Release:** [v0.8.0](https://github.com/your-username/fiszki/releases)

Active development with weekly updates. See [ROADMAP.md](docs/ROADMAP.md) for detailed plans.

## License

[MIT License](LICENSE) - _Update with actual license before release_

---

> **Important:** Before deploying to production, ensure proper configuration of environment variables and security settings. Refer to [SECURITY.md](docs/SECURITY.md) for best practices.
