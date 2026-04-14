"use client";

import { useEffect, useState } from "react";

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchCustomers = async () => {
    try {
      const res = await fetch(`/api/admin/customers?search=${search}`);
      const data = await res.json();
      setCustomers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [search]);

  return (
    <main className="space-y-6">
      <div>
        <p className="text-sm text-gray-500">Admin Panel</p>
        <h1 className="text-3xl font-semibold">Customers</h1>
      </div>

      <div className="bg-white border rounded-2xl p-4">
        <input
          type="text"
          placeholder="Search by name, email or phone..."
          className="w-full border p-3 rounded-lg"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="bg-white border rounded-2xl overflow-hidden">
        {loading ? (
          <p className="p-6">Loading...</p>
        ) : customers.length === 0 ? (
          <p className="p-6 text-gray-500">No customers found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left">
                <tr>
                  <th className="p-4">ID</th>
                  <th className="p-4">Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Phone</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Created</th>
                </tr>
              </thead>

              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.user_id} className="border-t">
                    <td className="p-4">#{customer.user_id}</td>
                    <td className="p-4">{customer.full_name}</td>
                    <td className="p-4">{customer.email}</td>
                    <td className="p-4">{customer.phone || "—"}</td>
                    <td className="p-4 capitalize">
                      {customer.role || "customer"}
                    </td>
                    <td className="p-4">
                      {customer.created_at
                        ? new Date(customer.created_at).toLocaleDateString()
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}