import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import "../Styles/editProfile.css";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const [form, setForm] = useState({
    name: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();

  const [role, setRole] = useState("user");
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setForm({
      name: user.name || "",
      lastname: user.lastname || "",
      email: user.email || "",
      password: "",
      confirmPassword: "",
    });
    setRole(user.role || "user");
    setUserId(user.id || "");
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const url =
      role === "admin"
        ? `http://localhost:8000/api/v1/updateAdmin/${userId}`
        : `http://localhost:8000/api/v1/updateUser/${userId}`;

    try {
      const res = await axios.put(url, form);
      toast.success(res.data.msg || "Profile updated");
      navigate("/signin");
    } catch (err) {
      toast.error(err.response?.data?.msg || "Error updating profile");
    }
  };

  return (
    <div className="container">
      <div className="content">
        <h2 className="section-title">Settings</h2>
        <div className="edit-card">
          <div className="edit-tab">Edit Profile</div>

          <div className="form-group">
            <label>First name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Last name</label>
            <input
              type="text"
              name="lastname"
              value={form.lastname}
              onChange={handleChange}
            />
          </div>

          <div className="form-group tooltip-container">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
            />
            <span className="tooltip">Email change will affect login</span>
          </div>

          <div className="form-group tooltip-container">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
            />
            <span className="tooltip">User will be logged out immediately</span>
          </div>

          <div className="form-group tooltip-container">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
            />
            <span className="tooltip">User will be logged out immediately</span>
          </div>

          <button className="save-btn" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
