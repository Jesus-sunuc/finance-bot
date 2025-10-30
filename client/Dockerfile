FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json .
COPY package-lock.json .
RUN npm install 

ENV VITE_BASE_URL=$VITE_BASE_URL

COPY . .
RUN npm run build

FROM nginx
RUN apt update && apt install -y curl
WORKDIR /usr/share/nginx/html
COPY default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist .
CMD ["nginx", "-g", "daemon off;"]