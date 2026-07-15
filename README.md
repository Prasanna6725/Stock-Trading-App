# SB Stocks — Virtual Stock Market & Paper Trading Platform

## Project Overview

**SB Stocks** is a comprehensive virtual stock market and paper trading platform designed for learning and practicing stock trading strategies risk-free using virtual money. It provides a complete MERN (MongoDB, Express, React, Node.js) full-stack application with role-based access, portfolio management, historical market analysis, and strategy testing capabilities.

This is a **paper trading application** — no real money is transacted, all trading uses virtual balances.

## Project Objective

Built as part of the SmartBridge internship program, SB Stocks enables users to:

- Register and manage secure accounts
- Trade stocks using virtual funds
- Create and manage multiple virtual portfolios
- Track profit/loss and portfolio performance
- Analyze historical price data
- Test and compare trading strategies
- Access an admin console for system monitoring

## Core Features

### User Features

1. ✅ User Registration & Authentication (secure JWT-based login)
2. ✅ Virtual Account Dashboard with balance, portfolio summary, and recent transactions
3. ✅ Browse and search US-listed stocks (10+ major stocks included)
4. ✅ View real-time stock prices and latest available market data
5. ✅ View detailed stock information and exchange data
6. ✅ Historical stock price charts and trending data
7. ✅ Buy stocks using virtual balance
8. ✅ Sell owned stocks from portfolio
9. ✅ Create multiple virtual portfolios with custom naming
10. ✅ Portfolio performance tracking with profit/loss calculations
11. ✅ View comprehensive transaction history (BUY/SELL records)
12. ✅ Order history with execution status
13. ✅ Analyze historical stock data using SMA Crossover strategy
14. ✅ Test and compare trading strategies against buy-and-hold baseline
15. ✅ User profile management (update username, contact info)
16. ✅ Secure logout functionality

### Admin Features

1. ✅ Secure admin login with role-based authorization
2. ✅ Admin Dashboard with system statistics
3. ✅ View all registered users with details
4. ✅ Monitor all orders across the system
5. ✅ Monitor all transactions (BUY/SELL activity)
6. ✅ View recent application activity
7. ✅ Stock information and charts access
8. ✅ Market data inspection

## Technical Architecture

### MVC Architecture Pattern

The backend follows the **Model-View-Controller** architecture:

- **Models**: MongoDB schemas (User, Stock, Portfolio, Order, Transaction)
- **Controllers**: Business logic and API response handlers
- **Routes**: REST API endpoint definitions
- **Middleware**: Authentication, authorization, error handling
- **Services**: Reusable business logic (stock data, strategy analysis)

### Technology Stack

**Frontend:**
- React 19+ with Vite bundler
- React Router for navigation
- Axios for HTTP requests
- React Context API for global state
- Recharts for data visualization
- Responsive CSS Grid & Flexbox

**Backend:**
- Node.js with Express.js
- MongoDB with Mongoose ODM
- JWT authentication with jsonwebtoken
- Password hashing with bcryptjs
- CORS for cross-origin requests
- dotenv for environment configuration
- Nodemon for development auto-reload

## Project Folder Structure

