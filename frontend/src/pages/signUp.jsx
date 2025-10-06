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
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      alert("Signup successful! Please login.");
      navigate("/login");
    } catch (error) {
      setErr(error.message);
    }
  };

  return (
    <div className="card">
      {" "}
      <h2>Sign Up</h2>{" "}
      <form onSubmit={handleSubmit}>
        {" "}
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
        />{" "}
        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />{" "}
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
        />
        {err && <p style={{ color: "red" }}>{err}</p>}{" "}
        <button className="btn">Sign Up</button>{" "}
      </form>{" "}
    </div>
  );
}

export default Signup;
