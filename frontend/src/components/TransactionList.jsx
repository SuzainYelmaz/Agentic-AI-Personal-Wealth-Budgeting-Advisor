import { formatCurrency, formatDate } from "../utils/formatters";
import AnimatedCard from "./AnimatedCard";
import { FiShoppingBag, FiHome, FiTruck, FiFilm, FiHeart, FiZap, FiMoreHorizontal, FiCoffee } from "react-icons/fi";

const CATEGORY_ICONS = {
  Housing: FiHome, Food: FiCoffee, Transport: FiTruck, Entertainment: FiFilm,
  Health: FiHeart, Shopping: FiShoppingBag, Utilities: FiZap, Other: FiMoreHorizontal,
};

function TransactionRow({ transaction }) {
  const Icon = CATEGORY_ICONS[transaction.category] || FiMoreHorizontal;
  return (
    <div className="transaction-item">
      <div className="transaction-left">
        <div className="transaction-icon"><Icon /></div>
        <div className="transaction-info">
          <h4>{transaction.merchant}</h4>
          <p>{transaction.description} · {formatDate(transaction.transaction_date)}</p>
        </div>
      </div>
      <span className="transaction-amount">-{formatCurrency(transaction.amount)}</span>
    </div>
  );
}

export default function TransactionList({ transactions = [] }) {
  return (
    <AnimatedCard index={7}>
      <div className="card-header">
        <h3 className="card-title">Recent Transactions</h3>
        <span className="text-sm text-muted">{transactions.length} items</span>
      </div>
      <div className="transaction-list">
        {transactions.slice(0, 10).map((t) => <TransactionRow key={t.id} transaction={t} />)}
        {!transactions.length && <p className="text-sm text-muted text-center">No transactions yet</p>}
      </div>
    </AnimatedCard>
  );
}
