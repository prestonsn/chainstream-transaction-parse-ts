import WebSocket from "ws";
import bs58 from "bs58";
import { Transaction, SolanaPubSubMessage } from "./types";
import { RAYDUIM_PROGRAM_ID, TOKEN, TOKEN_PROGRAM_ID } from "./config";

const wsUrl = `wss://api.syndica.io/api-token/${TOKEN}`;
const ws_transactions: WebSocket = new WebSocket(wsUrl);

var n_tx = 0;

ws_transactions.on("open", function open(): void {
  console.log("connected to Chainstream API");

  // Send the specified request to subscribe.
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
            all: [RAYDUIM_PROGRAM_ID],
          },
        },
      },
    }),
  );

  // Send PING messages every 30s.
  setInterval(() => {
    ws_transactions.ping();
  }, 30000);
});

ws_transactions.on("message", function incoming(data: WebSocket.Data): void {
  // The first message is always the subscription result.
  if (n_tx == 0) {
    console.log("transaction subscription result", JSON.parse(data.toString()));
  } else {
    try {
      const parsedMessage: SolanaPubSubMessage<Transaction.TransactionWrite> = JSON.parse(data.toString());

      // Extract the data
      const { subscription, result } = parsedMessage.params;
      const { context, value } = result;

      // Access the signature & slot from the transaction
      const signature = context.signature;
      const slot = value.slot;
      console.log(`Received transaction with signature: https://solscan.io/tx/${signature}`);
      console.log(`Transaction slot: ${slot}`);

      // Access the transaction body
      const transaction = value.transaction;
      const meta = value.meta;

      if (transaction && transaction.message && meta) {
        const messageHash = transaction.messageHash;
        const preTokenBalances = meta.preTokenBalances;
        const postTokenBalances = meta.postTokenBalances;
        console.log(`Message hash: ${messageHash}`);

        const message = transaction.message;
        const instructions = message.instructions;
        const innerInstructions = meta.innerInstructions;
        const accountKeys = transaction.message?.accountKeys;

        for (const innerInstruction of innerInstructions) {
          const instruction = instructions[innerInstruction.index];
          const innerInstructionProgram = accountKeys[instruction.programIdIndex];
          if (innerInstructionProgram == RAYDUIM_PROGRAM_ID) {
            console.log(`Raydium Tx: ${innerInstruction.index} program: ${innerInstructionProgram}`);
            for (const ix of innerInstruction.instructions) {
              const innerInstructionProgram = accountKeys[ix.programIdIndex];
              if (innerInstructionProgram == TOKEN_PROGRAM_ID) {
                const decodedData = bs58.decode(ix.data);
                const instructionTag = decodedData[0];
                let rest = decodedData.slice(1);

                let dstToken = postTokenBalances.find((x: { accountIndex: any }) => x.accountIndex == ix.accounts[1]);
                if (!dstToken) {
                  dstToken = preTokenBalances.find((x: { accountIndex: any }) => x.accountIndex == ix.accounts[0]);
                }

                if (instructionTag === 3) {
                  // byte array -> u64
                  let u64_amount = 0;
                  for (let i = 0; i < 8; i++) {
                    let v = rest[i];
                    u64_amount += v * 2 ** (8 * i);
                  }
                  // Print the transfer token and amount
                  console.log(`  Transfer: ${dstToken?.mint}  amount: ${u64_amount}`);
                }
              }
            }
          }
        }
      } else {
        console.log("Transaction or message is undefined.");
      }
      console.log("---------------------------------------------------------------------");
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
