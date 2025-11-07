#!/bin/bash

echo "================================"
echo "User Network Setup Script"
echo "================================"
echo ""

echo "[1/4] Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed!"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi
echo "Node.js found: $(node --version)"
echo ""

echo "[2/4] Installing backend dependencies..."
cd backend
npm install
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install backend dependencies"
    exit 1
fi
cd ..
echo "Backend dependencies installed!"
echo ""

echo "[3/4] Installing frontend dependencies..."
cd frontend
npm install
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install frontend dependencies"
    exit 1
fi
cd ..
echo "Frontend dependencies installed!"
echo ""

echo "[4/4] Setup complete!"
echo ""
echo "================================"
echo "Next Steps:"
echo "================================"
echo ""
echo "1. Make sure MongoDB is running"
echo "   - macOS: brew services start mongodb-community"
echo "   - Linux: sudo systemctl start mongod"
echo "   - Or use MongoDB Atlas (cloud)"
echo ""
echo "2. Open TWO terminal windows:"
echo ""
echo "   Terminal 1 (Backend):"
echo "   cd backend"
echo "   npm run dev"
echo ""
echo "   Terminal 2 (Frontend):"
echo "   cd frontend"
echo "   npm start"
echo ""
echo "3. Open browser to http://localhost:3000"
echo ""
echo "================================"
echo "For detailed instructions, see:"
echo "- QUICK_START.md"
echo "- README.md"
echo "================================"
echo ""
