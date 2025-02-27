import WebSocket from "ws";
import { Transaction, SolanaPubSubMessage } from "./types";
import { TOKEN } from "./config";

const wsUrl = `wss://api.syndica.io/api-token/${TOKEN}`;
const ws_transactions: WebSocket = new WebSocket(wsUrl);

let n_tx = 0;

ws_transactions.on("open", function open(): void {
  console.log("connected to Chainstream API");

  // Subscribe to transactions
  ws_transactions.send(
    JSON.stringify({
      jsonrpc: "2.0",
      id: 123,
      method: "chainstream.transactionsSubscribe",
      params: {
        network: "solana-mainnet",
        verified: false,
        filter: {
          accountKeys: {
            all: ["675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8"],
          },
        },
      },
    }),
  );

  // Send PING every 30s
  setInterval(() => {
    ws_transactions.ping();
  }, 30000);
});

ws_transactions.on("message", function incoming(data: WebSocket.Data): void {
  if (n_tx === 0) {
    console.log("transaction subscription result", JSON.parse(data.toString()));
  } else {
    try {
      const now = new Date().getTime();
      const parsedMessage: SolanaPubSubMessage<Transaction.TransactionWrite> =
        JSON.parse(data.toString());

      const { context, value } = parsedMessage.params.result;
      const { signature, nodeTime } = context;


      if (typeof nodeTime === "string") {
        const nodeTimeMs = new Date(nodeTime).getTime();
        const slot = value.slot;
        const latency = Math.abs(now - nodeTimeMs);

        console.log(`${signature} ${slot} ${nodeTime} -- ${latency}ms`);
      } else {
        console.warn("nodeTime is missing or not a string.");
      }
    } catch (error) {
      console.error("Error parsing WebSocket message:", error);
    }
  }

  n_tx++;
});

ws_transactions.on("close", function close(): void {
  console.log("Disconnected from the server.");
});

ws_transactions.on("error", function error(err: Error): void {
  console.error("WebSocket error:", err);
});
