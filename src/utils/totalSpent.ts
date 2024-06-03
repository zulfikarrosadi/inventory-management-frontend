import { Stock } from '../pages/Stocks';

export function getTotalSpent(data: Stock[]) {
  console.log('get total spent', data);

  return data.reduce((sum, obj) => sum + obj.amount, 0);
}
