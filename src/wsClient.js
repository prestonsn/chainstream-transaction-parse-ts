"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = __importDefault(require("ws"));
const TOKEN = "Your Token Here!";
const wsUrl = `wss://api.syndica.io/api-token/${TOKEN}`;
const ws_transactions = new ws_1.default(wsUrl);
var n_tx = 0;
ws_transactions.on("open", function open() {
    console.log("connected to Chainstream API");
    // Send the specified request to subscribe.
    ws_transactions.send(JSON.stringify({
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
    }));
    // Send PING messages every 30s.
    setInterval(() => {
        ws_transactions.ping();
    }, 30000);
});
ws_transactions.on("message", function incoming(data) {
    // The first message is always the subscription result.
    if (n_tx == 0) {
        console.log("transaction subscription result", JSON.parse(data.toString()));
    }
    else {
        try {
            const parsedMessage = JSON.parse(data.toString());
            // Extract the data
            const { subscription, result } = parsedMessage.params;
            const { context, value } = result;
            // Access the signature & slot from the transaction
            const signature = context.signature;
            const slot = value.slot;
            console.log(`Received transaction with signature: ${signature}`);
            console.log(`Transaction slot: ${slot}`);
            // Access the transaction body
            const transaction = value.transaction;
            if (transaction && transaction.message) {
                const messageHash = transaction.messageHash;
                console.log(`Message hash: ${messageHash}`);
                const message = transaction.message;
                // Access the instructions array & print each out
                const instructions = message.instructions;
                console.log(`Number of instructions: ${instructions.length}`);
                instructions.forEach((instruction, index) => {
                    console.log(` Instruction ${index + 1}:`);
                    console.log(`   Program ID Index: ${instruction.programIdIndex}`);
                    console.log(`   Accounts: ${instruction.accounts.join(", ")}`);
                    console.log(`   Data: ${instruction.data}`);
                });
            }
            else {
                console.log("Transaction or message is undefined.");
            }
        }
        catch (error) {
            console.error("Error parsing WebSocket message:", error);
        }
    }
    n_tx++;
});
ws_transactions.on("close", function close() {
    console.log("Disconnected from the server.");
});
ws_transactions.on("error", function error(err) {
    console.error("WebSocket error:", err);
});
