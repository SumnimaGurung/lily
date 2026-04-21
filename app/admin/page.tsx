"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

export default function AdminPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalUsers: 0,
    totalSales: 0,
  });
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    const savedUser = sessionStorage.getItem("user");

    if (!savedUser) {
      router.push("/");
      return;
    }

    const parsedUser = JSON.parse(savedUser);

    if (parsedUser.role !== "admin") {
      router.push("/home");
      return;
    }

    const fetchDashboard = async () => {
      try {
        const res = await fetch("/api/admin/dashboard");
        const data = await res.json();

        setStats({
          totalOrders: data.totalOrders || 0,
          totalUsers: data.totalUsers || 0,
          totalSales: data.totalSales || 0,
        });

        const formattedData = Array.isArray(data.statusData)
          ? data.statusData.map((item: any) => ({
              name: item.order_status || "unknown",
              value: item.count || 0,
            }))
          : [];

        setChartData(formattedData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [router]);

  const COLORS = ["#111111", "#666666", "#9ca3af", "#d1d5db"];

  if (loading) {
    return <p className="text-gray-600">Loading dashboard...</p>;
  }

  return (
    <main className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <p className="text-sm text-gray-500 mb-2">Lily Studio Admin</p>
          <h1 className="text-3xl md:text-4xl font-semibold">Dashboard</h1>
          <p className="text-gray-500 mt-2">
            Overview of purchases, customers, and sales.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => router.push("/admin/orders")}
            className="bg-black text-white px-5 py-3 rounded-xl"
          >
            View Purchases
          </button>

          <button
            onClick={() => router.push("/admin/products")}
            className="border border-gray-300 px-5 py-3 rounded-xl bg-white"
          >
            Manage Products
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <p className="text-sm text-gray-500 mb-3">Total Purchases</p>
          <h2 className="text-3xl font-semibold">{stats.totalOrders}</h2>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <p className="text-sm text-gray-500 mb-3">Total Customers</p>
          <h2 className="text-3xl font-semibold">{stats.totalUsers}</h2>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <p className="text-sm text-gray-500 mb-3">Total Sales</p>
          <h2 className="text-3xl font-semibold">
            Rs {Number(stats.totalSales).toLocaleString()}
          </h2>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-medium mb-6">Order Status</h2>

          <div className="flex justify-center">
            <PieChart width={420} height={320}>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-xl font-medium">Quick Actions</h2>

          <button
            onClick={() => router.push("/admin/orders")}
            className="w-full text-left border border-gray-200 rounded-xl px-4 py-3 hover:bg-gray-50"
          >
            Go to Purchases
          </button>

          <button
            onClick={() => router.push("/admin/customers")}
            className="w-full text-left border border-gray-200 rounded-xl px-4 py-3 hover:bg-gray-50"
          >
            View Customers
          </button>

          <button
            onClick={() => router.push("/admin/products")}
            className="w-full text-left border border-gray-200 rounded-xl px-4 py-3 hover:bg-gray-50"
          >
            Manage Products
          </button>

          <button
            onClick={() => router.push("/admin/payments")}
            className="w-full text-left border border-gray-200 rounded-xl px-4 py-3 hover:bg-gray-50"
          >
            Check Payments
          </button>
        </div>
      </div>
    </main>
  );
}