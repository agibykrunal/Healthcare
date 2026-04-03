# 🌿 VitaCare — Health Companion App

A full-featured healthcare support web app built with React. Fully responsive for iOS, Android, Mac, and Windows.

## ✨ Features

### 🏠 Dashboard
- Real-time health stats (steps, calories, heart rate, active time)
- Today's schedule overview
- Hydration tracker with interactive glass toggle
- Daily goal rings (steps, medicines, active minutes, sleep)
- Health tips card

### 📅 Schedule
- Add/manage walk, run, nap, and medicine schedules
- Mark items as done/pending
- Progress bar for daily completion
- Filter by type (walk, run, nap, med)

### 💊 Medicines
- Track all medications with dose schedules
- Mark individual doses as taken
- Adherence percentage tracker
- Add new medicine reminders

### 🏃 Activity Tracker
- Real-time walk/run/nap tracking with live timer
- Steps counter (auto-increments during walk)
- Weekly steps bar chart
- Calories burned & active minutes widgets

### 🍃 Recipe Vault
- Save healthy recipes with ingredients & instructions
- Search by name or tags
- Filter by category (Breakfast, Smoothie, Drink, etc.)
- Expandable recipe detail cards

### 🤖 VitaBot AI Chat
- Powered by Claude (Anthropic API)
- Answers health, nutrition, exercise, sleep questions
- Suggested quick questions
- Streaming chat interface

### 👤 Patient Registration
- 4-step form (Personal Info → Health Details → Preferences → Review)
- Live BMI calculator
- Condition & goal selection
- Doctor info storage

### ⚡ Top Activity Bar
- Walk steps counter (live)
- Run timer (live)
- Nap timer (live)
- Medicine completion tracker
- Tap pills to start/stop tracking
- Pulsing animation when tracking is active

## 🚀 Setup

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

## 📱 Responsive Design
- **Mobile (iOS/Android)**: Collapsible sidebar, stacked layouts, touch-friendly buttons
- **Tablet**: Two-column grids, slide-out drawer
- **Desktop (Mac/Windows)**: Full sidebar, multi-column layouts, hover effects

## 🛠 Tech Stack
- React 18
- Lucide React (icons)
- CSS Custom Properties (theming)
- Anthropic Claude API (chatbot)
- No external UI library (100% custom CSS)

## 🎨 Design System
- **Font**: Syne (headings) + DM Sans (body)
- **Primary Color**: Deep Forest Green (#0a4f3c)
- **Accent**: Coral, Amber, Blue, Purple
- **Radius**: Soft rounded cards (20px)
- **Motion**: Fade-up animations, progress transitions
