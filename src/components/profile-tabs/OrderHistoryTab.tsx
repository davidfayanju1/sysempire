import { motion } from "framer-motion";

const OrderHistoryTab = () => {
  const orders = [
    {
      id: "#ORD-001",
      date: "May 5, 2026",
      total: "$245.00",
      status: "Delivered",
      items: 3,
    },
    {
      id: "#ORD-002",
      date: "Apr 28, 2026",
      total: "$129.99",
      status: "Shipped",
      items: 1,
    },
    {
      id: "#ORD-003",
      date: "Apr 15, 2026",
      total: "$89.50",
      status: "Delivered",
      items: 2,
    },
    {
      id: "#ORD-004",
      date: "Apr 2, 2026",
      total: "$399.00",
      status: "Cancelled",
      items: 4,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "text-green-600";
      case "Shipped":
        return "text-blue-600";
      case "Cancelled":
        return "text-red-600";
      default:
        return "text-black/50";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-4"
    >
      {orders.map((order) => (
        <div
          key={order.id}
          className="border border-black/10 p-5 hover:border-black/30 transition"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="font-medium text-black tracking-wide">{order.id}</p>
              <p className="text-xs text-black/40 mt-1">{order.date}</p>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <span className="text-xs text-black/60">{order.items} items</span>
              <span className="font-medium text-black">{order.total}</span>
              <span
                className={`text-xs tracking-wide ${getStatusColor(order.status)}`}
              >
                {order.status}
              </span>
              <button className="text-xs uppercase tracking-[0.15em] text-black/60 hover:text-black transition">
                View Details
              </button>
            </div>
          </div>
        </div>
      ))}
    </motion.div>
  );
};

export default OrderHistoryTab;
