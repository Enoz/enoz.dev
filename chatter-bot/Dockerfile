FROM node:24-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --omit=dev

COPY . ./

# TODO: Not Working
ENV DISCORD_APP_ID=${DISCORD_APP_ID}
ENV DISCORD_APP_PUBLICKEY=${DISCORD_APP_PUBLICKEY}
ENV DISCORD_APP_TOKEN=${DISCORD_APP_TOKEN}
EXPOSE 3000
CMD [ "node", "app.js" ]
