# Workout Excuse Generator

A beautifully designed web application that helps you generate creative excuses for skipping workouts, built with React, TypeScript, and Tailwind CSS. Features a sleek dark mode, real-time notifications, and achievement tracking.

![Excuse Generator Screenshot](https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1200&h=600&fit=crop)

## Features

- 🏃‍♂️ Generate creative excuses for different workout types
- 🌙 Dark mode support
- 📊 Track your excuse history and statistics
- 🏆 Earn achievements for your creative avoidance
- 🔍 Search through your excuse history
- 🔔 Real-time notifications for achievements and milestones
- 📱 Responsive design for all devices
- 🔐 User profiles and preferences
- 📊 Detailed statistics and analytics
- 🎯 Streak tracking

## Tech Stack

- React 18
- TypeScript
- Tailwind CSS
- Framer Motion
- Supabase
- Lucide Icons
- Date-fns
- Recharts
- Zod

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/workout-excuse-generator.git
cd workout-excuse-generator
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Building for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
├── src/
│   ├── components/      # React components
│   ├── contexts/        # React context providers
│   ├── lib/            # Utility functions and configurations
│   ├── App.tsx         # Main application component
│   └── main.tsx        # Application entry point
├── api/                # Backend API handlers
├── supabase/          # Supabase configurations and migrations
└── public/            # Static assets
```

## Features in Detail

### Excuse Generation
- Multiple workout types supported (running, weightlifting, yoga, etc.)
- Customizable duration and intensity levels
- Share excuses on social media
- Save favorite excuses for later use

### Achievement System
- Track your progress with achievements
- Unlock new achievements based on your excuse creativity
- View your achievement history and progress

### Statistics Dashboard
- Visual representation of your excuse history
- Track your streak of consecutive days
- Analyze patterns in your workout avoidance
- Export statistics for personal analysis

### User Preferences
- Customize your profile
- Set preferred workout types
- Configure notification preferences
- Toggle dark/light mode
- Manage saved excuses

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Icons by [Lucide](https://lucide.dev)
- UI components styled with [Tailwind CSS](https://tailwindcss.com)
- Charts powered by [Recharts](https://recharts.org)
- Animation by [Framer Motion](https://www.framer.com/motion)
