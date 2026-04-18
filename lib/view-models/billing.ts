import { MOCK_BILLING_TRANSACTIONS } from '@/lib/mock-data';
import { DEMO } from '@/lib/demo';
import type { BillingTransaction } from '@/lib/types';

export interface BillingViewModel {
  plan: {
    name: string;
    price: string;
    interval: string;
  };
  usage: {
    submissionsUsed: number;
    submissionsTotal: number;
    unlocksUsed: number;
    unlocksTotal: number;
  };
  transactions: BillingTransaction[];
}

export async function getBillingViewModel(): Promise<BillingViewModel> {
  return {
    plan: {
      name: 'Pro',
      price: '$99',
      interval: 'month',
    },
    usage: {
      submissionsUsed: DEMO.USER.submissionsUsed,
      submissionsTotal: DEMO.USER.submissionsTotal,
      unlocksUsed: DEMO.USER.unlocksUsed,
      unlocksTotal: DEMO.USER.unlocksTotal,
    },
    transactions: MOCK_BILLING_TRANSACTIONS,
  };
}
