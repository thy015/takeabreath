# Take A Breath - Hotel Booking App

Welcome to the Take A Breath app! This application is designed to help users find and book hotels effortlessly, providing a seamless experience for planning their perfect getaway. Built with ReactJS, NodeJS, and MongoDB, Take A Breath aims to offer a user-friendly interface and robust backend functionality.

## 🛠️ Tech Stack
### Frontend:
- **ReactJS**: Component-based UI development.
- **Redux**: State management.
- **TailwindCSS** and **SCSS**: Styling.
- **Ant Design (Antd)**: UI components.

### Backend:
- **NodeJS**: JavaScript runtime.
- **ExpressJS**: Backend framework.
- **MongoDB**: Database.
- **JWT**: Authentication and Authorization.

### Deployment:
- **Vercel**: For deploying the application.
- **Link**: [TakeABreath](https://takeabreath.io.vn/)

---

## 🔗 Live Demo
[TakeABreath - Live Demo](#)

---

## 🚀 How to Run the Project

### Without Installation (Using Docker)
1. Navigate to the project root directory:
   ```bash
   cd root
    ```
2. Run the following command:
    ```bash
    docker-compose up
    ```
3. Open your browser and visit `http://localhost:3000/`.

### With Installation
1. Clone the repository:
    ```bash
    git clone https://github.com/thy015/takeabreath.git
    ```
2. Navigate to the project client directory:
    ```bash
    cd client
    ```
   Install the dependencies:
    ```bash
    npm install
    ```
    ```bash
    pnpm install
    ```
3. Navigate to the project server directory:
    ```bash
    cd server
    ```
   Install the dependencies:
    ```bash
    npm install
    ```
    ```bash
    pnpm install
    ```
4. Start the client and server:
    client
    ```bash
    npm start
    ```
    server
    ```bash
    npm run dev
    ```
📂 Project Structure
```
takeabreath/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── hooks/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── styles/
│   │   ├── localData/
│   │   ├── partials/
│   │   ├── routers/
│   │   └── ...
│   ├── .env
│   ├── package.json
│   ├── pnpm-lock.yaml
│   └── ...
├── server/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── .env
│   ├── package.json
│   ├── pnpm-lock.yaml
│   ├── server.ts
│   └── ...
├── docker-compose.yml
├── README.md
└── ...
```

💡 Additional Notes

    Ensure you have Docker installed if you want to run the project without manual installation.
    For any issues or inquiries, please create an issue.
Reach me for any queries or suggestions. I am always open🌟
