# ----- ビルドステージ -----
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# ----- 実行ステージ -----
FROM nginx:alpine

# ビルドした静的ファイルをNginxの配信ディレクトリ(/usr/share/nginx/html/lens-simulation)にコピー
COPY --from=builder /app/dist /usr/share/nginx/html/lens-simulation

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
