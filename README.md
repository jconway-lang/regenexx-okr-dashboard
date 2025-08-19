# Regenexx OKR Dashboard

A modern, attractive OKR (Objectives and Key Results) dashboard built with React and TypeScript. This application provides a comprehensive platform for tracking objectives, key results, and initiatives with a clean, light interface.

## Features

### 🎯 Objectives & Key Results
- Create and manage objectives with descriptions and timeframes
- Track progress with visual progress bars
- Quarter and year-based organization
- Automatic status calculation based on progress

### 🚀 Initiatives
- Separate tracking for key initiatives
- Priority levels and status tracking
- Timeline tracking with start and due dates

### 📊 Dashboard Analytics
- Real-time progress tracking
- Overall completion statistics
- Visual status indicators with color coding
- Progress bars for all items

### 🔍 Advanced Features
- Search functionality across all items
- Filter by status
- Data persistence using local storage
- Responsive design for all screen sizes

## Technology Stack

- **React 18** with TypeScript for type safety
- **Tailwind CSS** for modern styling
- **Lucide React** for beautiful icons
- **Local Storage** for data persistence

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open your browser and navigate to `http://localhost:3000`

### Building for Production

```bash
npm run build
```

## Usage

### Adding Objectives

1. Click "Add Objective" button
2. The system will create a new objective with default values
3. You can edit the title, description, quarter, and year
4. Progress is automatically calculated based on key results

### Adding Initiatives

1. Switch to the "Initiatives" tab
2. Click "Add Initiative" button
3. The system will create a new initiative with default values
4. You can edit the title, description, status, and priority

### Tracking Progress

- Progress is automatically calculated and displayed
- Status indicators show at-a-glance progress
- Overall dashboard statistics update in real-time

### Search and Filter

- Use the search bar to find specific objectives or initiatives
- Filter by status (Completed, On Track, At Risk, Behind)
- Real-time filtering and search

## Project Structure

```
src/
├── components/          # React components
│   └── Dashboard.tsx   # Main dashboard component
├── types/              # TypeScript type definitions
│   └── index.ts
├── utils/              # Utility functions
│   ├── storage.ts      # Local storage management
│   └── helpers.ts      # Helper functions
├── App.tsx             # Main app component
├── index.tsx           # Application entry point
└── index.css           # Global styles
```

## Data Persistence

All data is stored locally in your browser's localStorage, so your objectives, key results, and initiatives will persist between sessions. You can clear all data by clearing your browser's local storage if needed.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Current Status

✅ **Fully functional and running!**
- Basic OKR dashboard with objectives and initiatives
- Search and filtering capabilities
- Data persistence
- Responsive design
- Real-time progress tracking

## Next Steps

The dashboard is currently functional with basic features. Future enhancements could include:
- Form-based editing for objectives and initiatives
- Key results management within objectives
- More detailed progress tracking
- Export functionality
- User authentication
- Backend integration

## License

This project is licensed under the MIT License.
