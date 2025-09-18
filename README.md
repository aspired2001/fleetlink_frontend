# 🚚 FleetLink Frontend

A **modern and responsive frontend** for the **FleetLink Logistics Vehicle Booking System**, built with **React, Redux Toolkit, Tailwind CSS, and Radix UI**.  
This application allows users to **browse vehicles, book logistics services, and manage bookings** through a clean and intuitive interface.

---

## ✨ Features

- ⚡ **React 19 with CRA (Create React App)** setup for rapid development  
- 🎨 **Tailwind CSS + Tailwind Animate** for fast, utility-first styling  
- 🧩 **Radix UI** components (Alert Dialogs, Toasts, Labels, Selects) for accessibility  
- ⚙️ **Redux Toolkit & React-Redux** for state management  
- 🌐 **React Router DOM v7** for seamless client-side routing  
- 📡 Integrated with backend APIs for vehicle and booking management  
- 💅 Reusable and themeable components with `clsx` and `tailwind-merge`  
- ✅ Strict TypeScript types with `@types/react` and `@types/react-dom`  
- 💻 Responsive design optimized for all devices  

---

## 📂 Project Structure

fleetlink_frontend/
├── public/ # Static assets (favicon, index.html, etc.)
├── src/
│ ├── components/ # Reusable UI components
│ ├── pages/ # Application pages (Home, Vehicles, Bookings)
│ ├── redux/ # Redux Toolkit slices & store setup
│ ├── styles/ # Tailwind and global CSS
│ ├── App.js # Root app component
│ ├── index.js # Entry point
│ └── ...
├── .env # Environment variables (API URLs)
├── package.json # Project dependencies and scripts
├── tailwind.config.js # TailwindCSS configuration
└── README.md

yaml
Copy code

---

## ⚙️ Environment Variables

Create a `.env` file in the project root and add:

```env
# Base URLs for API Endpoints
REACT_APP_BOOKING_API_URL=http://localhost:3000/api/bookings
REACT_APP_VEHICLE_API_URL=http://localhost:3000/api/vehicles

# Optional fallback (legacy)
REACT_APP_API_URL=http://localhost:3000
⚠️ These URLs should point to your FleetLink backend running locally or on a server.

🚀 Getting Started
Follow these steps to run the project locally:

1. Clone the Repository
bash
Copy code
git clone https://github.com/your-username/fleetlink_frontend.git
cd fleetlink_frontend
2. Install Dependencies
bash
Copy code
npm install
3. Configure Environment
Create a .env file as shown above with correct API URLs.

4. Start the Development Server
bash
Copy code
npm start
Your app will be available at http://localhost:3000

📦 Available Scripts
Command	Description
npm start	Runs the app in development mode
npm run build	Builds the app for production
npm test	Runs test suite
npm run eject	Ejects the CRA configuration (advanced)

🎨 Styling
Tailwind CSS is used for utility-first styling.

tailwind-merge ensures class conflict resolution.

tailwindcss-animate adds smooth transitions and animations.

tailwind.config.js is fully customized with theme colors and keyframes.

🧩 UI Components
This project uses:

Radix UI Primitives (@radix-ui/react-*) for accessible UI elements

lucide-react icons

Reusable shadcn-inspired UI components in /components/ui
