FROM node:20-alpine AS builder

ARG VITE_ADDRESS
ARG VITE_PORT
ARG VITE_TARGET_AUTH
ARG VITE_TARGET_SYSTEM
ARG VITE_HOSTS_ALLOWED

ENV VITE_ADDRESS=$VITE_ADDRESS
ENV VITE_PORT=$VITE_PORT
ENV VITE_TARGET_AUTH=$VITE_TARGET_AUTH
ENV VITE_TARGET_SYSTEM=$VITE_TARGET_SYSTEM
ENV VITE_HOSTS_ALLOWED=$VITE_HOSTS_ALLOWED

WORKDIR /app

COPY app/package*.json ./

RUN npm install

COPY app ./

RUN npm run build

FROM nginx:stable-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

