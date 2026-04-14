"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const router = useRouter();

  const [cartItems, setCartItems] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (!savedUser) {
      alert("Please login first to continue checkout.");
      router.push("/");
      return;
    }

    const user = JSON.parse(savedUser);

    if (user.full_name) {
      setName(user.full_name);
    } else if (user.name) {
      setName(user.name);
    }

    if (user.email) {
      setEmail(user.email);
    }

    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }

    setLoading(false);
  }, [router]);

  const total = cartItems.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);

  const handleOrder = async () => {
    if (!name || !email || !address || !city || !postalCode || !phone) {
      alert("Please fill all details");
      return;
    }

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          address,
          city,
          postalCode,
          phone,
          total,
          paymentMethod,
          cartItems,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      alert("Order placed successfully!");

      localStorage.removeItem("cart");
      setCartItems([]);
      window.dispatchEvent(new Event("cartUpdated"));

      router.push("/account");
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-white text-black px-6 md:px-10 py-10">
        <p>Loading...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white text-black px-6 md:px-10 py-10">
      <h1 className="text-3xl font-serif mb-8">Checkout</h1>

      <div className="grid md:grid-cols-2 gap-10">
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full border p-3"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full border p-3"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="text"
            placeholder="Address"
            className="w-full border p-3"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />

          <input
            type="text"
            placeholder="City"
            className="w-full border p-3"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />

          <input
            type="text"
            placeholder="Postal Code"
            className="w-full border p-3"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
          />

          <input
            type="text"
            placeholder="Phone"
            className="w-full border p-3"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <div className="border p-4 mt-2">
            <p className="font-medium mb-3">Payment Method</p>

            <label className="flex items-center gap-2 mb-2">
              <input
                type="radio"
                name="paymentMethod"
                value="COD"
                checked={paymentMethod === "COD"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              Cash on Delivery
            </label>

            <label className="flex items-center gap-2 mb-2">
              <input
                type="radio"
                name="paymentMethod"
                value="eSewa"
                checked={paymentMethod === "eSewa"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              eSewa
            </label>

            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="paymentMethod"
                value="Khalti"
                checked={paymentMethod === "Khalti"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              Khalti
            </label>
          </div>

          <button
            onClick={handleOrder}
            className="w-full bg-black text-white py-3 mt-4"
          >
            Place Order
          </button>
        </div>

        <div className="border p-6">
          <h2 className="text-xl mb-4">Order Summary</h2>

          {cartItems.map((item) => (
            <div key={item.id} className="flex justify-between mb-2">
              <span>
                {item.name} x {item.quantity}
              </span>
              <span>${item.price * item.quantity}</span>
            </div>
          ))}

          <div className="border-t mt-4 pt-4 space-y-2">
            <div className="flex justify-between">
              <span>Payment Method</span>
              <span>{paymentMethod}</span>
            </div>

            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>${total}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}