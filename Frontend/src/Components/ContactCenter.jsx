import React from "react";
import "../Styles/Contact.css";
import { FaUser, FaEnvelope, FaPhone, FaPaperPlane } from "react-icons/fa";
import Sidebar from "./Sidebar";
import { useAuth } from "./context";
import axios from "axios";
import config from "../config";
import { toast } from "sonner";

const ContactCenter = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = React.useState([]);
  const [selectedTicket, setSelectedTicket] = React.useState(null);
  const [message, setMessage] = React.useState("");
  const [chatMessages, setChatMessages] = React.useState([]);


  const gettickets = async () => {
    try {
      let response;
      if (user.role === "admin") {
        response = await axios.get(`${config.BASE_URL}/getTicketsall`);
      } else if (user.role === "user") {
        response = await axios.get(`${config.BASE_URL}/getUserTickets/${user.id}`);
      } else if (user.role === "employee") {
        response = await axios.get(`${config.BASE_URL}/getEmployeeTickets/${user.id}`);
      }

      setTickets(response.data.data);
    } catch (error) {
      console.error("Error fetching tickets:", error);
    }
  };

  const sendMessage = async () => {
   try{
    if(user.role === "admin"){
     const response = await axios.post(`${config.BASE_URL}/groupChatadmin/${selectedTicket._id}/${user.id}`, {
        message,
      });
      setMessage("");
      console.log(response.data, "message sent");
      toast.success("Message sent successfully",{
        style: {
          background: "green",
          color: "white",
        },
        icon: <FaPaperPlane />,
      });
    }else if(user.role === "user"){
      const response = await axios.post(`${config.BASE_URL}/groupChatuser/${selectedTicket._id}/${user.id}`, {
        message,
      });
      setMessage("");
      console.log(response.data, "message sent");
      toast.success("Message sent successfully",{
        style: {
          background: "green",
          color: "white",
        },
        icon: <FaPaperPlane />,
      });
    }else if(user.role === "employee"){
      const response = await axios.post(`${config.BASE_URL}/groupChat/${selectedTicket._id}/${user.id}`, {
        message
      });
      setMessage("");
      console.log(response.data, "message sent");
      toast.success("Message sent successfully",{
        style: {
          background: "green",
          color: "white",
        },
        icon: <FaPaperPlane />,
      });
    }
    getChat();
   }catch(error){
    console.error("Error sending message:", error);
   }
  };



  // get the chatting with selected ticket
  const getChat = async () => {
    try {
      const response = await axios.get(`${config.BASE_URL}/getChat/${selectedTicket._id}`);
      setChatMessages(response.data.data);
    } catch (error) {
      console.error("Error fetching chat:", error);
    }
  };
  
  


  React.useEffect(() => {
    gettickets();
  }, []);

  React.useEffect(() => {
    if (selectedTicket?._id) {
      getChat();
    }
  }, [selectedTicket]);
  
  

  return (
    <div className="main">
      <div className="chat-list">
        <h2>Contact Center</h2>
        <h3>Chats</h3>
        {tickets.map((ticket) => (
          <div
            className={`chat-item ${selectedTicket?.id === ticket.id ? "active" : ""}`}
            key={ticket.id}
            onClick={() => setSelectedTicket(ticket)}
          >
            <p>{ticket.userId[0]?.name || user.name}</p>
            <span>{ticket.subject}</span>
          </div>
        ))}
      </div>

      <div className="chat-window">
        <h3>
          Ticket# {selectedTicket ? selectedTicket.ticketNumber || selectedTicket.id : "Select a ticket"}
        </h3>

        <div className="chat-body">
  {selectedTicket ? (
    chatMessages.map((msg, index) => {
      console.log(msg?.sender?._id, "msg");
      console.log(user?._id, "user");
      const isCurrentUser = msg?.sender?._id === user?.id; // ensure both are strings;
      console.log(isCurrentUser, "isCurrentUserssssssssssss");
      return (
        <div key={index} className={`chat-message ${isCurrentUser ? "left" : "right"}`}>
          <div className="message-bubble">
            <p className="message-text">{msg.text}</p>
            <p className="message-meta">
              <span className="sender-name">{msg.sender?.name || "Unknown"}</span>
              <span className="chat-date">{new Date(msg.createdAt).toLocaleString()}</span>
            </p>
          </div>
        </div>
      );
    })
  ) : (
    <p>Select a ticket to view conversation</p>
  )}
</div>



        <div className="chat-input">
          <input
            type="text"
            placeholder="Type here"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={!selectedTicket}
          />
          <button className="send-button" onClick={sendMessage} disabled={!selectedTicket || !message.trim()}>
            <FaPaperPlane />
          </button>
        </div>
      </div>

      <div className="chat-details">
        <h3>Details</h3>
        <label>
          <FaUser />{" "}
          <input type="text" value={selectedTicket?.userId[0]?.name || user.name} readOnly />
        </label>
        <label>
          <FaPhone />{" "}
          <input type="text" value={selectedTicket?.userId[0]?.phone || user.phone || ''} readOnly />
        </label>
        <label>
          <FaEnvelope />{" "}
          <input type="text" value={selectedTicket?.userId[0]?.email || user.email} readOnly />
        </label>

        <h4>Ticket status</h4>
        <select disabled>
          <option>{selectedTicket?.status || "N/A"}</option>
        </select>
      </div>
    </div>
  );
};

export default ContactCenter;
