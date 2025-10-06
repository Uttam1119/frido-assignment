import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext.jsx";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [err, setErr] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      login(data);
      navigate("/");
    } catch (error) {
      setErr(error.message);
    }
  };

  return (
    <div className="card">
      {" "}
      <h2>Login</h2>{" "}
      <form onSubmit={handleSubmit}>
        {" "}
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
        <button className="btn">Login</button>{" "}
      </form>{" "}
    </div>
  );
}

export default Login;
