# Question Tracker Sheet

A React and Vite dashboard for organizing and tracking coding-practice questions by topic and sub-topic. The interface is designed around the Striver SDE Sheet and supports searching, difficulty filtering, progress tracking, and drag-and-drop question ordering.

## Features

- Browse topics, sub-topics, and coding questions.
- Add topics, sub-topics, and questions through modal forms.
- Require all modal fields before submission.
- Search by topic, sub-topic, or question title.
- Filter questions by Easy, Medium, or Hard difficulty.
- Mark questions as solved and view topic progress.
- Reorder questions with drag and drop.
- Minimize individual topics to focus on the sections you need.
- Open problem and YouTube solution links directly from the list.
- Responsive sidebar with desktop collapse and mobile drawer behavior.
- Loads the remote sheet API with local fallback data when the request fails.

## Requirements

- Node.js 18 or newer
- npm

## Getting Started

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Vite will print the local development URL in the terminal.

## Available Commands

| Command           | Description                                        |
| ----------------- | -------------------------------------------------- |
| `npm run dev`     | Start the Vite development server with hot reload. |
| `npm run build`   | Create a production build in `dist/`.              |
| `npm run preview` | Preview the production build locally.              |
| `npm run lint`    | Run ESLint across the project.                     |

## Configuration

The app uses the public Striver SDE Sheet endpoint by default. To use another compatible endpoint, create a `.env` file in the project root:

```env
VITE_SHEET_API_URL=https://example.com/api/sheet
```

The API response is normalized in `src/services/api.js`. If the request fails or returns no questions, the app uses its local fallback sheet.

## Project Structure

```text
src/
├── components/       Reusable modal and question-list components
├── services/         Remote sheet loading and local data operations
├── store/            Zustand sheet state
├── App.jsx           Dashboard layout and interaction logic
├── App.css           Legacy shared styles
├── index.css         Global styles and Tailwind import
└── main.jsx          React application entry point
```

## Tech Stack

- React 19
- Vite
- Tailwind CSS
- Zustand
- Lucide React
- `@hello-pangea/dnd`
