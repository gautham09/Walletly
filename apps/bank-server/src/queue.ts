export type Transaction = {
    userId: number;
    amount: number;
    token: string;
  };
  
  export const transactionQueue: Transaction[] = [];
  