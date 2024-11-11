FROM ubuntu:latest
LABEL authors="maithy"
WORKDIR /app

# Install Node.js and pnpm
RUN apt-get update && \
    apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs && \
    npm install -g pnpm

COPY package.json .

RUN pnpm install

COPY . .

EXPOSE 3000
CMD ["pnpm", "start"]

