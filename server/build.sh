#!/bin/bash

echo "Starting build process..."
npm run build

echo "Checking for existence of key files..."
if [ -f "dist/pages/api/index.js" ]; then
  echo "✅ dist/pages/api/index.js exists"
else
  echo "❌ dist/pages/api/index.js not found"
fi

if [ -f "loader.mjs" ]; then
  echo "✅ loader.mjs exists"
else
  echo "❌ loader.mjs not found"
fi

if [ -d "dist/pages/api" ]; then
  echo "✅ dist/pages/api directory exists"
else
  echo "❌ dist/pages/api directory not found"
fi

echo "Build process complete!" 