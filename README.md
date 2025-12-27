# ⚡ Zappy – Mini Vendor Event Day Tracker

🚀 **Live Project:** https://zappy-vendor.netlify.app/  
🧑‍💻 Built by **Vivek Joshi** – Full Stack Developer (Internship Assessment Project)

---

## 📝 Overview

**Zappy** is a sophisticated web application that simulates real-life vendor operations during event days, enabling task validation through **photo verification, GPS tracking, OTP workflow, and status reporting**.

Designed with a **mobile-first approach**, the UI showcases premium, high-end visuals including **Glassmorphism + Mesh Gradients + Framer Motion animations**, providing a production-grade experience.

---

## ✨ Core Features

### 🔐 1️⃣ Secure Vendor Authentication
- Mock authentication system
- Login Credentials → **Username:** `zappy_vendor` | **Password:** `password123`

### 📍 2️⃣ Verified Vendor Check-In
- Captures **live Geo-Location (Lat & Long)**
- Requires a **photo captured from device camera**
- Logs arrival time **automatically**

### 🔢 3️⃣ Dual-Stage OTP Verification
| Stage | Code |
|--------|--------|
| Event Start OTP | `1234` |
| Event End OTP | `5678` |

Both are required to unlock setup phase & complete process securely.

### 📸 4️⃣ Interactive Setup Progress
- Upload **Pre-Setup** & **Post-Setup** photos
- Add written notes / execution details
- Smooth form progress using animated UI transitions

### 🧾 5️⃣ Proof-of-Work Dashboard (WOW Page)
- After completion, MongoDB-synced summary displays:
  - Timestamps
  - Image gallery (masonry layout)
  - Verification audit trail

---

## 🛠 Tech Stack

| Layer | Tools |
|--------|--------|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS |
| Animations | Framer Motion (micro-interactions + transitions) |
| Backend | Next.js Route Handlers (Serverless APIs) |
| Database | MongoDB + Mongoose |
| Icons | Lucide-React |

---

## 🧱 Architectural Highlights

- 🗄 **Base64 Image Storage** inside MongoDB  
  → avoids extra config like S3 / Cloudinary – perfect for internship reviewers  
- 🔁 **Stateful Wizard UI** using AnimatePresence to reduce cognitive overload  
- 🧩 **Modular API** using one dynamic endpoint → `/api/event`  
  - **POST** → update status & upload data  
  - **GET** → fetch history / summary  
- 💠 **Glassmorphism UI** using backdrop-blur + mesh gradients for enterprise polish  

---

## ⚙️ Local Setup & Installation

```bash
# Clone project
git clone https://github.com/your-username/zappy-tracker.git
cd zappy-tracker

# Install dependencies
npm install
```

### 🔐 Environment Variables
Create a `.env.local` file:

```env
MONGODB_URI=your_mongodb_connection_string
```

### ▶️ Run Development Server
```bash
npm run dev
```

Now open 👉 http://localhost:3000

---

## 🧪 Test Credentials

| Item | Value |
|------|-------|
| Username | `zappy_vendor` |
| Password | `password123` |
| Start OTP | `1234` |
| End OTP | `5678` |

---

## 👤 Author – Vivek Joshi
Full Stack Developer  
💼 LinkedIn — *add link here*  
🌐 Portfolio — *add link here*  

---

> Developed with ❤️ as part of the official **Zappy Internship Assessment Project**
