# Transaction Parsing Example

This project demonstrates how to parse Solana transaction data received via a WebSocket connection from the Syndica API using Typescript/JS. 

Ideally, you should have a basic understanding of the ChainStream API before diving into this example. If you haven't already, you can read the [ChainStream API documentation](https://docs.syndica.io/platform/chainstream-api) to get started.

## Requirements

Access to the ChainStream API. You can get access by signing up for a Syndica account and creating a ChainStream API key. You can sign up for a Syndica account [here](https://app.syndica.io/signup). After which you can follow the guide [here](https://docs.syndica.io/platform/chainstream-api) to enable access to the ChainStream API.

## Setup

- Install the dependencies:
```sh
npm install
npm install dotenv ws bs58
npm install --save-dev @types/node @types/dotenv @types/ws
```

- Create a new local `.env` file based on [`.env.template`](.env.template) and add your Syndica API key:
```
TOKEN=your_syndica_api_key_here
```

- OR, alternatively, you can set the `TOKEN` environment variable in your shell.
```sh
export TOKEN=your_syndica_api_key_here
```

## Build and Run Examples

Compile the TypeScript code and start the WebSocket client to parse Raydium Transactions:

```sh
tsc && node build/wsClient.js
```

Simple latency approximation example:

```
tsc && node build/latency.js
```

## Notes

- Special thanks to [@alikopasa](https://github.com/alikopasa) for bringing this project to life!
- If you're looking for a Rust example of a similar project, you can check out the [ChainStream API <--> Raydium Swaps](https://github.com/prestonsn/chainstream-raydium-swaps) example project.
