"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

export default function AdminPage() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState<any>({
    totalOrders: 0,
    totalUsers: 0,
    totalSales: 0,
  });

  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (!savedUser) {
      router.push("/");
      return;
    }

    const parsedUser = JSON.parse(savedUser);

    if (parsedUser.role !== "admin") {
      router.push("/home");
      return;
    }

    setUser(parsedUser);

    const fetchData = async () => {
      try {
        const res = await fetch("/api/admin/dashboard");
        const data = await res.json();

        setStats({
          totalOrders: data.totalOrders,
          totalUsers: data.totalUsers,
          totalSales: data.totalSales,
        });

        const formatted = data.statusData.map((item: any) => ({
          name: item.order_status,
          value: item.count,
        }));

        setChartData(formatted);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const COLORS = ["#000000", "#888888", "#cccccc"];

  if (loading) {
    return (
      <main className="min-h-screen bg-white text-black px-6 py-10">
        <p>Loading...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white text-black px-6 md:px-10 py-10">
      <h1 className="text-3xl font-serif mb-8">Admin Dashboard</h1>

      {/* STAT CARDS */}
      <div className="grid md:grid-cols-3 gap-6 mb-10">
        <div className="border p-6">
          <p className="text-sm text-gray-500">Total Orders</p>
          <h2 className="text-2xl font-medium">{stats.totalOrders}</h2>
        </div>

        <div className="border p-6">
          <p className="text-sm text-gray-500">Total Users</p>
          <h2 className="text-2xl font-medium">{stats.totalUsers}</h2>
        </div>

        <div className="border p-6">
          <p className="text-sm text-gray-500">Total Sales</p>
          <h2 className="text-2xl font-medium">${stats.totalSales}</h2>
        </div>
      </div>

      {/* PIE CHART */}
      <div className="border p-6">
        <h2 className="text-xl mb-4">Order Status</h2>

        <PieChart width={300} height={300}>
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
    </main>
  );
}