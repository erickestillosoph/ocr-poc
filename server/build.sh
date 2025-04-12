#!/bin/bash

echo "Starting build process..."
npm run build

echo "Checking for existence of key files..."
if [ -f "dist/api/index.js" ]; then
  echo "✅ dist/api/index.js exists"
else
  echo "❌ dist/api/index.js not found"
fi

if [ -f "loader.mjs" ]; then
  echo "✅ loader.mjs exists"
else
  echo "❌ loader.mjs not found"
fi

if [ -d "dist/api" ]; then
  echo "✅ dist/api directory exists"
else
  echo "❌ dist/routes directory not found"
fi

echo "Build process complete!" 