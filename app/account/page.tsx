"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AccountPage() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("account");
  const [activeSettingTab, setActiveSettingTab] = useState("details");

  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);

  const [settingsData, setSettingsData] = useState({
    fullName: "",
    email: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    postalCode: "",
    country: "Nepal",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    paymentType: "eSewa",
    paymentName: "",
    paymentNumber: "",
  });

  useEffect(() => {
    const savedUser = sessionStorage.getItem("user");

    if (!savedUser) {
      router.push("/");
      return;
    }

    const parsedUser = JSON.parse(savedUser);
    setUser(parsedUser);

    setSettingsData((prev) => ({
      ...prev,
      fullName: parsedUser.full_name || parsedUser.name || "",
      email: parsedUser.email || "",
      phone: parsedUser.phone || "",
    }));

    const fetchOrders = async () => {
      try {
        setOrdersLoading(true);

        const res = await fetch("/api/my-orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: parsedUser.email,
          }),
        });

        const data = await res.json();

        if (res.ok) {
          setOrders(data.orders || []);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setOrdersLoading(false);
      }
    };

    const fetchSettings = async () => {
      try {
        const res = await fetch(
          `/api/account-settings?email=${encodeURIComponent(parsedUser.email)}`
        );

        const data = await res.json();

        if (res.ok && data.settings) {
          setSettingsData((prev) => ({
            ...prev,
            fullName: data.settings.fullName || prev.fullName,
            email: data.settings.email || prev.email,
            phone: data.settings.phone || "",
            addressLine1: data.settings.addressLine1 || "",
            addressLine2: data.settings.addressLine2 || "",
            city: data.settings.city || "",
            postalCode: data.settings.postalCode || "",
            country: data.settings.country || "Nepal",
            paymentType: data.settings.paymentType || "eSewa",
            paymentName: data.settings.paymentName || "",
            paymentNumber: data.settings.paymentNumber || "",
          }));
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
    fetchSettings();
  }, [router]);

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("userUpdated"));
    router.push("/");
  };

  const handleSaveSettings = async () => {
    if (!user?.email) {
      alert("User not found");
      return;
    }

    if (
      settingsData.newPassword &&
      settingsData.newPassword !== settingsData.confirmPassword
    ) {
      alert("New password and confirm password do not match");
      return;
    }

    try {
      setSavingSettings(true);

      const res = await fetch("/api/account-settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email,
          fullName: settingsData.fullName,
          phone: settingsData.phone,
          addressLine1: settingsData.addressLine1,
          addressLine2: settingsData.addressLine2,
          city: settingsData.city,
          postalCode: settingsData.postalCode,
          country: settingsData.country,
          currentPassword: settingsData.currentPassword,
          newPassword: settingsData.newPassword,
          paymentType: settingsData.paymentType,
          paymentName: settingsData.paymentName,
          paymentNumber: settingsData.paymentNumber,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to save settings");
        return;
      }

      const updatedUser = {
        ...user,
        full_name: settingsData.fullName,
        name: settingsData.fullName,
        phone: settingsData.phone,
      };

      sessionStorage.setItem("user", JSON.stringify(updatedUser));
      localStorage.removeItem("user");
      setUser(updatedUser);
      window.dispatchEvent(new Event("userUpdated"));

      setSettingsData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));

      alert("Settings saved successfully");
    } catch (error) {
      console.error(error);
      alert("Something went wrong while saving settings");
    } finally {
      setSavingSettings(false);
    }
  };

  const menuItems = [
    { key: "account", label: "My Account" },
    { key: "purchases", label: "Purchases" },
    { key: "returns", label: "Returns" },
    { key: "settings", label: "Settings" },
  ];

  const settingTabs = [
    { key: "details", label: "My Details" },
    { key: "address", label: "Add Address" },
    { key: "password", label: "Change Password" },
    { key: "payment", label: "Payment Account" },
  ];

  if (loading) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-sm uppercase tracking-wider">Loading...</p>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen text-black px-6 md:px-10 py-12">
      <div className="absolute inset-0 -z-10 bg-[url('/pattern.jpg')] bg-repeat opacity-20"></div>
      <div className="absolute inset-0 -z-10 bg-white/80"></div>

      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <p className="uppercase tracking-[0.25em] text-xs text-neutral-500 mb-3">
            Lily Studio
          </p>
          <h1 className="text-4xl md:text-5xl font-serif">My Account</h1>
          <p className="text-neutral-600 mt-3">
            Manage your profile, purchases, and account settings.
          </p>
        </div>

        <div className="grid lg:grid-cols-[280px_1fr] gap-8">
          <aside className="bg-white/90 border border-neutral-200 p-5 h-fit">
            <div className="border-b border-neutral-200 pb-5 mb-5">
              <p className="text-xs uppercase tracking-[0.2em] text-neutral-500 mb-2">
                Welcome
              </p>
              <h2 className="text-2xl font-serif">
                {user?.full_name || user?.name || "User"}
              </h2>
              <p className="text-sm text-neutral-600 mt-1">{user?.email}</p>
            </div>

            <div className="space-y-2">
              {menuItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => setActiveSection(item.key)}
                  className={`w-full text-left px-4 py-3 transition ${
                    activeSection === item.key
                      ? "bg-black text-white"
                      : "bg-[#f8f6f2] text-black hover:bg-neutral-100"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <button
              onClick={handleLogout}
              className="mt-6 w-full border border-black px-4 py-3 uppercase text-sm tracking-[0.2em] hover:bg-black hover:text-white transition"
            >
              Logout
            </button>
          </aside>

          <section className="space-y-6">
            {activeSection === "account" && (
              <>
                <div className="bg-white/90 border border-neutral-200 p-6 md:p-8">
                  <p className="uppercase tracking-[0.2em] text-xs text-neutral-500 mb-3">
                    Profile Overview
                  </p>
                  <h2 className="text-3xl font-serif mb-8">Personal Details</h2>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-[#f8f6f2] p-5">
                      <p className="text-sm text-neutral-500 mb-2">Full Name</p>
                      <p className="text-lg">
                        {user?.full_name || user?.name || "User"}
                      </p>
                    </div>

                    <div className="bg-[#f8f6f2] p-5">
                      <p className="text-sm text-neutral-500 mb-2">Email Address</p>
                      <p className="text-lg">{user?.email}</p>
                    </div>
                  </div>

                  <div className="pt-8">
                    <button
                      onClick={() => setActiveSection("settings")}
                      className="border border-black px-6 py-3 uppercase text-sm tracking-[0.2em] hover:bg-black hover:text-white transition"
                    >
                      Edit Details
                    </button>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-5">
                  <div className="bg-white/90 border border-neutral-200 p-6">
                    <p className="text-sm text-neutral-500 mb-2">Orders</p>
                    <h3 className="text-3xl font-serif">{orders.length}</h3>
                  </div>

                  <div className="bg-white/90 border border-neutral-200 p-6">
                    <p className="text-sm text-neutral-500 mb-2">Returns</p>
                    <h3 className="text-3xl font-serif">0</h3>
                  </div>

                  <div className="bg-white/90 border border-neutral-200 p-6">
                    <p className="text-sm text-neutral-500 mb-2">Status</p>
                    <h3 className="text-3xl font-serif">Active</h3>
                  </div>
                </div>
              </>
            )}

            {activeSection === "purchases" && (
              <div className="bg-white/90 border border-neutral-200 p-6 md:p-8">
                <p className="uppercase tracking-[0.2em] text-xs text-neutral-500 mb-3">
                  Order History
                </p>
                <h2 className="text-3xl font-serif mb-8">Purchases</h2>

                {ordersLoading ? (
                  <p className="text-neutral-600">Loading purchases...</p>
                ) : orders.length === 0 ? (
                  <div className="bg-[#f8f6f2] p-6">
                    <h3 className="text-xl font-serif mb-2">No purchases yet</h3>
                    <p className="text-neutral-600">
                      Once you place an order, your purchase details will appear
                      here.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {orders.map((order) => (
                      <div
                        key={order.order_id}
                        className="border border-neutral-200 bg-[#f8f6f2] p-5 md:p-6"
                      >
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                          <div>
                            <p className="text-xs uppercase tracking-[0.2em] text-neutral-500 mb-2">
                              Order
                            </p>
                            <h3 className="text-2xl font-serif">
                              #{order.order_id}
                            </h3>
                          </div>

                          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 w-full">
                            <div>
                              <p className="text-sm text-neutral-500 mb-1">Total</p>
                              <p className="font-medium">Rs. {order.total_amount}</p>
                            </div>

                            <div>
                              <p className="text-sm text-neutral-500 mb-1">
                                Payment Method
                              </p>
                              <p className="font-medium">
                                {order.payment_method || "N/A"}
                              </p>
                            </div>

                            <div>
                              <p className="text-sm text-neutral-500 mb-1">
                                Order Status
                              </p>
                              <p className="font-medium">
                                {order.order_status || "N/A"}
                              </p>
                            </div>

                            <div>
                              <p className="text-sm text-neutral-500 mb-1">
                                Payment Status
                              </p>
                              <p className="font-medium">
                                {order.payment_status || "N/A"}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="mt-5 pt-5 border-t border-neutral-200">
                          <p className="text-sm text-neutral-500 mb-1">
                            Created At
                          </p>
                          <p>
                            {order.created_at
                              ? new Date(order.created_at).toLocaleDateString()
                              : "N/A"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeSection === "returns" && (
              <div className="bg-white/90 border border-neutral-200 p-6 md:p-8">
                <p className="uppercase tracking-[0.2em] text-xs text-neutral-500 mb-3">
                  Returns
                </p>
                <h2 className="text-3xl font-serif mb-8">Return Requests</h2>

                <div className="bg-[#f8f6f2] p-6">
                  <h3 className="text-xl font-serif mb-2">No return requests</h3>
                  <p className="text-neutral-600">
                    Your return information will appear here when you request a
                    return.
                  </p>
                </div>
              </div>
            )}

            {activeSection === "settings" && (
              <div className="bg-white/95 border border-neutral-200 p-6 md:p-8">
                <h2 className="text-3xl font-serif mb-8">Account Settings</h2>

                <div className="grid lg:grid-cols-[240px_1fr] gap-8">
                  <div className="space-y-3">
                    {settingTabs.map((tab) => (
                      <button
                        key={tab.key}
                        onClick={() => setActiveSettingTab(tab.key)}
                        className={`w-full text-left px-4 py-3 border transition ${
                          activeSettingTab === tab.key
                            ? "bg-black text-white border-black"
                            : "bg-[#f8f6f2] text-black border-neutral-200 hover:bg-neutral-100"
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-6">
                    {activeSettingTab === "details" && (
                      <div className="space-y-4">
                        <h3 className="text-2xl font-serif">My Details</h3>

                        <div>
                          <label className="block text-sm text-neutral-600 mb-2">
                            Full Name
                          </label>
                          <input
                            type="text"
                            value={settingsData.fullName}
                            onChange={(e) =>
                              setSettingsData({
                                ...settingsData,
                                fullName: e.target.value,
                              })
                            }
                            className="w-full border border-neutral-200 bg-white px-4 py-3 outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-sm text-neutral-600 mb-2">
                            Email
                          </label>
                          <input
                            type="email"
                            value={settingsData.email}
                            readOnly
                            className="w-full border border-neutral-200 bg-[#f1f1f1] px-4 py-3 outline-none text-neutral-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm text-neutral-600 mb-2">
                            Phone Number
                          </label>
                          <input
                            type="text"
                            value={settingsData.phone}
                            onChange={(e) =>
                              setSettingsData({
                                ...settingsData,
                                phone: e.target.value,
                              })
                            }
                            className="w-full border border-neutral-200 bg-white px-4 py-3 outline-none"
                          />
                        </div>
                      </div>
                    )}

                    {activeSettingTab === "address" && (
                      <div className="space-y-4">
                        <h3 className="text-2xl font-serif">Add Address</h3>

                        <div>
                          <label className="block text-sm text-neutral-600 mb-2">
                            Address Line 1
                          </label>
                          <input
                            type="text"
                            value={settingsData.addressLine1}
                            onChange={(e) =>
                              setSettingsData({
                                ...settingsData,
                                addressLine1: e.target.value,
                              })
                            }
                            className="w-full border border-neutral-200 bg-white px-4 py-3 outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-sm text-neutral-600 mb-2">
                            Address Line 2
                          </label>
                          <input
                            type="text"
                            value={settingsData.addressLine2}
                            onChange={(e) =>
                              setSettingsData({
                                ...settingsData,
                                addressLine2: e.target.value,
                              })
                            }
                            className="w-full border border-neutral-200 bg-white px-4 py-3 outline-none"
                          />
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm text-neutral-600 mb-2">
                              City
                            </label>
                            <input
                              type="text"
                              value={settingsData.city}
                              onChange={(e) =>
                                setSettingsData({
                                  ...settingsData,
                                  city: e.target.value,
                                })
                              }
                              className="w-full border border-neutral-200 bg-white px-4 py-3 outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-sm text-neutral-600 mb-2">
                              Postal Code
                            </label>
                            <input
                              type="text"
                              value={settingsData.postalCode}
                              onChange={(e) =>
                                setSettingsData({
                                  ...settingsData,
                                  postalCode: e.target.value,
                                })
                              }
                              className="w-full border border-neutral-200 bg-white px-4 py-3 outline-none"
                          />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm text-neutral-600 mb-2">
                            Country
                          </label>
                          <input
                            type="text"
                            value={settingsData.country}
                            onChange={(e) =>
                              setSettingsData({
                                ...settingsData,
                                country: e.target.value,
                              })
                            }
                            className="w-full border border-neutral-200 bg-white px-4 py-3 outline-none"
                          />
                        </div>
                      </div>
                    )}

                    {activeSettingTab === "password" && (
                      <div className="space-y-4">
                        <h3 className="text-2xl font-serif">Change Password</h3>

                        <div>
                          <label className="block text-sm text-neutral-600 mb-2">
                            Current Password
                          </label>
                          <input
                            type="password"
                            value={settingsData.currentPassword}
                            onChange={(e) =>
                              setSettingsData({
                                ...settingsData,
                                currentPassword: e.target.value,
                              })
                            }
                            className="w-full border border-neutral-200 bg-white px-4 py-3 outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-sm text-neutral-600 mb-2">
                            New Password
                          </label>
                          <input
                            type="password"
                            value={settingsData.newPassword}
                            onChange={(e) =>
                              setSettingsData({
                                ...settingsData,
                                newPassword: e.target.value,
                              })
                            }
                            className="w-full border border-neutral-200 bg-white px-4 py-3 outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-sm text-neutral-600 mb-2">
                            Confirm Password
                          </label>
                          <input
                            type="password"
                            value={settingsData.confirmPassword}
                            onChange={(e) =>
                              setSettingsData({
                                ...settingsData,
                                confirmPassword: e.target.value,
                              })
                            }
                            className="w-full border border-neutral-200 bg-white px-4 py-3 outline-none"
                          />
                        </div>
                      </div>
                    )}

                    {activeSettingTab === "payment" && (
                      <div className="space-y-4">
                        <h3 className="text-2xl font-serif">Payment Account</h3>

                        <div>
                          <label className="block text-sm text-neutral-600 mb-2">
                            Payment Type
                          </label>
                          <select
                            value={settingsData.paymentType}
                            onChange={(e) =>
                              setSettingsData({
                                ...settingsData,
                                paymentType: e.target.value,
                              })
                            }
                            className="w-full border border-neutral-200 bg-white px-4 py-3 outline-none"
                          >
                            <option>eSewa</option>
                            <option>Khalti</option>
                            <option>Bank Account</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm text-neutral-600 mb-2">
                            Account Name
                          </label>
                          <input
                            type="text"
                            value={settingsData.paymentName}
                            onChange={(e) =>
                              setSettingsData({
                                ...settingsData,
                                paymentName: e.target.value,
                              })
                            }
                            className="w-full border border-neutral-200 bg-white px-4 py-3 outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-sm text-neutral-600 mb-2">
                            Account Number / ID
                          </label>
                          <input
                            type="text"
                            value={settingsData.paymentNumber}
                            onChange={(e) =>
                              setSettingsData({
                                ...settingsData,
                                paymentNumber: e.target.value,
                              })
                            }
                            className="w-full border border-neutral-200 bg-white px-4 py-3 outline-none"
                          />
                        </div>
                      </div>
                    )}

                    <div className="pt-4">
                      <button
                        onClick={handleSaveSettings}
                        disabled={savingSettings}
                        className="border border-black px-6 py-3 uppercase text-sm tracking-[0.2em] hover:bg-black hover:text-white transition disabled:opacity-50"
                      >
                        {savingSettings ? "Saving..." : "Save Changes"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}