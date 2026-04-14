"use client";

import { useEffect, useState } from "react";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/admin/products");
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddProduct = async () => {
    if (!name || !price) {
      alert("Fill all fields");
      return;
    }

    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          price: Number(price),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      setName("");
      setPrice("");
      fetchProducts();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await fetch("/api/admin/products/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId: id }),
      });

      fetchProducts();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main className="space-y-6">
      <div>
        <p className="text-sm text-gray-500">Admin Panel</p>
        <h1 className="text-3xl font-semibold">Products</h1>
      </div>

      {/* ADD PRODUCT */}
      <div className="bg-white border rounded-2xl p-6 space-y-4">
        <h2 className="text-xl font-medium">Add Product</h2>

        <input
          type="text"
          placeholder="Product name"
          className="w-full border p-3 rounded-lg"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="number"
          placeholder="Price"
          className="w-full border p-3 rounded-lg"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <button
          onClick={handleAddProduct}
          className="bg-black text-white px-5 py-3 rounded-lg"
        >
          Add Product
        </button>
      </div>

      {/* PRODUCT LIST */}
      <div className="bg-white border rounded-2xl overflow-hidden">
        {loading ? (
          <p className="p-6">Loading...</p>
        ) : products.length === 0 ? (
          <p className="p-6 text-gray-500">No products found</p>
        ) : (
          <div className="space-y-3 p-4">
            {products.map((p) => (
              <div
                key={p.product_id}
                className="flex justify-between items-center border p-4 rounded-lg"
              >
                <div>
                  <p className="font-medium">{p.name}</p>
                  <p className="text-sm text-gray-500">${p.price}</p>
                </div>

                <button
                  onClick={() => handleDelete(p.product_id)}
                  className="text-red-600"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}