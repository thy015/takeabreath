FROM ubuntu:latest
LABEL authors="maithy"
WORKDIR /app

RUN apt-get update && \
    apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs && \
    npm install -g pnpm

COPY package.json .

RUN pnpm install

COPY . .

EXPOSE 4000

CMD ["pnpm", "run", "dev"]