#!/usr/bin/env bash
set -e

# ADHIKAAR AI - Production Build Runner
echo "==> Building Next.js Web Production Bundle..."
npm run build

echo "==> Compiling Spring Boot Backend..."
npm run build:backend

echo "==> Production build completed successfully!"
