#!/usr/bin/env bash
set -e

# ADHIKAAR AI - Full Test Suite Runner
echo "==> [1/3] Running TypeScript Typecheck..."
npm run typecheck

echo "==> [2/3] Running ESLint..."
npm run lint

echo "==> [3/3] Running Domain & Speech Rules Tests..."
npm test

echo "==> All automated checks passed successfully!"
