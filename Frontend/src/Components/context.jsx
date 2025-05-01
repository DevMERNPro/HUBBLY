import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

import { Role } from '../types';
import axios from 'axios';
import config from '../config';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';





  


const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();



  useEffect(() => {
    const storedUser = localStorage.getItem('user');
  
    if (storedUser && storedUser !== "undefined") {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("Failed to parse user from localStorage:", err);
        localStorage.removeItem('user'); 
      }
    }
  
    setLoading(false);
  }, []);
  

    const login = async (data, role) => {
        try{
            if(role ===  "user"){
              const response = await axios.post(`${config.BASE_URL}/userlogin`, {
                email: data.email,
                password: data.password,
              });
              setUser(response.data.user);
              localStorage.setItem('user', JSON.stringify(response.data.user));
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
            //   reset();
              navigate("/dashboard")
            }else if(role === "admin"){
              const response = await axios.post(`${config.BASE_URL}/login`, {
                email: data.email,
                password: data.password,
              });
              console.log(response.data.user , 'getting message');
              setUser(response.data.user);
              localStorage.setItem('user', JSON.stringify(response.data.user));
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
            //   reset();
              navigate("/dashboard")
            }else if(role === "team"){
              const response = await axios.post(`${config.BASE_URL}/employeelogin`, {
                email: data.email,
                password: data.password,
              });
              setUser(response.data.user);
             localStorage.setItem('user', JSON.stringify(response.data.user));

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
            //   reset();
              navigate("/dashboard")
            }
          }catch(error){
            toast.error(error?.response?.data?.message || error?.response?.data?.msg, {
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

    const logout = async () => {
      try {
        const response = await axios.post(`${config.BASE_URL}/logout`);
        console.log(response.data);
        toast.success(response.data.message || response.data.msg, {
          action: {
            label: "Undo",
            onClick: () => console.log("Undo"),
          },
          style: {
            backgroundColor: "#4CAF50",
            color: "#ffffff",
            border: "1px solid #3e8e41",
          },
        });
      } catch (error) {
        console.error("Logout error:", error);
      } finally {
        setUser(null);
        localStorage.clear(); // Clears all stored data
        navigate("/signin");   // Redirect to login
      }
    };
    

    const isAuthenticated = () => {
        return user !== null;
    }

    const hasRole = (role) => {
        return user && user.role === role;
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated, hasRole }}>
            {loading ? <div>Loading...</div> : children}
        </AuthContext.Provider>
    );

};

export const useAuth = () => {
    const context = useContext(AuthContext);
    console.log(context,'getting contest');
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

