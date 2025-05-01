import React from "react";
import "../Styles/Sign.css";
import logo from "../images/logo.png";
import personlogo from "../images/person.png";
import { useNavigate } from "react-router-dom";
import { useForm } from 'react-hook-form';
import userSchema from "../validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import axios from "axios";
import config from "../config";


const SignUp = () => {

 const [role, setRole] = React.useState("")
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(userSchema),
  });
  const navigate = useNavigate();

  const onSubmit = async(data) => {
    console.log(data,'getting data');
    try{
      if(role ===  "user"){
        const response = await axios.post(`${config.BASE_URL}/adduser`, {
          name: data.firstName,
          email: data.email,
          password: data.password,
          confirmPassword: data.confirmPassword,
          lastName: data.lastName,
        });
        console.log(response.data.msg);
        toast.success(response.data.message || response.data.msg, {
          action: {
            label: "Undo",
            onClick: () => console.log("Undo"),
          },
          style: {
            backgroundColor: "#4CAF50", // green background
            color: "#ffffff",            // white text
            border: "1px solid #3e8e41", // optional border
          },
        });
        reset();
      }else if(role === "admin"){
        const response = await axios.post(`${config.BASE_URL}/addadmin`, {
          name: data.firstName,
          email: data.email,
          password: data.password,
          confirmPassword: data.confirmPassword,
          lastName: data.lastName,
        });
        console.log(response.data);
        toast.success(response.data.message || response.data.msg, {
          action: {
            label: "Undo",
            onClick: () => console.log("Undo"),
          },
          style: {
            backgroundColor: "#4CAF50", // green background
            color: "#ffffff",            // white text
            border: "1px solid #3e8e41", // optional border
          },
        });
        
        reset();
      }
      // navigate("/signin");
    }catch(error){
      console.error(error);
      toast.error(error?.response?.data?.message || "Something went wrong!", {
        style: {
          backgroundColor: "#f44336", // Red background
          color: "#ffffff",           // White text
          border: "1px solid #d32f2f",// Optional dark red border
        },
        action: {
          label: "Dismiss",
          onClick: () => console.log("Error dismissed"),
        },
      });
      
    }
  };

  const handlenavigatein = ()=>{
    navigate("/signin")
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
          <h2>Sign Up to your Plexify</h2>

          <form onSubmit={handleSubmit(onSubmit)}>
            <input {...register("firstName")} type="text" placeholder="First Name" />
            {errors.firstName && <p className="error">{errors.firstName.message}</p>}

            <input {...register("lastName")} type="text" placeholder="Last Name" />
            {errors.lastName && <p className="error">{errors.lastName.message}</p>}

            <input {...register("email")} type="text" placeholder="Email" />
            {errors.email && <p className="error">{errors.email.message}</p>}

            <input {...register("password")} type="password" placeholder="Password" />
            {errors.password && <p className="error">{errors.password.message}</p>}

            <input {...register("confirmPassword")} type="password" placeholder="Confirm Password" />
            {errors.confirmPassword && <p className="error">{errors.confirmPassword.message}</p>}

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
</select>


            <button type="submit">Sign Up</button>
          </form>
        </div>
        <div className="form-links">
          <p>
            Don't have an account? <a href="#" onClick={handlenavigatein}>Sign in</a>
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

export default SignUp;
