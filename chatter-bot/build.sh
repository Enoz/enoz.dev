docker build -t chatter-bot \
    --build-arg DISCORD_APP_ID=${DISCORD_APP_ID} \
    --build-arg DISCORD_APP_PUBLICKEY=${DISCORD_APP_PUBLICKEY} \
    --build-arg DISCORD_APP_TOKEN=${DISCORD_APP_TOKEN} \
    .



