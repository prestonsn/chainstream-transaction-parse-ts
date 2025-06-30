import WebSocket from "ws";
import { TOKEN } from "./config";

import { TLSSocket } from "tls";

type WSWithSocket = WebSocket & { _socket: TLSSocket };

const wsUrl = `wss://api.syndica.io/api-token/${TOKEN}`;
const ws_transactions: WebSocket = new WebSocket(wsUrl, {
  perMessageDeflate: true,
});

let n_tx = 0;
let prevWire = 0;
let decompressedBytes = 0;

setInterval(() => {
  const sock = (ws_transactions as WSWithSocket)._socket;

  // Start logging once we've connected.
  if (!sock) return;

  const current = sock.bytesRead;
  const wireDelta = current - prevWire;
  prevWire = current;

  const decodedMiB = decompressedBytes / 1024 / 1024;
  const wireMiB = wireDelta / 1024 / 1024;
  const ratio = wireMiB && decodedMiB ? (1 - wireMiB / decodedMiB) * 100 : 0;

  console.log(
    `⏱  decoded ${decodedMiB.toFixed(2)} MiB/s | ` +
      `wire ${wireMiB.toFixed(2)} MiB/s | ` +
      `compression ratio ≈ ${ratio.toFixed(0)}%`,
  );

  decompressedBytes = 0;
}, 1_000);
ws_transactions.once("open", function open(): void {
  console.log("connected to Chainstream API");
  console.log("extensions header:", ws_transactions.extensions);
  console.log("per-message deflate negotiated:", ws_transactions.extensions.includes("permessage-deflate"));

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
            oneOf: ["675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8"],
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
    const size = typeof data === "string" ? Buffer.byteLength(data) : (data as Buffer).length;
    decompressedBytes += size;
  }

  n_tx++;
});

ws_transactions.on("close", function close(): void {
  console.log("Disconnected from the server.");
});

ws_transactions.on("error", function error(err: Error): void {
  console.error("WebSocket error:", err);
});
