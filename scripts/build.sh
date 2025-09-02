#!/bin/bash
set -e

echo "Starting build process..."

# Instalar dependências
echo "Installing dependencies..."
npm ci

# Gerar Prisma Client
echo "Generating Prisma Client..."
./node_modules/.bin/prisma generate

# Compilar TypeScript
echo "Compiling TypeScript..."
npx tsc

echo "Build completed successfully!"
