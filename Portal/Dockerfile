# ----- ビルドステージ -----
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ----- 実行ステージ -----
FROM nginx:alpine

# ビルドした静的ファイルをNginxの配信ディレクトリにコピー
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
