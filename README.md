# Aalim AI

Aalim AI is your personal digital Islamic scholar — a modern tool with a timeless mission: **to make authentic Islamic knowledge accessible, conversational, and personalized** for every Muslim, no matter where they are.

---

## Vision

Millions of Muslims have questions every day — from fiqh to faith, daily life to deep theology — but reliable access to a qualified scholar isn’t always available. Aalim AI exists to fill that gap with dignity, respect, and precision.

This isn’t just another chatbot. It’s a carefully built AI companion that aims to **preserve the sanctity of Islamic knowledge** while offering the ease of a chat-based experience.

---

## What Makes Aalim AI Different?

- **Built for Deen, not dopamine**  
  Unlike generic bots or search engines, Aalim AI is **trained specifically on curated Islamic texts**, not just scraped web junk.

- **Conversational but cautious**  
  It's designed to respond **like a thoughtful aalim would** — with sources, context, and humility when things aren’t clear.

- **Custom fine-tuning + vector search**  
  We use a **Chroma DB** for smart, semantic retrieval of Quranic, Hadith, and Fiqh data. It's not just a GPT with an Islamic theme slapped on top.

- **Multi-platform ready**  
  Web app, WhatsApp bot, mobile app – one brain, multiple interfaces.

---

## Under the Hood

- **Backend**: FastAPI serving an LLM (Gemini, LLaMA, or similar)
- **Frontend**: React + Tailwind (Vite-based, Firebase-integrated)
- **Auth & Storage**: Firebase for user login and chat history
- **Vector DB**: Chroma for fast, semantic retrieval of Islamic knowledge
- **Deployment**: Docker-ready, self-hostable API

---

## Data Sources

> *“Say: Bring your proof if you are truthful.”* — Qur'an 2:111

- Qur'an with tafsir
- Sahih Bukhari & Sahih Muslim
- Reliable fiqh resources (Salafi primarily, with support for others)
- Handpicked fatwas and classical texts
- Transcripts of Shiekh Assim-Al-Hakeem and Zakir Naiq Youtube Videos
- Manual curation to filter weak or unverified content

(Exact dataset details and citations available in `/SERVER/data`)

---

## 👤 Who It's For

- Students of knowledge looking for quick cross-references
- Muslims seeking clarity on everyday rulings
- Developers building faith-first products
- Anyone who wants Islamic answers with less Google, more guidance

---

_________________________
# AalimAi Project Code Documentation

## Overview
AalimAi is a comprehensive project that includes a backend server, a web frontend, and a mobile app frontend. The project is designed to provide Islamic resources, including Hadiths, Tafseer, and other Islamic content, through a user-friendly interface.

## Project Structure
The project is organized into three main components:

1. **SERVER/**: Contains the backend logic for data ingestion, querying, and database management.
2. **CLIENT/**: Contains the frontend logic, divided into `mobile/` for the mobile app and `web/` for the web application.

### SERVER/
The backend is implemented in Python and includes the following key files and directories:

- **main.py**: The entry point for the backend server.
- **ingest_db.py**: Handles data ingestion into the database.
- **query_rag.py**: Manages retrieval-augmented generation queries.
- **requirements.txt**: Lists the Python dependencies.
- **data/**: Contains datasets used for the application.
- **db/**: Stores the database files.
- **scripts/**: Includes utility scripts for data processing and scraping.
- **transcripts/**: Contains transcript files for various Islamic scholars.

### CLIENT/
The frontend is divided into two subdirectories:

#### mobile/
The mobile app is built using React Native and Expo. Key files and directories include:

- **app.json**: Configuration for the Expo app.
- **api/**: Contains API interaction logic (e.g., `auth.ts`, `chat.ts`).
- **components/**: Reusable UI components (e.g., `ChatInput.tsx`, `Sidebar.tsx`).
- **constants/**: Stores constant values (e.g., `Colors.ts`).
- **context/**: Manages global state (e.g., `ThemeContext.tsx`).
- **hooks/**: Custom React hooks.
- **screens/**: Contains screen components for navigation.
- **scripts/**: Utility scripts (e.g., `reset-project.js`).
- **types/**: TypeScript type definitions.

#### web/
The web app is built using React and Vite. Key files and directories include:

- **index.html**: The main HTML file.
- **src/**: Contains the source code for the web app.
  - **App.tsx**: The main React component.
  - **firebase.tsx**: Firebase configuration.
  - **components/**: Reusable UI components.
  - **context/**: Manages global state.
  - **hooks/**: Custom React hooks.
  - **pages/**: Contains page components for routing.
  - **services/**: API interaction logic.
  - **types/**: TypeScript type definitions.
- **public/**: Static assets (e.g., `masjid.png`, `mosque.svg`).
- **tailwind.config.js**: Tailwind CSS configuration.
- **vite.config.ts**: Vite configuration.

## Setup Instructions

### Backend (SERVER/)
1. Navigate to the `SERVER/` directory:
   ```bash
   cd SERVER
   ```
2. Create a virtual environment and activate it:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```
3. Install the dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run the server:
   ```bash
   python main.py
   ```

### Mobile App (CLIENT/mobile/)
1. Navigate to the `mobile/` directory:
   ```bash
   cd CLIENT/mobile
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Start the Expo development server:
   ```bash
   npm start
   ```

### Web App (CLIENT/web/)
1. Navigate to the `web/` directory:
   ```bash
   cd CLIENT/web
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Key Features

### Backend
- Data ingestion and management for Islamic resources.
- Retrieval-augmented generation for advanced querying.
- Database management using SQLite.

### Mobile App
- User-friendly interface for accessing Islamic content.
- Chat and authentication features.
- Themed UI with reusable components.

### Web App
- Responsive design for desktop and mobile browsers.
- Integration with Firebase for backend services.
- Modular and scalable architecture.

## Contributing
1. Fork the repository.
2. Create a new branch for your feature or bug fix:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Description of changes"
   ```
4. Push to your branch:
   ```bash
   git push origin feature-name
   ```
5. Create a pull request.

## License
This project is licensed under the MIT License. See the `LICENSE` file for details.

## Contact
For any inquiries or support, please contact the project maintainers.