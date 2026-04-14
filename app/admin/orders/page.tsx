"use client";

import { useEffect, useState } from "react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await fetch(`/api/admin/orders?search=${search}`);
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [search]);

  const handleStatusChange = async (orderId: number, orderStatus: string) => {
    try {
      const res = await fetch("/api/admin/orders/update-status", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId,
          orderStatus,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      fetchOrders();
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  };

  return (
    <main className="space-y-6">
      <div>
        <p className="text-sm text-gray-500">Admin Panel</p>
        <h1 className="text-3xl font-semibold">Purchases</h1>
      </div>

      <input
        type="text"
        placeholder="Search by purchase ID, customer name or email..."
        className="w-full border p-3 rounded-lg"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="bg-white border rounded-2xl overflow-hidden">
        {loading ? (
          <p className="p-6">Loading...</p>
        ) : orders.length === 0 ? (
          <p className="p-6 text-gray-500">No purchases found</p>
        ) : (
          <div className="space-y-4 p-4">
            {orders.map((order) => (
              <div key={order.order_id} className="border rounded-xl p-5 space-y-4">
                <div className="grid md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Purchase ID</p>
                    <p>#{order.order_id}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Customer</p>
                    <p>{order.customer_name}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p>{order.email}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Total</p>
                    <p>${order.total_amount}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Order Status</p>
                    <p className="capitalize">{order.order_status}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Payment Status</p>
                    <p className="capitalize">{order.payment_status}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Payment Method</p>
                    <p>{order.payment_method || "N/A"}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Created</p>
                    <p>
                      {order.created_at
                        ? new Date(order.created_at).toLocaleDateString()
                        : "—"}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-2">Update Status</p>

                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() => handleStatusChange(order.order_id, "pending")}
                      className="border px-3 py-2 rounded-lg"
                    >
                      Pending
                    </button>

                    <button
                      onClick={() => handleStatusChange(order.order_id, "shipped")}
                      className="border px-3 py-2 rounded-lg"
                    >
                      Shipped
                    </button>

                    <button
                      onClick={() => handleStatusChange(order.order_id, "delivered")}
                      className="border px-3 py-2 rounded-lg"
                    >
                      Delivered
                    </button>

                    <button
                      onClick={() => handleStatusChange(order.order_id, "cancelled")}
                      className="border px-3 py-2 rounded-lg"
                    >
                      Cancelled
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}