```
Stock-Trading-App/
├── client/                          # React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── axiosInstance.js    # HTTP client config
│   │   │   ├── AdminRoute.jsx      # Admin-only route wrapper
│   │   │   ├── ProtectedRoute.jsx  # Auth-required route wrapper
│   │   │   ├── Navbar.jsx          # Navigation header
│   │   │   ├── Login.jsx           # Login form
│   │   │   ├── Register.jsx        # Registration form
│   │   │   ├── StockCard.jsx       # Stock display component
│   │   │   ├── TradeModal.jsx      # Buy/Sell form
│   │   │   ├── LoadingSpinner.jsx  # Loading state
│   │   │   └── ErrorMessage.jsx    # Error display
│   │   ├── context/
│   │   │   └── GeneralContext.jsx  # Global auth & app state
│   │   ├── pages/
│   │   │   ├── Landing.jsx         # Public landing page
│   │   │   ├── Home.jsx            # Home redirects to Landing
│   │   │   ├── Dashboard.jsx       # User dashboard
│   │   │   ├── Stocks.jsx          # Browse & search stocks
│   │   │   ├── StockChart.jsx      # Stock details + trading
│   │   │   ├── Portfolio.jsx       # Portfolio management
│   │   │   ├── History.jsx         # Transaction history
│   │   │   ├── Profile.jsx         # User profile
│   │   │   ├── Admin.jsx           # Admin dashboard
│   │   │   ├── Users.jsx           # Admin users list
│   │   │   ├── AllOrders.jsx       # Admin orders list
│   │   │   ├── AllTransactions.jsx # Admin transactions list
│   │   │   └── AdminStockChart.jsx # Admin stock chart viewer
│   │   ├── App.jsx                 # Main router
│   │   ├── main.jsx                # React entry point
│   │   └── main.css                # Global styles
│   ├── index.html                  # HTML entry point
│   ├── vite.config.js              # Vite configuration
│   ├── package.json
│   └── .env.example

└── server/                          # Express Backend
    ├── config/
    │   └── db.js                   # MongoDB connection
    ├── controllers/
    │   ├── userController.js       # User auth & profile logic
    │   ├── stockController.js      # Stock & trading logic
    │   ├── portfolioController.js  # Portfolio logic
    │   ├── orderController.js      # Order logic
    │   └── adminController.js      # Admin dashboard logic
    ├── middlewares/
    │   └── authMiddleware.js       # JWT verification & authorization
    ├── models/
    │   ├── userModel.js            # User schema
    │   ├── stockSchema.js          # Stock schema
    │   ├── portfolioModel.js       # Portfolio schema
    │   ├── orderSchema.js          # Order schema
    │   └── transactionModel.js     # Transaction schema
    ├── routes/
    │   ├── userRoute.js            # User endpoints
    │   ├── stockRoute.js           # Stock endpoints
    │   ├── portfolioRoute.js       # Portfolio endpoints
    │   ├── transactionRoute.js     # Transaction endpoints
    │   ├── orderRoute.js           # Order endpoints
    │   └── adminRoute.js           # Admin endpoints
    ├── services/
    │   └── stockService.js         # Stock data & strategy analysis
    ├── scripts/
    │   ├── seedStocks.js           # Populate demo stocks
    │   └── createAdmin.js          # Create admin user
    ├── index.js                    # Server entry point
    ├── package.json
    ├── .env.example
    └── .gitignore
```

## Database Models

### User Model
- `username`: String (required, trimmed)
- `email`: String (required, unique, lowercase, trimmed)
- `password`: String (required, hashed with bcrypt, never returned in API)
- `contact`: String (optional)
- `role`: Enum (user, admin) - default: user
- `balance`: Number - virtual trading funds, default: ₹1,00,000 (100,000)
- `timestamps`: createdAt, updatedAt

### Stock Model
- `symbol`: String (required, unique, uppercase)
- `name`: String (required)
- `price`: Number (latest/current price)
- `stockExchange`: String (NASDAQ, NYSE, etc.)
- `sector`: String (Technology, Finance, etc.)
- `currency`: String - default: USD
- `previousClose`: Number
- `change`: Number (price change)
- `changePercent`: Number (percentage change)
- `historicalData`: Array of {date, open, high, low, close, volume}
- `source`: Enum (seed, api, fallback) - indicates data origin
- `marketStatus`: String (DEMO, LIVE)
- `timestamps`: createdAt, updatedAt

### Portfolio Model
- `user`: ObjectId reference to User (required)
- `name`: String (required, e.g., "Main Portfolio", "Growth Portfolio")
- `description`: String (optional)
- `holdings`: Array of {stock: ObjectId, symbol: String, quantity: Number, averageBuyPrice: Number}
- `timestamps`: createdAt, updatedAt

### Order Model
- `user`: ObjectId reference to User (required)
- `stock`: ObjectId reference to Stock
- `portfolio`: ObjectId reference to Portfolio
- `symbol`: String (required, uppercase)
- `quantity`: Number (required, > 0)
- `price`: Number (execution price)
- `totalAmount`: Number (quantity × price)
- `orderType`: Enum (BUY, SELL) - required
- `status`: Enum (PENDING, COMPLETED, FAILED, CANCELLED) - default: PENDING
- `executedAt`: Date
- `timestamps`: createdAt, updatedAt

### Transaction Model
- `user`: ObjectId reference to User (required)
- `stock`: ObjectId reference to Stock
- `portfolio`: ObjectId reference to Portfolio
- `symbol`: String (required, uppercase)
- `type`: Enum (BUY, SELL) - required
- `quantity`: Number (required, > 0)
- `price`: Number (execution price)
- `amount`: Number (total transaction value)
- `paymentMode`: String (VIRTUAL_BALANCE for paper trading)
- `time`: Date - default: now()
- `timestamps`: createdAt, updatedAt

## Entity Relationships

