export interface SolanaPubSubResult<T> {
  subscription: number;
  result: T;
}

export interface SolanaPubSubMessage<T> {
  jsonrpc: string;
  method: string;
  params: SolanaPubSubResult<T>;
}

export interface Reward {
  pubkey: string;
  lamports: number;
  postBalance: number;
  rewardType?: number | null;
  commission?: number | null;
}

export namespace Transaction {
  export interface TransactionWrite {
    context: Context;
    value: Transaction;
  }

  export interface Context {
    slotStatus: string;
    nodeTime?: Timestamp | null;
    isVote: boolean;
    signature: string;
    index?: number | null;
  }

  export interface Timestamp {
    seconds: number;
    nanos: number;
  }

  export interface Transaction {
    blockTime?: number | null;
    meta?: Meta | null;
    slot: number;
    transaction?: Body | null;
  }

  export interface Meta {
    err?: any;
    fee: number;
    innerInstructions: InnerInstructions[];
    loadedAddresses?: LoadedAddresses | null;
    logMessages: string[];
    postBalances: number[];
    postTokenBalances: TokenBalance[];
    preBalances: number[];
    preTokenBalances: TokenBalance[];
    rewards: Reward[];
    status?: any;
  }

  export interface CompiledInstruction {
    programIdIndex: number;
    accounts: number[];
    data: string;
  }

  export interface InnerInstructions {
    index: number;
    instructions: CompiledInstruction[];
  }

  export interface LoadedAddresses {
    writable: string[];
    readonly: string[];
  }

  export type OneofTransactionStatus = boolean | any;

  export interface TokenBalance {
    accountIndex: number;
    mint: string;
    owner: string;
    programId: string;
    uiTokenAmount?: TokenAmount | null;
  }

  export interface TokenAmount {
    amount: string;
    decimals: number;
    uiAmount?: number | null;
    uiAmountString: string;
  }

  export interface Body {
    message?: Message | null;
    messageHash: string;
    signatures: string[];
  }

  export interface Message {
    accountKeys: string[];
    addressTableLookups: AddressTableLookup[];
    header?: Header | null;
    instructions: CompiledInstruction[];
    recentBlockhash: string;
  }

  export interface AddressTableLookup {
    accountKey: string;
    writableIndexes: number[];
    readonlyIndexes: number[];
  }

  export interface Header {
    numReadonlySignedAccounts: number;
    numReadonlyUnsignedAccounts: number;
    numRequiredSignatures: number;
  }
}
