"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const router = useRouter();

  const [isLogin, setIsLogin] = useState(true);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLogin && password !== confirmPassword) {
      setToast({ message: "Passwords do not match", type: "error" });
      return;
    }

    try {
      const url = isLogin ? "/api/login" : "/api/register";

      const body = isLogin
        ? { email, password }
        : {
            name: firstName + " " + lastName,
            email,
            password,
            phone,
          };

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setToast({
          message: data.message || "Something went wrong",
          type: "error",
        });
        return;
      }

      if (isLogin) {
        sessionStorage.setItem("user", JSON.stringify(data.user));
        localStorage.removeItem("user");
        window.dispatchEvent(new Event("userUpdated"));

        setToast({ message: "Login successful", type: "success" });

        setTimeout(() => {
          if (data.user.role === "admin") {
            router.push("/admin");
          } else {
            router.push("/home");
          }
        }, 1500);
      } else {
        setToast({
          message: "Registration successful. Please login.",
          type: "success",
        });

        setIsLogin(true);
        setFirstName("");
        setLastName("");
        setPhone("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
      }
    } catch (error) {
      console.error(error);
      setToast({ message: "Server error", type: "error" });
    }
  };

  return (
    <main className="min-h-screen bg-[#f5f5f5] flex items-center justify-center px-4 relative">
      <button
        onClick={() => router.push("/home")}
        className="absolute top-6 right-6 bg-white px-4 py-2 shadow-sm"
      >
        Skip
      </button>

      <div className="w-full max-w-md text-center">
        <h1 className="text-3xl tracking-[0.2em] mb-3">
          {isLogin ? "WELCOME BACK" : "CREATE ACCOUNT"}
        </h1>

        <form onSubmit={handleSubmit} className="bg-white p-8 shadow-sm space-y-4">
          {!isLogin && (
            <>
              <input
                type="text"
                placeholder="First Name"
                className="w-full border border-gray-400 p-3 text-sm focus:outline-none"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />

              <input
                type="text"
                placeholder="Last Name"
                className="w-full border border-gray-400 p-3 text-sm focus:outline-none"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />

              <input
                type="text"
                placeholder="Phone Number"
                className="w-full border border-gray-400 p-3 text-sm focus:outline-none"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </>
          )}

          <input
            type="email"
            placeholder="Enter Email address"
            className="w-full border border-gray-400 p-3 text-sm focus:outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Enter password"
            className="w-full border border-gray-400 p-3 text-sm focus:outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {!isLogin && (
            <input
              type="password"
              placeholder="Confirm password"
              className="w-full border border-gray-400 p-3 text-sm focus:outline-none"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          )}

          <button
            type="submit"
            className="w-full bg-black text-white py-3 text-sm tracking-[0.2em]"
          >
            {isLogin ? "LOGIN" : "CREATE ACCOUNT"}
          </button>
        </form>

        <div className="mt-6 text-sm text-gray-700 space-y-2">
          {isLogin ? (
            <>
              <p>
                <span
                  className="underline cursor-pointer"
                  onClick={() => {
                    setIsLogin(false);
                    setToast(null);
                  }}
                >
                  Register
                </span>
              </p>

              <p className="underline cursor-pointer">Forgot your password?</p>
            </>
          ) : (
            <p>
              Already have an account?{" "}
              <span
                className="underline cursor-pointer"
                onClick={() => {
                  setIsLogin(true);
                  setToast(null);
                }}
              >
                Login
              </span>
            </p>
          )}
        </div>
      </div>

      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
          <div
            className={`px-6 py-3 rounded shadow-lg text-white text-sm tracking-wide ${
              toast.type === "success" ? "bg-green-600" : "bg-red-500"
            }`}
          >
            {toast.message}
          </div>
        </div>
      )}
    </main>
  );
}