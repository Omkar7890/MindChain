# MindChain

MindChain is now a simple MERN full-stack wellness marketplace that helps users discover, buy, and track mindfulness workshops.

## 🧠 Overview

This version of MindChain focuses on a clean React frontend paired with an Express + MongoDB backend. Users can sign in, explore workshops, and track their activity and rewards without any blockchain dependency.

## ✨ Key Features

- Browse and purchase wellness workshops
- Track activity rewards and workshop transactions
- Clean responsive UI built with React and Tailwind CSS
- Backend-powered user and workshop management with MongoDB

## 🛠️ Technology Stack

- Frontend: React, Tailwind CSS, React Context API
- Backend: Node.js, Express, MongoDB, Mongoose
- Development: npm, local MongoDB

## 📦 Project Structure

```
MindChain/
├── frontend/                # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── context/         # React Context providers
│   │   ├── hooks/           # Custom React hooks
│   │   ├── data/            # App constants and static data
│   │   └── pages/           # Application pages
│   └── public/              # Public assets
├── backend/                 # Express server
│   ├── database/            # MongoDB connection
│   ├── model/               # Mongoose schemas
│   ├── routes/              # API endpoints
│   └── index.js             # Backend entry point
└── README.md                # Project documentation
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm
- MongoDB

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/omkar7890/MindChain.git
cd MindChain
```

2. **Start the backend**

```bash
cd backend
npm install
npm start
```

The backend runs on http://localhost:5000

3. **Start the frontend**

```bash
cd ../frontend
npm install
npm start
```

The frontend runs on http://localhost:3000

## ⚙️ Notes

- The backend API is configured for local development.
- No blockchain wallet or smart contract setup is required.

---

## 👤 Project Maintainer

- **Omkar Parjane** — full-stack developer behind the MERN wellness marketplace.
  - GitHub:(https://github.com/Omkar7890)
  - LinkedIn:(https://www.linkedin.com/in/omkar-parjane)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  <b>Be kind to your mind, it will be fine.</b>
</p>

<div align="center">

[![Live Site](https://img.shields.io/badge/Visit_Live_Site-mind--chain.vercel.app-f58b44?style=for-the-badge)](https://mind-chain.vercel.app/)

</div>
