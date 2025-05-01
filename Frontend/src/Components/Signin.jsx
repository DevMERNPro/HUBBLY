import React from "react";
import "../Styles/Sign.css";
import logo from "../images/logo.png";
import personlogo from "../images/person.png";
import { useNavigate } from "react-router-dom";
// import { toast } from "sonner";
// import axios from "axios";
// import config from "../config";
import { useForm } from 'react-hook-form';
import { useAuth } from "./context";

const SignIN = () => {
 const [role, setRole] = React.useState("");

 const { login } = useAuth();
 const {
  register,
  handleSubmit,
  formState: { errors },
} = useForm();

  const navigate = useNavigate()
  const handlenavigateup = ()=>{
    navigate("/signup")
  };

  const submit = async (data) => {
      await login(data, role);
  
  }


  return (
    <div className="container">
      {/* Left side: login form */}
      <div className="login-section">
        <div className="hlogo">
          <img src={logo} alt="Hubly Logo" className="logo" />
          <h2>Hubly</h2>
        </div>

        <div className="form">
          <h2>Sign in to your Plexify</h2>

          <form onSubmit={handleSubmit(submit)}>
          <input {...register("email")} type="text" placeholder="Email" />
            {errors.email && <p className="error">{errors.email.message}</p>}

            <input {...register("password")} type="password" placeholder="Password" />
            {errors.password && <p className="error">{errors.password.message}</p>}
            <select
  onChange={(e) => setRole(e.target.value)}
  style={{
    width: "80%",
    padding: "10px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    marginBottom: "15px",
    outline: "none",
    backgroundColor: "#fff",
  }}
>
<option value="">Select Role</option>

  <option value="user">User</option>
  <option value="admin">Admin</option>
  <option value="team">Team Member</option>

</select>
            <button type="submit">Log in</button>
          </form>
        </div>
        <div className="form-links">
          <p>
            Don't have an account? <a href="#" onClick={handlenavigateup}>Sign up</a>
          </p>
        </div>
        <p className="recaptcha-text">
          This site is protected by reCAPTCHA and the{" "}
          <a href="#">Google Privacy Policy</a> and{" "}
          <a href="#">Terms of Service</a> apply.
        </p>
      </div>

      {/* Right side: image */}
      <div className="image-section">
        <img src={personlogo} alt="Analytics Dashboard" />
      </div>
    </div>
  );
};

export default SignIN;
