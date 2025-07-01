#! /bin/bash

if [ -z "${DISCORD_APP_TOKEN}" ]; then
    echo "Missing DISCORD_APP_TOKEN env"
    exit 1
fi

if [ -z "${DISCORD_APP_PUBLICKEY}" ]; then
    echo "Missing DISCORD_APP_PUBLICKEY env"
    exit 1
fi

if [ -z "${DISCORD_APP_ID}" ]; then
    echo "Missing DISCORD_APP_ID env"
    exit 1
fi

# Build website
echo '######################### Building enoz.dev #########################'
pushd enoz.dev
npm ci
npm run docker
popd

# Build chatter-bot
echo '######################### Building chatter-bot #########################'
pushd chatter-bot
npm ci
npm run docker
popd

# Export chatter-bot .env
rm -f ./ansible/roles/chatter-bot/files/secrets.env
echo "DISCORD_APP_TOKEN=${DISCORD_APP_TOKEN}" >> ./ansible/roles/chatter-bot/files/secrets.env
echo "DISCORD_GUILD_ID=${DISCORD_GUILD_ID}" >> ./ansible/roles/chatter-bot/files/secrets.env

# Playbook
echo '######################### Executing Playbook #########################'
ansible-playbook -i ./ansible/hosts ./ansible/website.yml
