import { formatCurrency, formatDate } from "../utils/formatters";
import AnimatedCard from "./AnimatedCard";
import { ShoppingBag, Home, Truck, Film, Heart, Zap, MoreHorizontal, Coffee, Trash2 } from "lucide-react";

const CATEGORY_ICONS = {
  Housing: Home, Food: Coffee, Transport: Truck, Entertainment: Film,
  Health: Heart, Shopping: ShoppingBag, Utilities: Zap, Other: MoreHorizontal,
};

function TransactionRow({ transaction, onDelete }) {
  const Icon = CATEGORY_ICONS[transaction.category] || MoreHorizontal;
  return (
    <div className="flex items-center justify-between py-4 border-b border-stone-100 last:border-0 group">
      <div className="flex items-center">
        <div className="w-10 h-10 rounded-full bg-stone-100 text-stone-600 flex items-center justify-center shrink-0 border border-stone-200">
          <Icon size={18} />
        </div>
        <div className="ml-4">
          <h4 className="font-sans font-medium text-stone-900 mb-0.5">{transaction.merchant}</h4>
          <p className="font-sans text-xs text-stone-500">{transaction.description} · {formatDate(transaction.transaction_date)}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="font-sans font-semibold text-stone-900">-{formatCurrency(transaction.amount)}</span>
        {onDelete && (
          <button className="w-8 h-8 rounded-full flex items-center justify-center text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100" onClick={() => onDelete(transaction.id)}
            title="Delete">
            <Trash2 size={16} />
          </button>
        )}
      </div>
    </div>
  );
}

export default function TransactionList({ transactions = [], onDelete }) {
  return (
    <AnimatedCard index={7}>
      <div className="flex items-center justify-between mb-4 border-b border-stone-100 pb-4">
        <h3 className="font-serif text-xl font-semibold text-stone-900">Recent Transactions</h3>
        <span className="text-xs font-sans font-semibold uppercase tracking-wider text-stone-500">{transactions.length} items</span>
      </div>
      <div>
        {transactions.slice(0, 10).map((t) => (
          <TransactionRow key={t.id} transaction={t} onDelete={onDelete} />
        ))}
        {!transactions.length && (
          <div className="text-center py-10 px-6">
            <h3 className="font-serif italic text-xl text-stone-800 mb-2">No transactions yet</h3>
            <p className="font-sans text-stone-500 text-sm">Add your first transaction to start tracking your spending</p>
          </div>
        )}
      </div>
    </AnimatedCard>
  );
}
