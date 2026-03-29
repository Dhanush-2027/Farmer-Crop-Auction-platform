@echo off
echo 🌾 FARMER AUCTION PLATFORM - STARTING UP
echo ==========================================
echo.
echo 📦 Installing dependencies...
echo This may take 2-3 minutes on first run.
echo.

echo Installing backend dependencies...
cd backend && npm install
if errorlevel 1 (
    echo ❌ Backend installation failed
    echo Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)
echo ✅ Backend dependencies installed
echo.

echo Installing frontend dependencies...
cd ../frontend && npm install
if errorlevel 1 (
    echo ❌ Frontend installation failed
    pause
    exit /b 1
)
echo ✅ Frontend dependencies installed
echo.

echo Installing blockchain dependencies...
cd ../blockchain && npm install
if errorlevel 1 (
    echo ❌ Blockchain installation failed
    pause
    exit /b 1
)
echo ✅ Blockchain dependencies installed
echo.

echo 🚀 Starting all servers...
start "Backend Server" cmd /k "cd backend && echo 📦 Backend Server Starting on Port 3001... && node server.js"
timeout /t 3 /nobreak > nul
start "Frontend Server" cmd /k "cd frontend && echo 🌐 Frontend Server Starting on Port 3002... && npm run dev"
timeout /t 5 /nobreak > nul
start "Blockchain Network" cmd /k "cd blockchain && echo ⛓️ Blockchain Network Starting on Port 8545... && npx hardhat node"
timeout /t 10 /nobreak > nul

echo 📋 Deploying smart contracts...
cd blockchain && npx hardhat run scripts/deploy-and-populate.js --network localhost
if errorlevel 1 (
    echo ⚠️ Smart contract deployment failed - blockchain features may not work
) else (
    echo ✅ Smart contracts deployed successfully
)
echo.

echo 🌐 Opening application...
timeout /t 3 /nobreak > nul
start "" "http://localhost:3002"
echo.

echo 🎉 PLATFORM IS READY!
echo ====================
echo.
echo 🔗 Access URLs:
echo ├── Main Platform: http://localhost:3002
echo ├── Digital Money: http://localhost:3002/blockchain
echo ├── All Auctions: http://localhost:3002/auctions
echo ├── Farmer Login: http://localhost:3002/farmer/login
echo └── Buyer Login: http://localhost:3002/buyer/login
echo.
echo 🔐 Test Credentials:
echo ├── Farmer: 9876543210 / farmer123
echo ├── Buyer: 8765432101 / buyer123
echo └── Digital Money: Follow setup guide on platform
echo.
echo ✨ Happy Trading!
pause
