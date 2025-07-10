#!/bin/bash

echo "Starting build process..."
npm run build

echo "Checking for existence of key files..."
if [ -f "api/pages/index.js" ]; then
  echo "✅ api/pages/index.js exists"
else
  echo "❌ api/pages/index.js not found"
fi

if [ -f "loader.mjs" ]; then
  echo "✅ loader.mjs exists"
else
  echo "❌ loader.mjs not found"
fi

if [ -d "api/pages" ]; then
  echo "✅ api/pages directory exists"
else
  echo "❌ api/pages directory not found"
fi

echo "Build process complete!"