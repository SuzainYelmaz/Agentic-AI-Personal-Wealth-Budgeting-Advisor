import { formatCurrency, formatDate } from "../utils/formatters";
import AnimatedCard from "./AnimatedCard";
import { FiShoppingBag, FiHome, FiTruck, FiFilm, FiHeart, FiZap, FiMoreHorizontal, FiCoffee, FiTrash2 } from "react-icons/fi";

const CATEGORY_ICONS = {
  Housing: FiHome, Food: FiCoffee, Transport: FiTruck, Entertainment: FiFilm,
  Health: FiHeart, Shopping: FiShoppingBag, Utilities: FiZap, Other: FiMoreHorizontal,
};

function TransactionRow({ transaction, onDelete }) {
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
      <div className="transaction-actions">
        <span className="transaction-amount">-{formatCurrency(transaction.amount)}</span>
        {onDelete && (
          <button className="btn btn-ghost btn-icon btn-sm" onClick={() => onDelete(transaction.id)}
            title="Delete" style={{ color: "var(--danger)" }}>
            <FiTrash2 size={14} />
          </button>
        )}
      </div>
    </div>
  );
}

export default function TransactionList({ transactions = [], onDelete }) {
  return (
    <AnimatedCard index={7}>
      <div className="card-header">
        <h3 className="card-title">Recent Transactions</h3>
        <span className="text-sm text-muted">{transactions.length} items</span>
      </div>
      <div className="transaction-list">
        {transactions.slice(0, 10).map((t) => (
          <TransactionRow key={t.id} transaction={t} onDelete={onDelete} />
        ))}
        {!transactions.length && (
          <div className="empty-state">
            <h3>No transactions yet</h3>
            <p>Add your first transaction to start tracking your spending</p>
          </div>
        )}
      </div>
    </AnimatedCard>
  );
}
