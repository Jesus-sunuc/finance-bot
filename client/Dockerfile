FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine
WORKDIR /usr/share/nginx/html

COPY default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist .

CMD ["nginx", "-g", "daemon off;"]