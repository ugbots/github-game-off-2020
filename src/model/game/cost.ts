import { failure, Result, success } from '../../types/result';

export interface Cost {
  readonly gold: number;
  readonly emerald: number;
  readonly ruby: number;
}

export const COST_FREE: Cost = {
  gold: 0,
  emerald: 0,
  ruby: 0,
};

const SELL_PERCENTAGE = 0.8;

export const salePrice = (cost: Cost): Cost => scale(cost, SELL_PERCENTAGE);

const scale = (cost: Cost, scale: number): Cost =>
  Object.keys(cost).reduce(
    (acc, k) => ({
      ...acc,
      [k]: Math.floor(cost[k] * scale),
    }),
    {} as Partial<Cost>,
  ) as Cost;

export const canAfford = (wallet: Cost, price: Cost): boolean =>
  Object.keys(wallet).every((k) => wallet[k] >= price[k]);

export const purchase = (wallet: Cost, price: Cost): Result<string, Cost> => {
  if (!canAfford(wallet, price)) {
    return failure("Purchase failed: You can't afford it!");
  }

  const newWallet = Object.keys(wallet).reduce(
    (acc, k) => ({
      ...acc,
      [k]: wallet[k] - price[k],
    }),
    {} as Partial<Cost>,
  );

  return success(newWallet as Cost);
};

export const addFunds = (source: Cost, funds: Cost): Cost =>
  Object.keys(source).reduce(
    (acc, k) => ({
      ...acc,
      [k]: source[k] + funds[k],
    }),
    {} as Partial<Cost>,
  ) as Cost;

export const isFree = (cost: Cost): boolean =>
  Object.keys(cost)
    .map((k) => cost[k])
    .reduce((a, b) => a + b, 0) === 0;
