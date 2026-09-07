````markdown
# 🛡️ Personnel Wellness — Commander Dashboard

A web-based **Commander Dashboard** developed as a prototype for the **Smart India Hackathon (SIH)**. It provides commanders with an aggregated view of personnel wellness, unit-level risk indicators, and wellness trends while maintaining personnel privacy.

## ✨ Features

- 📊 Overall personnel wellness summary
- 🟢 Normal, 🟠 Watch, and 🔴 High Risk distribution
- 📈 14-day wellness trend visualization
- 🪖 Unit-wise wellness status
- 💡 Key wellness insights
- 🔄 Dashboard refresh functionality
- 🔐 Aggregated unit-level information
- 🚫 No individual personnel names or individual risk scores displayed

## 🛠️ Tech Stack

### Frontend
- React
- Vite
- JavaScript
- Plain CSS
- Lucide Icons

### Backend
- Node.js
- Express.js
- CORS

### Data Storage
- JSON file for demonstration purposes
- Designed to be replaceable with PostgreSQL or another production database

## 📁 Project Structure

```text
commander-dashboard/
├── client/
│   ├── src/
│   │   ├── main.jsx
│   │   └── styles.css
│   ├── index.html
│   └── package.json
│
├── server/
│   ├── data/
│   │   └── dashboard.json
│   ├── server.js
│   └── package.json
│
└── README.md
````

## 🚀 Run Locally

### 1. Clone the Repository

```bash
git clone https://github.com/Arushi-1706/commander-dashboard.git
cd commander-dashboard
```

### 2. Start the Backend

```bash
cd server
npm install
npm run dev
```

The backend will run at:

```text
http://localhost:5000
```

### 3. Start the Frontend

Open a new terminal:

```bash
cd client
npm install
npm run dev
```

The frontend will run at:

```text
http://localhost:5173
```

Open the frontend URL in your browser.

## 🔌 API Endpoints

| Method | Endpoint                     | Description                       |
| ------ | ---------------------------- | --------------------------------- |
| GET    | `/api/health`                | Check backend health              |
| GET    | `/api/commander/dashboard`   | Retrieve complete dashboard data  |
| GET    | `/api/commander/units/:name` | Retrieve data for a specific unit |
| POST   | `/api/commander/refresh`     | Refresh dashboard data            |

## 🌐 Live Demo

### Frontend

[https://commander-dashboard-frontend.onrender.com](https://commander-dashboard-frontend.onrender.com)

### Backend

[https://commander-dashboard-npih.onrender.com](https://commander-dashboard-npih.onrender.com)

## 🔐 Privacy & Data Design

The Commander Dashboard is intentionally designed to expose only **aggregated unit-level information**.

The dashboard does not display:

* Individual personnel names
* Individual risk scores
* Personally identifiable information

The backend maintains the dashboard data and acts as the **source of truth**, rather than relying on the frontend to store or manage the data.

## 🗄️ Data Persistence

For this prototype, dashboard information is stored in a JSON file:

```text
server/data/dashboard.json
```

For a production deployment, this can be replaced with a secure database such as **PostgreSQL**.

## 🎯 Project Objective

The objective of the Commander Dashboard is to provide commanders with a simple, actionable, and privacy-conscious view of personnel wellness.

It enables commanders to:

* Monitor overall unit wellness
* Identify units requiring attention
* Track wellness trends
* View high-level risk distribution
* Make informed decisions without exposing individual personnel data

## 🚀 Future Enhancements

* PostgreSQL database integration
* Secure authentication and role-based access
* Real-time dashboard updates
* Advanced analytics and trend detection
* Automated wellness alerts
* Historical reporting
* Secure deployment and production-grade infrastructure

---

### Smart India Hackathon (SIH)

**Personnel Wellness — Commander Dashboard**

A prototype focused on **personnel wellness, privacy, monitoring, and actionable unit-level insights**.

```

Available next action: :contentReference[oaicite:0]{index=0}
```

