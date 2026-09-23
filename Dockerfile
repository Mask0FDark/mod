FROM node:22-alpine
WORKDIR /app
COPY package.json ./
RUN npm install --omit=dev
COPY apps ./apps
ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "apps/server/server.js"]
