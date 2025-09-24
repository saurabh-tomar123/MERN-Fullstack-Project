import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom'

export default function Signup() {
  const [formData, setFormData] = useState({ email: "", password:"", userName:"" });
  const [message, setMessage] = useState("");
  const navigate  = useNavigate()

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit form
  const handleSubmit = async (e) => {
      e.preventDefault();
        try {
            const res = await axios.post("https://mern-fullstack-project-navy.vercel.app/auth/register", formData);
            setMessage(res.data.message || "Registration successful!");
            setTimeout(() => {
                navigate('/')
            }, 1000);
            } catch (err) {
            setMessage(err.response?.data?.message || "Registration failed!");
            }
    }

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Register</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          name="userName"
          placeholder="Enter userName"
          value={formData.userName}
          onChange={handleChange}
          style={styles.input}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Enter Email"
          value={formData.email}
          onChange={handleChange}
          style={styles.input}
          required
        />
        <input
          type="text"
          name="password"
          placeholder="Enter Password"
          value={formData.password}
          onChange={handleChange}
          style={styles.input}
          required
        />
        <button type="submit" style={styles.button}>Sign Up</button>
      </form>
      {message && <p style={styles.message}>{message}</p>}
    </div>
  );
}

// Inline CSS styles
const styles = {
  container: {
    width: "300px",
    margin: "50px auto",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    textAlign: "center",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
  },
  heading: {
    marginBottom: "15px",
    color: "#333"
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px"
  },
  input: {
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    fontSize: "16px"
  },
  button: {
    padding: "10px",
    border: "none",
    borderRadius: "5px",
    backgroundColor: "#4CAF50",
    color: "white",
    cursor: "pointer",
    fontSize: "16px"
  },
  message: {
    marginTop: "10px",
    color: "red"
  }
};
