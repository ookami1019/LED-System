# ============================================================
# Stage 1: Build Portal
# ============================================================
FROM node:20-alpine AS portal-builder
WORKDIR /app
# 依存関係のインストールとビルド
COPY Portal/package*.json ./
RUN npm install
COPY Portal/ ./
RUN npm run build

# ============================================================
# Stage 2: Build LensSimulation
# ============================================================
FROM node:20-alpine AS lens-builder
WORKDIR /app
# 依存関係のインストールとビルド
COPY LensSimulation/package*.json ./
RUN npm install
COPY LensSimulation/ ./
RUN npm run build

# ============================================================
# Stage 3: Build Flickr
# ============================================================
FROM node:20-alpine AS flickr-builder
WORKDIR /app
# 依存関係のインストールとビルド
COPY Flickr/package*.json ./
RUN npm install
COPY Flickr/ ./
RUN npm run build

# ============================================================
# Final Stage: Nginx Web Server
# ============================================================
FROM nginx:alpine

# NginxのデフォルトのHTMLディレクトリを空にする
RUN rm -rf /usr/share/nginx/html/*

# 各ステージでビルドした静的ファイルをNginxの配信ディレクトリにコピー
COPY --from=portal-builder /app/dist /usr/share/nginx/html/
COPY --from=lens-builder /app/dist /usr/share/nginx/html/lens-simulation
COPY --from=flickr-builder /app/dist /usr/share/nginx/html/flickr

# カスタムNginx設定をコピー（必要に応じて）
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
