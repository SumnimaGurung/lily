"use client";

import { useEffect, useState } from "react";

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPayments = async () => {
    try {
      const res = await fetch("/api/admin/payments");
      const data = await res.json();
      setPayments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (order_id: number, status: string) => {
    await fetch("/api/admin/payments/update", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        order_id,
        payment_status: status,
      }),
    });

    fetchPayments();
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  return (
    <main className="space-y-6">
      <div>
        <p className="text-sm text-gray-500">Admin Panel</p>
        <h1 className="text-3xl font-semibold">Payments</h1>
      </div>

      <div className="bg-white border rounded-2xl overflow-hidden">
        {loading ? (
          <p className="p-6">Loading...</p>
        ) : payments.length === 0 ? (
          <p className="p-6 text-gray-500">No payments found</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="p-4">Order</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Method</th>
                <th className="p-4">Status</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>

            <tbody>
              {payments.map((p) => (
                <tr key={p.order_id} className="border-t">
                  <td className="p-4">#{p.order_id}</td>
                  <td className="p-4">{p.customer_name}</td>

                  {/* ✅ FINAL SAFE PRICE FORMAT */}
                  <td className="p-4">
                    Rs {Number(p.total_amount || 0).toLocaleString()}
                  </td>

                  <td className="p-4">
                    {p.payment_method || "COD"}
                  </td>

                  <td className="p-4 capitalize">
                    {p.payment_status || "unpaid"}
                  </td>

                  <td className="p-4">
                    <select
                      className="border p-2 rounded"
                      value={p.payment_status || "unpaid"}
                      onChange={(e) =>
                        updateStatus(p.order_id, e.target.value)
                      }
                    >
                      <option value="unpaid">Unpaid</option>
                      <option value="paid">Paid</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
}