```
┌─────────────────────────────────────────────────────────────┐
│ User (1 user can have many)                                 │
├─────────────────────────────────────────────────────────────┤
│ - 1:Many → Portfolios                                       │
│ - 1:Many → Transactions                                     │
│ - 1:Many → Orders                                           │
└─────────────────────────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────────────────────────┐
│ Portfolio (belongs to 1 User)                               │
├─────────────────────────────────────────────────────────────┤
│ - holdings: Array of Stock references                       │
│ - Many:Many → Stocks (through holdings)                     │
│ - 1:Many → Transactions                                     │
└─────────────────────────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────────────────────────┐
│ Stock (shared across system)                                │
├─────────────────────────────────────────────────────────────┤
│ - Many:Many → Portfolios (through holdings)                 │
│ - 1:Many → Transactions                                     │
│ - 1:Many → Orders                                           │
└─────────────────────────────────────────────────────────────┘
```

## Authentication & Security

### Password Hashing
- Passwords are hashed using **bcryptjs** with salt rounds = 10
- Plain-text passwords are never stored or returned
- Password comparison uses `bcrypt.compare()` for verification

### JWT Authentication
- Tokens include user ID and role
- Expiration: 7 days
- Issued on login, stored in browser localStorage
- Attached to all protected requests via Authorization header
- Invalid or expired tokens trigger re-authentication

### Protected Routes
- Frontend checks token and redirects unauthenticated users to login
- Backend middleware verifies JWT on all protected endpoints
- Admin routes enforce role-based access (admin-only)
- Users cannot access another user's portfolios/transactions

### Authorization Levels
- **Public**: Landing, Login, Register
- **User**: Dashboard, Browse Stocks, Portfolio, History, Profile
- **Admin**: Admin Dashboard, Users, Orders, Transactions, Stocks

## Financial Validation

### Buy Transaction
1. Backend fetches fresh stock price (never trusts frontend)
2. Backend verifies user balance is sufficient
3. Weighted average buy price is calculated for existing holdings:
   ```
   newAverage = ((oldQty × oldPrice) + (newQty × currentPrice)) / (oldQty + newQty)
   ```
4. Portfolio holdings are updated atomically
5. Virtual balance is deducted
6. Transaction and Order records are created

### Sell Transaction
1. Backend verifies ownership of stock in selected portfolio
2. Backend verifies owned quantity is sufficient
3. Overselling is rejected with error message
4. Fresh stock price is fetched for sale value
5. Holdings are updated (removed if quantity = 0)
6. Virtual balance is credited
7. Transaction and Order records are created

## Stock Data

### External API Integration
If `STOCK_API_KEY` is configured:
- Backend attempts to fetch real-time data from market API
- Falls back gracefully if API is unavailable
- API endpoint calls never expose keys to frontend

### Fallback/Demo Data
- 10 major US stocks are seeded on first run (AAPL, MSFT, GOOGL, AMZN, TSLA, META, NVDA, NFLX, AMD, INTC)
- Deterministic historical data with sine-wave pattern for stability
- Prices remain consistent across requests (not randomized every call)
- Demo market status is clearly labeled in UI

### Historical Data
- 30-day historical price history included
- OHLCV data (open, high, low, close, volume)
- Used for charts and strategy analysis

## Strategy Analysis

### SMA Crossover (Simple Moving Average)
A simple educational strategy for testing historical performance:

1. **Parameters**: Short Window (default 5), Long Window (default 20)
2. **Logic**:
   - Calculate short-term moving average (5-day)
   - Calculate long-term moving average (20-day)
   - **Buy signal**: When short SMA crosses above long SMA
   - **Sell signal**: When short SMA crosses below long SMA
3. **Output**:
   - Number of signals/trades generated
   - Total strategy return percentage
   - Buy-and-hold return percentage
   - Comparison and interpretation
4. **Disclaimer**: "For educational and simulation purposes only. Not financial advice."

## API Endpoints

### User Endpoints

| Method | Route | Auth | Role | Purpose |
|--------|-------|------|------|---------|
| POST | `/api/users/register` | No | Public | Create new user account |
| POST | `/api/users/login` | No | Public | Authenticate user, return JWT |
| GET | `/api/users/profile` | Yes | User | Fetch authenticated user profile |
| PUT | `/api/users/profile` | Yes | User | Update profile (username, contact) |
| GET | `/api/users` | Yes | Admin | List all users |

### Stock Endpoints

