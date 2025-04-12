#!/bin/bash

echo "Starting build process..."
npm run build

echo "Checking for existence of key files..."
if [ -f "dist/index.js" ]; then
  echo "✅ dist/index.js exists"
else
  echo "❌ dist/index.js not found"
fi

if [ -f "loader.mjs" ]; then
  echo "✅ loader.mjs exists"
else
  echo "❌ loader.mjs not found"
fi

if [ -d "dist/routes" ]; then
  echo "✅ dist/routes directory exists"
else
  echo "❌ dist/routes directory not found"
fi

echo "Build process complete!" 