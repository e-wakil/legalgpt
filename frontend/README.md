# LegalGPT Frontend ⚖️💬

A modern, responsive ChatGPT-style frontend for legal consultation, built with React, TypeScript, Vite, and TailwindCSS.

## 🚀 Features

- **React 19** with TypeScript for type-safe development.
- **Vite** for lightning-fast development and optimized builds.
- **TailwindCSS v4** for modern, responsive UI styling.
- **Google OAuth2** authentication via `@react-oauth/google`.
- **Zustand** for lightweight state management.
- **React Router** for seamless navigation.
- **Axios** with interceptors for API communication.
- **Chat Interface** with conversation history and real-time messaging.

---

## 🛠️ Prerequisites

- **Node.js 18+** and **npm** or **yarn**
- **Ubuntu** (or any Linux/macOS/Windows)
- **Google Cloud Console account** (for OAuth Credentials)
- **Backend API** running on `http://localhost:8000` (or configured URL)

---

## 📥 Installation & Setup

### 1. Clone and Prepare

```bash
git clone <your-repo-url>
cd frontend
npm install
```

### 2. Environment Configuration

Create a `.env` file in the `frontend/` root directory:

```env
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
VITE_BASE_URL=http://localhost:8000/api/v1
```

**Environment Variables:**

- `VITE_GOOGLE_CLIENT_ID` - Your Google OAuth 2.0 Client ID from Google Cloud Console
- `VITE_BASE_URL` - Backend API base URL (default: `http://localhost:8000/api/v1`)

---

## 🏃 Running the Application

Start the development server:

```bash
npm run dev
```

- **Application URL:** [http://localhost:5173](http://localhost:5173)
- **Hot Module Replacement (HMR)** enabled for instant updates

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

---

## 📂 Project Structure

```text
frontend/
├── src/
│   ├── api/                # Axios Configuration & Interceptors
│   │   └── axiosInstance.ts
│   ├── assets/             # Static Assets (Images, Icons)
│   ├── components/         # Reusable UI Components
│   │   ├── layout/         # Layout Components (Navbar, Footer, Hero)
│   │   └── ui/             # UI Primitives (Button, Card, Loading)
│   ├── pages/              # Page Components
│   │   ├── ChatPage.tsx    # Main Chat Interface
│   │   ├── HomePage.tsx    # Landing Page
│   │   └── NotFoundPage.tsx
│   ├── Routes/             # Routing Configuration
│   │   ├── ProtectedRoutes.tsx
│   │   └── Router.tsx
│   ├── sections/           # Page Sections
│   │   └── chat/           # Chat Interface Sections
│   │       ├── SidebarSection.tsx
│   │       ├── MessageInterfaceSection.tsx
│   │       └── MessageSection.tsx
│   ├── store/              # State Management (Zustand)
│   │   └── userStore.tsx
│   ├── App.tsx             # Root Component
│   ├── main.tsx            # Application Entry Point
│   └── index.css           # Global Styles
├── .env                    # Environment Variables
├── .env.example            # Environment Variables Example
├── vite.config.ts          # Vite Configuration
├── tsconfig.json           # TypeScript Configuration
├── tailwind.config.js      # TailwindCSS Configuration
└── package.json            # Dependencies & Scripts
```

---

## 🛠️ Available Scripts

### Development

```bash
npm run dev          # Start development server with HMR
npm run build        # Build for production
npm run preview      # Preview production build locally
npm run lint         # Run ESLint for code quality
```

---

## 🔑 Key Features Explained

### Authentication

- Google OAuth2 integration for secure user authentication
- JWT token management with automatic request interceptors
- Protected routes for authenticated users only

### Chat Interface

- Real-time conversation management
- Chat history with conversation list
- Responsive sidebar for mobile and desktop
- Message streaming and display

### State Management

- Zustand for global user state
- Persistent authentication via localStorage
- Automatic user session restoration

### API Integration

- Axios instance with automatic token injection
- Request/response interceptors for error handling
- Centralized API configuration

---

## 🌐 API Endpoints Used

The frontend communicates with the following backend endpoints:

- `GET /users/me` - Fetch current user profile
- `GET /chat/conversations` - Fetch user's chat history
- `POST /chat/message` - Send messages to the chat
- `POST /auth/google` - Google OAuth authentication

---

## 🎨 Tech Stack

- **Framework:** React 19 with TypeScript
- **Build Tool:** Vite 7
- **Styling:** TailwindCSS 4
- **Routing:** React Router v7
- **State Management:** Zustand
- **HTTP Client:** Axios
- **Authentication:** @react-oauth/google
- **UI Components:** HeroUI, Headless UI, Lucide React
- **Animations:** Framer Motion

---

## 🐛 Troubleshooting

### Port Already in Use

If port 5173 is already in use, Vite will automatically try the next available port. You can specify a custom port:

```bash
npm run dev -- --port 3000
```

### Environment Variables Not Loading

Ensure your `.env` file is in the `frontend/` root directory and all variables are prefixed with `VITE_`.

### CORS Issues

Ensure the backend API has CORS enabled for `http://localhost:5173` (or your frontend URL).

---

## 📝 License

This project is part of the LegalGPT application.

---
