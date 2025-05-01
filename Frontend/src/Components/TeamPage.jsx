import React, { useEffect, useState } from "react";
import "../Styles/Team.css";
import Sidebar from "./Sidebar";
import { useForm } from "react-hook-form";
import AgTable from "./AgTable";
import { useAuth } from "./context";
import axios from "axios";
import config from "../config";
import { toast } from "sonner";
import { PencilIcon, TrashIcon } from "lucide-react";

const TeamPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editEmployeeId, setEditEmployeeId] = useState(null);

  const { register, handleSubmit, watch, reset } = useForm();
  const user = useAuth();

  const onEdit = (params) => {
    const employee = params.data;
    setEditMode(true);
    setEditEmployeeId(employee._id);
    setShowModal(true);
    reset({
      name: employee.name,
      email: employee.email,
      phone: employee.phone,
      password: "",
      confirmPassword: "",
    });
  };

  const onDelete = async (id) => {
    try {
      await axios.delete(`${config.BASE_URL}/deleteEmployee/${id}`);
      toast.success("Employee deleted successfully");
      gettingEmployee();
    } catch (error) {
      toast.error("Failed to delete employee");
      console.error(error);
    }
  };

  const columnDefs = [
    { headerName: "Full Name", field: "name", sortable: true, filter: true },
    { headerName: "Phone", field: "phone", sortable: true, filter: true },
    { headerName: "Email", field: "email", sortable: true, filter: true },
    {
      headerName: "Actions",
      cellRenderer: (params) => (
        <div className="flex space-x-3">
          <button
            onClick={() => onEdit(params)}
            className="text-blue-600 hover:text-blue-800"
          >
            <PencilIcon size={18} />
          </button>
          <button
            onClick={() => onDelete(params.data._id)}
            className="text-red-600 hover:text-red-800"
          >
            <TrashIcon size={18} />
          </button>
        </div>
      ),
    },
  ];

  const gettingEmployee = async () => {
    try {
      const response = await axios.get(
        `${config.BASE_URL}/getEmployees/${user.user.id}`
      );
      if (response.data) {
        setRowData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching employee data:", error);
    }
  };

  useEffect(() => {
    gettingEmployee();
  }, []);

  const onSubmit = async (data) => {
    try {
      if (editMode && editEmployeeId) {
        const response = await axios.put(
          `${config.BASE_URL}/updateEmployee/${editEmployeeId}`,
          {
            name: data.name,
            phone: data.phone,
            email: data.email,
            admin: user.user.id,
            password: data.password,
            confirmPassword: data.confirmPassword,
          }
        );
        toast.success(response.data.message || "Employee updated successfully");
      } else {
        const response = await axios.post(`${config.BASE_URL}/addEmployee`, {
          name: data.name,
          phone: data.phone,
          email: data.email,
          password: data.password,
          confirmPassword: data.confirmPassword,
          admin: user.user.id,
        });
        toast.success(response.data.message || response.data.msg);
      }

      setShowModal(false);
      setEditMode(false);
      setEditEmployeeId(null);
      reset();
      gettingEmployee();
    } catch (err) {
      toast.error("Operation failed");
      console.log(err);
    }
  };

  const isrequried = editEmployeeId ? false : true;

  return (
    <div className="main">
      <div className="team-page">
        <div className="team-content">
          <h2>Team</h2>

          <button className="add-btn" onClick={() => {
            reset();
            setEditMode(false);
            setShowModal(true);
          }}>
            + Add Team members
          </button>

          <AgTable columnDefs={columnDefs} data={rowData} rowHeight={50} />

          {showModal && (
            <div className="modal-backdrop">
              <div className="modal">
                <h3>{editMode ? "Edit Team Member" : "Add Team Members"}</h3>
                <p className="modal-desc">
                  Talk with colleagues in a group chat. Messages in this group
                  are only visible to its participants. New teammates may only
                  be invited by the administrators.
                </p>

                <form onSubmit={handleSubmit(onSubmit)}>
                  <input
                    type="text"
                    placeholder="User name"
                    {...register("name", { required: true })}
                  />

                  <input
                    type="email"
                    placeholder="Email ID"
                    {...register("email", { required: true })}
                  />

                  <input
                    type="tel"
                    placeholder="Phone Number"
                    {...register("phone", { required: true })}
                  />

              
                    
                      <input
                        type="password"
                        placeholder="Password"
                        {...register("password", { required: {isrequried } })}
                      />
                      <input
                        type="password"
                        placeholder="Confirm Password"
                        {...register("confirmPassword", {
                          required: {isrequried },
                          validate: (value) =>
                            value === watch("password") ||
                            "Passwords do not match",
                        })}
                      />
                    
                

                  <div className="modal-actions">
                    <button
                      type="button"
                      onClick={() => {
                        setShowModal(false);
                        setEditMode(false);
                        reset();
                      }}
                    >
                      Cancel
                    </button>
                    <button type="submit">{editMode ? "Update" : "Add"}</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamPage;
