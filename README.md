# Enoz.dev

[![Deploy](https://github.com/Enoz/enoz.dev/actions/workflows/deploy.yml/badge.svg?branch=master)](https://github.com/Enoz/enoz.dev/actions/workflows/deploy.yml)

Live at [Enoz.Dev](https://enoz.dev)

## [Enoz.Dev](enoz.dev/)

Frontend code to the website. Built using [Svelte](https://svelte.dev/)

## [Chatter-Bot](chatter-bot/)

The backend for the [chat](https://enoz.dev/chat) feature. The service acts as both a Discord bot and a webserver, orchestrating a chat session through text channels.

## Deployment

### Architecture

The website is served from a single [VPS](https://www.vultr.com/). Both the frontend and backend are built into images and deployed using Docker. A Caddy proxy orchestrates traffic.

```
https://enoz.dev -> VPS -> | Caddy  |-> Frontend (SSR served with Node)
                                    |-> Chatter-Bot (Node)
```
