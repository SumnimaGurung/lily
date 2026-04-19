"use client";

import { useState } from "react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [messageText, setMessageText] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          orderNumber,
          message: messageText,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Something went wrong");
        setLoading(false);
        return;
      }

      setMessage("Message sent successfully!");
      setName("");
      setEmail("");
      setOrderNumber("");
      setMessageText("");
    } catch (error) {
      console.error(error);
      setMessage("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f7f7f7] px-6 md:px-20 py-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl md:text-3xl tracking-widest mb-6">
          Send Us A Message
        </h1>

        <hr className="mb-8 border-gray-300" />

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            placeholder="Name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-400 px-4 py-4 bg-transparent outline-none"
          />

          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-400 px-4 py-4 bg-transparent outline-none"
          />

          <input
            type="text"
            placeholder="Order number (optional)"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            className="w-full border border-gray-400 px-4 py-4 bg-transparent outline-none"
          />

          <textarea
            placeholder="Type your message here – please do not message over multiple platforms as this can slow down the response time"
            rows={6}
            required
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            className="w-full border border-gray-400 px-4 py-4 bg-transparent outline-none resize-none"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-black text-white px-8 py-4 uppercase tracking-wider hover:opacity-80 transition disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>

        {message && (
          <p className="mt-6 text-sm text-green-600">{message}</p>
        )}
      </div>
    </main>
  );
}