| Method | Route | Auth | Role | Purpose |
|--------|-------|------|------|---------|
| GET | `/api/stocks` | No | Public | List all stocks with latest prices |
| GET | `/api/stocks/search?query=AAPL` | No | Public | Search stocks by symbol/name |
| GET | `/api/stocks/:symbol` | No | Public | Get stock details |
| GET | `/api/stocks/:symbol/history` | No | Public | Get 30-day historical data |
| POST | `/api/stocks/:symbol/analyze` | No | Public | Run SMA crossover analysis |

### Portfolio Endpoints

| Method | Route | Auth | Role | Purpose |
|--------|-------|------|------|---------|
| POST | `/api/portfolios` | Yes | User | Create portfolio |
| GET | `/api/portfolios` | Yes | User | List user's portfolios |
| GET | `/api/portfolios/:id` | Yes | User | Get portfolio details |
| PUT | `/api/portfolios/:id` | Yes | User | Update portfolio |
| DELETE | `/api/portfolios/:id` | Yes | User | Delete portfolio |

### Transaction Endpoints

| Method | Route | Auth | Role | Purpose |
|--------|-------|------|------|---------|
| POST | `/api/transactions/buy` | Yes | User | Execute buy transaction |
| POST | `/api/transactions/sell` | Yes | User | Execute sell transaction |
| GET | `/api/transactions/history` | Yes | User | Get user's transaction history |
| GET | `/api/transactions/all` | Yes | Admin | Get all transactions |

### Order Endpoints

| Method | Route | Auth | Role | Purpose |
|--------|-------|------|------|---------|
| GET | `/api/orders` | Yes | User | Get user's orders |
| GET | `/api/orders/admin` | Yes | Admin | Get all orders |

### Admin Endpoints

| Method | Route | Auth | Role | Purpose |
|--------|-------|------|------|---------|
| GET | `/api/admin/dashboard` | Yes | Admin | Get system statistics |
| GET | `/api/admin/users` | Yes | Admin | List all users |
| GET | `/api/admin/orders` | Yes | Admin | List all orders |
| GET | `/api/admin/transactions` | Yes | Admin | List all transactions |
| GET | `/api/admin/stocks` | Yes | Admin | List all stocks |

## User Flows

### Registration Flow
```
Landing → Register Page
      → Enter: username, email, password, contact
      → Validate inputs
      → Check email uniqueness
      → Hash password
      → Create user account
      → Create default portfolio
      → Show success message
      → Redirect to Login
```

### Login Flow
```
Landing → Login Page
      → Enter: email, password
      → Verify user exists
      → Compare hashed password
      → Generate JWT token
      → Store token in localStorage
      → Update auth context
      → Redirect to Dashboard
```

### Trading Flow (Buy)
```
Dashboard → Browse Stocks → Stock Details
        → Select Portfolio and Quantity
        → Click Buy
        → Backend: Verify balance
        → Backend: Fetch current price
        → Backend: Calculate total amount
        → Backend: Update holdings (with weighted average)
        → Backend: Deduct from balance
        → Backend: Create transaction & order records
        → Update portfolio on frontend
        → Show success confirmation
```

### Trading Flow (Sell)
```
Portfolio → View Holdings
        → Click Sell on Stock
        → Verify owned quantity
        → Backend: Fetch current price
        → Backend: Verify ownership
        → Backend: Update holdings or remove
        → Backend: Add to balance
        → Backend: Create transaction & order records
        → Update portfolio on frontend
        → Show success confirmation
```

## Environment Variables

### Backend (`server/.env`)

```env
MONGO_URI=mongodb://localhost:27017/sbstocks
PORT=8000
JWT_SECRET=your_super_secret_jwt_key
STOCK_API_KEY=optional_external_api_key
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=secure_admin_password
```

### Frontend (`client/.env`)

```env
VITE_API_URL=http://localhost:8000/api
```

## Installation & Setup

### Prerequisites
- Node.js 16+ and npm
- MongoDB local instance or MongoDB Atlas connection
- Git

### Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret

# Seed demo stocks
npm run seed

# Create admin user
npm run create-admin

# Start backend server
npm run dev
```

Backend runs on `http://localhost:8000`

### Frontend Setup

```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Edit .env if needed (default http://localhost:8000/api should work)

# Start frontend development server
npm run dev
```

Frontend runs on `http://localhost:5173`

### Production Build

```bash
# Frontend production build
cd client
npm run build
# Output in client/dist/
```

## MongoDB Connection

### Local MongoDB

```bash
# Start MongoDB (if installed locally)
mongod
```

Default connection: `mongodb://localhost:27017/sbstocks`

