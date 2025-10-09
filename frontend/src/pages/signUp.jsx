import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/signup`, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(form),
      // });
      await axios.post(`${import.meta.env.VITE_API_URL}/auth/signup`, form, {
        headers: { "Content-Type": "application/json" },
      });
      // const data = res.data();
      // if (!res.ok) throw new Error(data.message);
      alert("Signup successful! Please login.");
      navigate("/login");
    } catch (error) {
      const msg =
        error.response?.data?.message || "Something went wrong. Try again.";
      setErr(msg);
    }
  };

  return (
    <div className="mt-35 flex items-center justify-center ">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Create Account
        </h2>

        {err && (
          <p className="text-center text-red-500 text-sm mb-4 animate-pulse">
            {err}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              name="name"
              placeholder="Enter your name"
              value={form.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition duration-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              name="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition duration-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              name="password"
              type="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition duration-200"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 text-white font-semibold py-3 rounded-xl hover:bg-green-600 transform hover:-translate-y-0.5 transition-all duration-200"
          >
            Sign Up
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-gray-500 mb-2">Already have an account?</p>
          <button
            onClick={() => navigate("/login")}
            className="bg-indigo-600 text-white font-semibold px-6 py-2 rounded-xl hover:bg-indigo-700 transition duration-200"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default Signup;
