FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY src ./src
EXPOSE 7777
ENV NODE_ENV=production
CMD ["node", "src/app.js"]
