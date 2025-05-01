import React, { useState, useEffect } from "react";
import axios from "axios";
import "../Styles/Dashboard.css";
import Sidebar from "./Sidebar";
import config from "../config";
import { useAuth } from "./context";
import { toast } from "sonner";

const TicketDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [employees, setEmployees] = useState([]);
  const [assignedEmployee, setAssignedEmployee] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [modalType, setModalType] = useState(null); // 'assign' or 'status'
  const [modalTicket, setModalTicket] = useState(null);

  const { user } = useAuth();

  const fetchTickets = async () => {
    try {
      setLoading(true);
      let res;
      if (user.role === "admin") {
        res = await axios.get(`${config.BASE_URL}/getTicketsall`);
      } else if (user.role === "user") {
        res = await axios.get(`${config.BASE_URL}/getUserTickets/${user.id}`);
      } else if (user.role === "employee") {
        res = await axios.get(
          `${config.BASE_URL}/getEmployeeTickets/${user.id}`
        );
      }
      setTickets(res.data.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch tickets");
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await axios.get(`${config.BASE_URL}/getEmployees/${user.id}`);
      setEmployees(res.data.data);
    } catch (err) {
      console.error("Failed to fetch employees");
    }
  };

  useEffect(() => {
    fetchTickets();
    if (user.role === "admin") fetchEmployees();
  }, []);

  const filteredTickets = tickets.filter((ticket) => {
    const matchesFilter = filter === "all" || ticket.status === filter;
    const matchesSearch = ticket.subject
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const openAssignModal = (ticket) => {
    setModalTicket(ticket);
    setModalType("assign");
    setAssignedEmployee("");
    setNewStatus("");
  };

  const openStatusModal = (ticket) => {
    setModalTicket(ticket);
    setModalType("status");
    setNewStatus("");
  };

  const handleSubmitAssign = async () => {
    try {
      const response = await axios.put(
        `${config.BASE_URL}/assignEmployee/${modalTicket._id}`,
        {
          employeeId: assignedEmployee,
          status: newStatus || "OPEN",
        }
      );
      toast.success(response.data.message || response.data.msg, {
        style: {
          background: "#4caf50",
          color: "#fff",
        },
        icon: "✅",
      });
      setModalType(null);
      fetchTickets();
    } catch (err) {
      console.error("Assign failed", err);
    }
  };

  const handleSubmitStatus = async () => {
    try {
      const response = await axios.put(
        `${config.BASE_URL}/updateTicketStatus/${modalTicket._id}`,
        {
          status: newStatus,
        }
      );
      toast.success(response.data.message || response.data.msg, {
        style: {
          background: "#4caf50",
          color: "#fff",
        },
        icon: "✅",
      });
      setModalType(null);
      fetchTickets();
    } catch (err) {
      console.error("Status update failed", err);
    }
  };

  return (
    <div className="main">
      <div className="dashboard">
        <h2>Ticket Dashboard</h2>

        <input
          className="search-box"
          type="text"
          placeholder="Search by subject"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <div className="tabs">
          <button
            className={`tab ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            All
          </button>
          <button
            className={`tab ${filter === "CLOSED" ? "active" : ""}`}
            onClick={() => setFilter("CLOSED")}
          >
            Resolved
          </button>
          <button
            className={`tab ${filter === "OPEN" ? "active" : ""}`}
            onClick={() => setFilter("OPEN")}
          >
            Unresolved
          </button>
          {/* <button className={`tab ${filter === 'IN PROGRESS' ?  'active' : ''}`} onClick={() => setFilter('IN_PROGRESS')}>IN PROGRESS</button> */}
        </div>

        {loading ? (
          <div className="loading">Loading tickets...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : (
          filteredTickets.map((ticket) => (
            <div className="ticket-card" key={ticket._id}>
              <div className="ticket-header">
                <span
                  className={`status-dot ${ticket.status.toLowerCase()}`}
                ></span>
                <span className="ticket-id">Ticket# {ticket._id}</span>
                <span className="posted-time">
                  {ticket?.createdAt
                    ? `Posted on: ${new Date(
                        ticket.createdAt
                      ).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}`
                    : "N/A"}
                </span>
              </div>

              <div className="ticket-body">
                <h4>{ticket.subject}</h4>
                <p>{ticket.description}</p>
                <p>
                  Priority: <strong>{ticket.priority}</strong>
                </p>
              </div>

              {(user.role === "admin" || user.role === "employee") &&
                ticket.user && (
                  <div className="user-info">
                    <span>
                      User: {ticket.user.name} ({ticket.user.email})
                    </span>
                  </div>
                )}

              {user.role === "admin" && (
                <button
                  className="assign-button"
                  onClick={() => openAssignModal(ticket)}
                >
                  Assign
                </button>
              )}

              {user.role === "employee" && ticket.status === "IN_PROGRESS" && (
                <button
                  className="status-button"
                  onClick={() => openStatusModal(ticket)}
                >
                  Change Status
                </button>
              )}
            </div>
          ))
        )}

        {modalType && modalTicket && (
          <div className="modal">
            <div className="modal-content">
              {modalType === "assign" && (
                <>
                  <h3>Assign Ticket</h3>
                  <select
                    value={assignedEmployee}
                    onChange={(e) => setAssignedEmployee(e.target.value)}
                  >
                    <option value="">Select Employee</option>
                    {employees.map((emp) => (
                      <option key={emp._id} value={emp._id}>
                        {emp.name}
                      </option>
                    ))}
                  </select>
                  <br />
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                  >
                    <option value="">Set Status</option>
                    <option value="OPEN">OPEN</option>
                    <option value="IN_PROGRESS">IN_PROGRESS</option>
                    <option value="CLOSED">CLOSED</option>
                  </select>
                  <br />
                  <button onClick={handleSubmitAssign}>Submit</button>
                </>
              )}

              {modalType === "status" && (
                <>
                  <h3>Update Status</h3>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                  >
                    <option value="">Select Status</option>
                    <option value="OPEN">OPEN</option>
                    <option value="IN_PROGRESS">IN_PROGRESS</option>
                    <option value="CLOSED">CLOSED</option>
                  </select>
                  <br />
                  <button onClick={handleSubmitStatus}>Update</button>
                </>
              )}
              <button
                className="cancel-button"
                onClick={() => setModalType(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketDashboard;
