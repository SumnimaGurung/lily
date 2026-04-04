"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const router = useRouter();

  const [isLogin, setIsLogin] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
      const url = isLogin ? "/api/login" : "/api/register";

      const body = isLogin
        ? { email, password }
        : { name, email, password };

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Something went wrong");
        return;
      }

      setMessage(data.message);

      setTimeout(() => {
        router.push("/home");
      }, 1000);
    } catch (error) {
      console.error(error);
      setMessage("Server error");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 relative">
      <button
        onClick={() => router.push("/home")}
        className="absolute top-6 right-6 bg-white px-4 py-2 rounded-lg shadow"
      >
        Skip
      </button>

      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-4">Lily Studio</h1>

        <div className="flex mb-4 border rounded-lg overflow-hidden">
          <button
            type="button"
            className={`w-1/2 py-2 ${isLogin ? "bg-black text-white" : "bg-white text-black"}`}
            onClick={() => {
              setIsLogin(true);
              setMessage("");
            }}
          >
            Login
          </button>

          <button
            type="button"
            className={`w-1/2 py-2 ${!isLogin ? "bg-black text-white" : "bg-white text-black"}`}
            onClick={() => {
              setIsLogin(false);
              setMessage("");
            }}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {!isLogin && (
            <input
              type="text"
              placeholder="Full Name"
              className="w-full border p-2 rounded"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required={!isLogin}
            />
          )}

          <input
            type="email"
            placeholder="Email"
            className="w-full border p-2 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border p-2 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {message && (
            <p className="text-center text-sm text-red-500">{message}</p>
          )}

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded"
          >
            {isLogin ? "Login" : "Register"}
          </button>
        </form>
      </div>
    </main>
  );
}