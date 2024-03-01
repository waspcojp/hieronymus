FROM node:21-bookworm-slim
USER node
WORKDIR /app/hieronymus
COPY --chown=node:node . .
RUN npm install
RUN npm run build-production
COPY --chown=node:node config/docker-config.json.sample ./config/config.json
RUN chmod +x ./docker-entrypoint.sh
CMD ["node","./bin/www"]
