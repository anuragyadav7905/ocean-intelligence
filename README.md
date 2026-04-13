# Ocean.Net — AI-Powered Conversational System for Marine Knowledge Exploration

> **Capstone Research Project** | LPU University Research Division

Ocean.Net is a full-stack web application that combines Natural Language Processing, Machine Learning, and interactive data visualization to make marine science knowledge accessible through a conversational AI interface.

---

## 🌊 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite + Tailwind CSS + Framer Motion |
| Backend | Python Flask + NLTK + Scikit-learn |
| NLP | TF-IDF Vectorizer + Cosine Similarity |
| Classification | Naive Bayes Intent Classifier |
| Data | 50+ marine Q&A entries across 8 categories |

## 🏗️ Project Structure

```
ocean/
├── frontend/          # React + Vite + Tailwind app
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Hero.jsx
│   │   │   ├── About.jsx         # AEGFA Methodology
│   │   │   ├── Features.jsx      # Core Capabilities
│   │   │   ├── Pipeline.jsx      # AEGFA Pipeline
│   │   │   ├── Chatbot.jsx       # Functional AI Chat
│   │   │   ├── Benchmarking.jsx  # Accuracy Charts
│   │   │   ├── Datasets.jsx      # Data Tables
│   │   │   ├── Team.jsx          # Research Team
│   │   │   └── Footer.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── tailwind.config.js
│   └── package.json
├── backend/
│   ├── app.py             # Flask server
│   ├── nlp_engine.py      # TF-IDF + cosine similarity
│   ├── intent_classifier.py  # Naive Bayes classifier
│   ├── knowledge_base.json   # 50+ marine Q&A
│   └── requirements.txt
└── README.md
```

## 🚀 Quick Start

### 1. Start the Backend

```bash
cd backend
pip install -r requirements.txt
python app.py
```

Backend runs at http://localhost:5000

### 2. Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at http://localhost:5173

---

## 🤖 API

### `POST /api/chat`

```json
// Request
{ "message": "What causes coral bleaching?" }

// Response
{
  "response": "Coral bleaching occurs when...",
  "intent": "Coral Reefs",
  "confidence": 0.87,
  "category": "coral_reefs"
}
```

### `GET /api/health`
System health check.

---

## 🎨 Design System — The Abyssal Intelligence

- **Base**: `#041329` (deep-ocean navy)
- **Primary Accent**: `#4fdbc8` (bioluminescent teal)
- **Secondary**: `#4cd7f6` (cyan)
- **Typography**: Space Grotesk (headlines) + Inter (body)
- **Design Philosophy**: Glassmorphism layers, tonal depth, no hard borders

---

## 📊 AEGFA Methodology

Adaptive Ecological Graph Fusion Architecture (AEGFA):

1. **Multi-Modal Data Acquisition** — Satellite, sensor, climate indices
2. **Graph Node Embedding** — Marine variables as graph vectors
3. **Ecological Graph Attention** — Weighted environmental influences
4. **Adaptive Fusion** — Unified knowledge state
5. **Inference & Optimization** — Ensemble prediction at 0.92 F1

---

