import React, { useState, useEffect, useRef } from "react";
import "../Styles/chatbot.css";

const Chatbot = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]); // Ensure messages start empty
  const [showForm, setShowForm] = useState(true);
  const [userInfo, setUserInfo] = useState(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user || { id: "", name: "", email: "", role: "" };
  });
  const [colors, setColors] = useState(() => {
    const saved = localStorage.getItem("chatColors");
    return saved
      ? JSON.parse(saved)
      : {
          primary: "#433475",
          primaryHex: "#433475",
          background: "#ffffff",
          backgroundHex: "#ffffff",
          botMessage: "#F3EEE3",
        };
  });
  const [customMessages, setCustomMessages] = useState(["How can I help you?", "Ask me anything!"]);
  const [welcomeMessage, setWelcomeMessage] = useState(
    "🌟 Want to chat about Hubly? I'm an chatbot here to help you find your way."
  );
  const [timer, setTimer] = useState(0);
  const chatBodyRef = useRef(null);

  const colorOptions = {
    primary: ["#433475", "#FF5733", "#33FF57", "#3357FF", "#FF33A1"],
    background: ["#ffffff", "#f0f2f5", "#e0e0e0", "#d0f0c0", "#f0c0d0"],
  };

  // Timer effect
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Scroll effect
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

  // Welcome message effect
  useEffect(() => {
    console.log("Checking welcome message condition:", { messagesLength: messages.length, showForm });
    if (messages.length === 0 && !showForm) {
      setMessages([
        {
          text: welcomeMessage,
          isBot: true,
        },
      ]);
      console.log("Welcome message added:", welcomeMessage);
    }
  }, [welcomeMessage, showForm]);

  // Save colors
  useEffect(() => {
    localStorage.setItem("chatColors", JSON.stringify(colors));
  }, [colors]);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      setMessages((prev) => [...prev, { text: message, isBot: false }]);
      const botResponse =
        qaPairs.find((pair) => pair.q.toLowerCase().includes(message.toLowerCase()))?.a ||
        "I'm still learning! Please contact support for more detailed queries.";
      setTimeout(() => {
        setMessages((prev) => [...prev, { text: botResponse, isBot: true }]);
      }, 1000);
      setMessage("");
    }
  };

  const handleColorChange = (type, value) => {
    setColors((prev) => ({
      ...prev,
      [type]: value,
      [`${type}Hex`]: value,
    }));
  };

  const handleHexChange = (type, value) => {
    const hexRegex = /^#([0-9A-F]{3}){1,2}$/i;
    if (hexRegex.test(value)) {
      handleColorChange(type, value);
    } else {
      setColors((prev) => ({
        ...prev,
        [`${type}Hex`]: value,
      }));
    }
  };

  const handleCustomMessageChange = (index, value) => {
    const updatedMessages = [...customMessages];
    updatedMessages[index] = value;
    setCustomMessages(updatedMessages);
  };

  const qaPairs = [
    { q: "What is a ticketing tool?", a: "A ticketing tool is software used to manage and track customer support requests or technical issues." },
    { q: "Your name", a: "You can call me Holly! How can I assist you today?" },
    { q: "Food recommendation", a: "I recommend trying our chef's special - Salmon Teriyaki!" },
    { q: "Feedback", a: "Please share your feedback at support@example.com" },
    { q: "Beer options", a: "We have IPA, Lager, and Stout available." },
    { q: "Soap ingredients", a: "Our soaps are made from natural ingredients like coconut oil and shea butter." },
  ];

  return (
    <div className="main-container">
      <div className="chat-section">
        <div className="chatbot" style={{ backgroundColor: colors.background }}>
          <div className="chat-header" style={{ backgroundColor: colors.primary }}>
            <div className="header-color-control">
              {/* <input
                type="color"
                value={colors.primary}
                onChange={(e) => handleColorChange("primary", e.target.value)}
              /> */}
              {/* <input
                type="text"
                value={colors.primaryHex}
                onChange={(e) => handleHexChange("primary", e.target.value)}
                placeholder="#RRGGBB"
                maxLength="7"
              /> */}
            </div>
            <img src="https://cdn-icons-png.flaticon.com/512/1698/1698535.png" alt="bot" />
            <h3>Holly - Ticketing Assistant</h3>
          </div>
          <div className="chat-body" ref={chatBodyRef}>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`chat-msg ${msg.isBot ? "bot" : "user"}`}
                style={{
                  backgroundColor: msg.isBot ? colors.botMessage : colors.primary,
                  color: msg.isBot ? "#000" : "#fff",
                }}
              >
                {msg.text}
                {msg.isBot && (
                  <div className="message-timestamp">
                    {formatTime(timer).split(':').slice(1).join(':')}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="chat-input">
            <input
              type="text"
              placeholder="Type your question..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <button onClick={handleSendMessage} style={{ backgroundColor: colors.primary }}>
              Send
            </button>
          </div>
        </div>
      </div>
      <div className="controls-section">
        <div className="control-card">
          <h3>Header Color</h3>
          <div className="color-preview">
            <div style={{ backgroundColor: colors.primary }} className="color-box"></div>
            <div className="color-options">
              {colorOptions.primary.map((color, idx) => (
                <div
                  key={idx}
                  className="color-option"
                  style={{ backgroundColor: color }}
                  onClick={() => handleColorChange("primary", color)}
                ></div>
              ))}
            </div>
            <input
              type="text"
              value={colors.primaryHex}
              onChange={(e) => handleHexChange("primary", e.target.value)}
              placeholder="#RRGGBB"
              maxLength="7"
            />
          </div>
        </div>
        <div className="control-card">
          <h3>Custom Background Color</h3>
          <div className="color-preview">
            <div style={{ backgroundColor: colors.background }} className="color-box"></div>
            <div className="color-options">
              {colorOptions.background.map((color, idx) => (
                <div
                  key={idx}
                  className="color-option"
                  style={{ backgroundColor: color }}
                  onClick={() => handleColorChange("background", color)}
                ></div>
              ))}
            </div>
            <input
              type="text"
              value={colors.backgroundHex}
              onChange={(e) => handleHexChange("background", e.target.value)}
              placeholder="#RRGGBB"
              maxLength="7"
            />
          </div>
        </div>
        <div className="control-card">
          <h3>Customize Message</h3>
          <div className="custom-messages">
            {customMessages.map((msg, index) => (
              <div key={index} className="custom-message">
                <input
                  type="text"
                  value={msg}
                  onChange={(e) => handleCustomMessageChange(index, e.target.value)}
                  placeholder={`Message ${index + 1}`}
                />
                <span className="edit-icon">✎</span>
              </div>
            ))}
          </div>
        </div>
        <div className="control-card">
          <h3>Welcome Message</h3>
          <div className="welcome-message">
            <span className="welcome-text">{welcomeMessage}</span>
            <span className="message-timestamp">
              {formatTime(timer).split(':').slice(1).join(':')}
            </span>
            <span className="edit-icon">✎</span>
          </div>
        </div>
        <div className="control-card">
          <h3>Introduction Form</h3>
          <div className="intro-form">
            <input
              type="text"
              placeholder="Your name"
              value={userInfo.name}
              onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
              readOnly
            />
            <input
              type="email"
              placeholder="Your Email"
              value={userInfo.email}
              onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
              readOnly
            />
            <button onClick={() => { setShowForm(false); console.log("Show Form set to false"); }}>Thank You!</button>
          </div>
        </div>
        <div className="control-card">
          <h3>Session Timer</h3>
          <div className="timer-display">{formatTime(timer)}</div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;