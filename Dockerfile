# Use the official Puppeteer image
# This base image comes with Chrome pre-installed and configured perfectly
FROM ghcr.io/puppeteer/puppeteer:22.6.0

# Switch to root to install dependencies
USER root

# Skip downloading Chrome again (we use the installed one)
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable \
    NEXT_TELEMETRY_DISABLED=1

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (including Next.js)
RUN npm ci

# Copy the rest of the application
COPY . .

# Build the Next.js application
RUN npm run build

# Expose the port Next.js runs on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]