### MongoDB Atlas (Cloud)

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/sbstocks?retryWrites=true&w=majority
```

## Development Scripts

### Backend

```bash
npm run dev        # Start with nodemon (auto-reload)
npm start          # Start production server
npm run seed       # Populate demo stocks
npm run create-admin  # Create admin user
```

### Frontend

```bash
npm run dev        # Start Vite dev server
npm run build      # Build for production
npm run preview    # Preview production build locally
```

## Testing the Application

### Quick Verification Checklist

**Backend:**
1. ✅ MongoDB connects successfully
2. ✅ Server starts on port 8000
3. ✅ `/api/health` returns OK
4. ✅ Stock seeding populates demo data
5. ✅ Admin creation works
6. ✅ Registration creates users
7. ✅ Login generates JWT tokens
8. ✅ Protected routes reject unauthorized access
9. ✅ Buy/Sell transactions work correctly
10. ✅ Portfolio calculations are accurate

**Frontend:**
1. ✅ Landing page loads
2. ✅ Registration form validates
3. ✅ Login form authenticates
4. ✅ Dashboard shows real balance
5. ✅ Stock browse and search work
6. ✅ Stock details display charts
7. ✅ Buy/Sell modals appear
8. ✅ Portfolio page shows holdings
9. ✅ History displays transactions
10. ✅ Admin pages show system data

## Security Considerations

1. **Password Storage**: Passwords hashed with bcryptjs (10 rounds)
2. **JWT Secrets**: Use strong, random secrets in production
3. **Environment Variables**: Never commit `.env` files with real secrets
4. **CORS**: Backend configured to accept frontend requests
5. **Role-Based Access**: Backend enforces admin-only endpoints
6. **Financial Validation**: Server always recalculates prices and balances
7. **Input Validation**: All user inputs validated on backend
8. **Error Handling**: Stack traces not exposed in production responses
9. **Token Expiration**: 7-day expiration reduces token theft impact
10. **HTTPS**: Use HTTPS in production

## Common Issues & Troubleshooting

| Issue | Solution |
|-------|----------|
| MongoDB connection fails | Ensure MongoDB is running and MONGO_URI is correct |
| Frontend cannot reach backend | Check VITE_API_URL matches backend PORT |
| JWT errors on protected routes | Token may have expired; login again |
| Admin routes return 403 | Ensure admin account was created and role is "admin" |
| Stock prices not updating | Check if external API key is configured |
| Build errors in frontend | Clear node_modules and reinstall: `rm -rf node_modules && npm install` |

## Future Enhancements

1. Real-time WebSocket price updates
2. Advanced charting with technical indicators (RSI, MACD, Bollinger Bands)
3. More trading strategies (MACD, RSI, moving average ribbon)
4. Email notifications for transactions
5. Leaderboard comparing portfolio performance
6. Export transaction history to CSV
7. Backtesting engine for strategy validation
8. Watchlist feature
9. Paper trading competitions
10. Mobile app (React Native)

## File Sizes & Project Stats

- **Frontend**: ~50 KB (minified)
- **Backend**: ~100 KB (including node_modules excluded)
- **Total Pages**: 13 pages (Landing, Login, Register, Dashboard, Browse Stocks, Stock Details, Portfolio, History, Profile, Admin Dashboard, Users, Orders, Transactions, Admin Stock Chart)
- **API Endpoints**: 30+ endpoints
- **Models**: 5 core MongoDB collections
- **Components**: 20+ React components
- **Controllers**: 5 controller modules

## Educational Value

This project demonstrates:
- ✅ Full-stack MERN development
- ✅ MVC architectural patterns
- ✅ JWT-based authentication
- ✅ Role-based authorization
- ✅ RESTful API design
- ✅ MongoDB schema design & relationships
- ✅ React hooks and context API
- ✅ Responsive web design
- ✅ Financial transaction logic
- ✅ Data visualization with charts
- ✅ Error handling & validation
- ✅ Environmental configuration

## Disclaimer

**SB Stocks is a paper trading / virtual trading platform for educational purposes only.**

- No real money is transacted
- All trading uses virtual balances
- Stock prices are demo/sample data or pulled from public APIs
- Strategy analysis is educational only, not financial advice
- Do not make real investment decisions based on this application

## Video Demo Link
```bash
https://youtu.be/LPRusPzBvnQ
```

## License

This project is part of the SmartBridge internship program.

## Author

Built for SmartBridge Internship Program - Virtual Stock Market & Paper Trading Platform

SESHAGIRI GNANA JAYALAKSHMI PRASANNA

---

**Last Updated**: 2026-07-15

**Version**: 1.0.0 (Complete Implementation)
