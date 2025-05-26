📌 Project re-uploaded from a private fork of the CSC436 template by bodonnell-DePaul for visibility.

# Restaurant Management App

A full-stack restaurant dining app built with React, .NET Minimal API, and MongoDB Atlas. Features include role-based access, table selection, menu browsing, cart system, and order tracking.

## Tech Stack

- Frontend: React
- Backend: .NET 8 Minimal API
- Database: MongoDB Atlas
- Auth: OAuth (planned)
- UI: Role-based (Admin & User)

---

## ▶️ How to Run

### 🖥️ Backend (.NET API)

1. Navigate to the backend folder:
 - cd Backend
 - Update appsettings.json with your MongoDB connection string:

json
"MongoDbSettings": {
  "ConnectionString": "your-mongodb-uri",
  "DatabaseName": "restaurantdb"
}

Run the backend:
- dotnet run
- API runs at: http://localhost:5000 (or the port shown in terminal)

🌐 Frontend (React)
 Navigate to the frontend folder:
- cd Frontend

 Install dependencies:
- npm install

Start the app:
- npm start
- App will run at: http://localhost:3000