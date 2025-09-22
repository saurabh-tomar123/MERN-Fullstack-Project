import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from 'react-router-dom'


export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [data,setData]= useState([])
  const [selectedId,setSelectedId]= useState('')
  const [message, setMessage] = useState("");
  const navigate  = useNavigate()
  const token = localStorage.getItem('token')

  useEffect(()=> {
    getData()
  },[])

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit form
  const handleSubmit = async (e) => {
      e.preventDefault();
            try {
              const res = await axios.post("http://localhost:5000/auth/login", formData);
              setMessage(res.data.message || "Login successful!");
              localStorage.setItem('token', res.data.token)
              localStorage.setItem('userId', res.data.id)
              setTimeout(() => {
                navigate('/todo')
            }, 1000);
            } catch (err) {
              setMessage(err.response?.data?.message || "Login failed!");
            }
    }


  const getData = async () => {
    try {
      const res = await axios.get("http://localhost:5000/table-data/users");
     setData([...res.data])
      setMessage(res.data.message || "Fetched successful!");
    } catch (err) {
      setMessage(err.response?.data?.message || "Fetched failed!");
    }
  };


    const deletuser = async () => {
    try {
        
      const res = await axios.delete(`http://localhost:5000/api/auth/delete/${selectedId}`, {
     headers: {
    "Authorization": `Bearer ${token}`
       }
    });
        getData()
      setMessage(res.data.message || "Fetched successful!");
    } catch (err) {
      setMessage(err.response?.data?.message || "Fetched failed!");
    }
  };

  async function sendOtp() {
  try {
    const res = await axios.post(
      "http://localhost:5000/api/auth/send-otp",
      { email: formData.email }, // <-- This is the request body
      {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );

    setMessage(res.data.message || "OTP sent successfully!");
    getData();
  } catch (err) {
    setMessage(err.response?.data?.message || "OTP sending failed!");
  }
}

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Login</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
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
        <button type="submit" style={styles.button}>Login</button>
      </form>
      {message && <p style={styles.message}>{message}</p>}
      <Link to='/'>Sign Up</Link><br/>
      <br/>

       <button  style={{backgroundColor: "white", color:"red", fontWeight: "bold"}} onClick={deletuser}>Delete</button>

           <button onClick={sendOtp}>sendOtp</button> 
       <div>
        {
            data && data.map((item, index)=> 
            <div key={index} onClick={()=> setSelectedId(item._id)}
            style={{backgroundColor:"gray", borderRadius:"20px",
                margin:"5px",padding:"5px"
            }}
            >
            <span>
                {item.email}
                </span>
                
                <p>{item._id}</p></div>
                )
        }
       </div>
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
