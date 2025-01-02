# Shop Together

## Real-Time Collaborative Shopping Platform

### Overview
Shop Together is an innovative platform that enables users to browse and shop together in real-time, featuring synchronized browsing, voice chat, and collaborative shopping experiences.

### Features
- 🔐 Secure User Authentication
- 🛍️ Real-Time Product Browsing
- 🎙️ Voice Chat Collaboration
- 🔄 Synchronized Shopping Experience
- 📱 Responsive Web Design

### Technology Stack
#### Frontend
- React
- React Router
- Context API
- Socket.IO Client
- Axios

#### Backend
- Node.js
- Express.js
- MongoDB
- Socket.IO
- JSON Web Token (JWT)

### Prerequisites
- Node.js (v14 or later)
- MongoDB
- npm or Yarn

### Installation

1. Clone the Repository
```bash
git clone https://github.com/ZubeidHendricks/shop-together-real.git
cd shop-together-real
```

2. Install Server Dependencies
```bash
cd server
npm install
```

3. Install Client Dependencies
```bash
cd ../client
npm install
```

4. Set Up Environment Variables
Create a `.env` file in both `server` and `client` directories with the following variables:

Server `.env`:
```
PORT=3001
MONGODB_URI=mongodb://localhost:27017/shop-together
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:3000
```

Client `.env`:
```
REACT_APP_SERVER_URL=http://localhost:3001
```

### Running the Application

1. Start MongoDB
```bash
# Ensure MongoDB is running
mongod
```

2. Start Server
```bash
cd server
npm run dev
```

3. Start Client
```bash
cd client
npm start
```

### Docker Deployment
```bash
# Build and run with docker-compose
docker-compose up --build
```

### Testing
```bash
# Run server tests
cd server
npm test

# Run client tests
cd client
npm test
```

### Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### License
Distributed under the MIT License. See `LICENSE` for more information.

### Contact
Zubeid Hendricks - [Your Email or LinkedIn]

### Acknowledgements
- React
- Node.js
- Socket.IO
- MongoDB