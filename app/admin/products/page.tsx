"use client";

import { useEffect, useState } from "react";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [displayLabel, setDisplayLabel] = useState("new");
  const [productStatus, setProductStatus] = useState("active");
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/admin/products");
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setImage(reader.result as string);
    };

    reader.readAsDataURL(file);
  };

  const handleAddProduct = async () => {
    if (!name || !price || !image) {
      alert("Please fill all fields");
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
          image,
          displayLabel,
          productStatus,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      alert("Product added successfully");

      setName("");
      setPrice("");
      setImage("");
      setDisplayLabel("new");
      setProductStatus("active");

      fetchProducts();
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch("/api/admin/products/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId: id }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      fetchProducts();
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  };

  return (
    <main className="space-y-6">
      <div>
        <p className="text-sm text-gray-500">Admin Panel</p>
        <h1 className="text-3xl font-semibold">Products</h1>
      </div>

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

        <input
          type="file"
          accept="image/*"
          className="w-full border p-3 rounded-lg"
          onChange={handleImageUpload}
        />

        {image && (
          <img
            src={image}
            alt="Preview"
            className="w-28 h-28 object-cover rounded-lg border"
          />
        )}

        <select
          className="w-full border p-3 rounded-lg"
          value={displayLabel}
          onChange={(e) => setDisplayLabel(e.target.value)}
        >
          <option value="new">New</option>
          <option value="restocked">Restocked</option>
          <option value="regular">Regular</option>
        </select>

        <select
          className="w-full border p-3 rounded-lg"
          value={productStatus}
          onChange={(e) => setProductStatus(e.target.value)}
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        <button
          onClick={handleAddProduct}
          className="bg-black text-white px-5 py-3 rounded-lg"
        >
          Add Product
        </button>
      </div>

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
                className="flex justify-between items-center border p-4 rounded-lg gap-4"
              >
                <div className="flex items-center gap-4">
                  {p.image ? (
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-20 h-20 object-cover rounded-lg border"
                    />
                  ) : (
                    <div className="w-20 h-20 border rounded-lg flex items-center justify-center text-xs text-gray-400">
                      No image
                    </div>
                  )}

                  <div className="space-y-1">
                    <p className="font-medium">{p.name}</p>
                    <p className="text-sm text-gray-500">${p.price}</p>
                    <p className="text-sm text-gray-500 capitalize">
                      Label: {p.display_label}
                    </p>
                    <p className="text-sm text-gray-500 capitalize">
                      Status: {p.product_status}
                    </p>
                  </div>
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