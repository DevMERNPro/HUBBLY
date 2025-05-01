import React from "react";
import "../App.css";
import logo from "../images/logo.png";
import abode from "../images/a.png";
import abs from "../images/abs.png";
import es from "../images/e.png";
import es1 from "../images/es.png";
import imgl from "../images/img1.png";
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import YouTubeIcon from '@mui/icons-material/YouTube';
import InstagramIcon from '@mui/icons-material/Instagram';
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate()
  const icons = [
    { name: "adobe", icon: abode },
    { name: "elastic", icon: es },
    { name: "opendoor", icon: es1 },
    { name: "airtable", icon: abs },
    { name: "elastic", icon: es },
    { name: "farmer", icon: es1 },
  ];

  const handlenavigatein = ()=>{
    navigate("/signin")
  }

  const handlenavigateup= ()=>{
    navigate("/signup")
  }



  return (
    <>
      <div className="landing-page">
        {/* Header */}
        <header className="header">
          <div className="logo">
            {" "}
            <span>
              <img src={logo} className="icon" alt="" />
            </span>
            Hubly
          </div>
          <div className="auth-buttons">
            <button className="login-btn" onClick={handlenavigatein}>Login</button>
            <button className="signup-btn" onClick={handlenavigateup}>Sign Up</button>
          </div>
        </header>

        {/* Main Section */}
        <main className="main-section">
          <div className="text-content">
            <h1>Grow Your Business Faster with Hubly CRM</h1>
            <p>
              Manage leads, automate workflows, and close deals effortlessly—all
              in one powerful platform.
            </p>
            <div className="action-buttons">
              <button className="get-started-btn">Get Started</button>
              <button className="watch-video-btn">
                <span className="play-icon">▶</span> Watch Video
              </button>
            </div>
          </div>
          <div className="image-content">
            <img
              src="https://thumbs.dreamstime.com/b/mixed-group-around-table-business-meeting-21283913.jpg" // Replace with actual image URL
              alt="Business meeting"
              className="main-image"
            />
          </div>
        </main>

        {/* Floating Elements */}
        <div className="floating-elements">
          {/* Chat Bubble */}
          <div className="chat-bubble">
            <div className="chat-header">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfsR1j5c5rh3Or62MF39b1EffRT1nXnqN4BQ&s" // Replace with actual avatar URL
                alt="User avatar"
                className="avatar"
              />
              <span>Jerry Cabzon joined Swimming Club</span>
            </div>
          </div>

          {/* Calendar Widget */}
          <div className="calendar-widget">
            <div className="calendar-header">June 2021 > </div>
            <div className="calendar-days">
              {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
                <span key={index}>{day}</span>
              ))}
            </div>
            <div className="calendar-dates">
              {Array.from({ length: 30 }, (_, i) => i + 1).map((date) => (
                <span key={date} className={date === 17 ? "selected" : ""}>
                  {date}
                </span>
              ))}
            </div>
          </div>

          {/* Stats Widget */}
          <div className="stats-widget">
            <div className="stats-content">
              <span>Total Revenue</span>
              <h3>$19,7650</h3>
              <div className="chart">
                {/* Placeholder for chart bars */}
                <div className="bar" style={{ height: "20%" }}></div>
                <div className="bar" style={{ height: "40%" }}></div>
                <div className="bar" style={{ height: "60%" }}></div>
                <div className="bar" style={{ height: "80%" }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="comapany-bar">
        <div className="icon-container">
          {icons.map((item, index) => (
            <div key={index} className="icon-item">
              <img src={item.icon} className="icon-image" />
              <span>{item.name}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="data-text">
        <h1>
          {" "}
          At its core, Hubly is a robust CRM <br /> solution
        </h1>
        <p>
          Hubly helps businesses streamline customer interactions, track leads,
          and automate tasks— <br />
          saving you time and maximizing revenue. Whether you’re a startup or an
          enterprise, Hubly <br />
          adapts to your needs, giving you the tools to scale efficiently.
        </p>
      </div>
      <div className="cont1">
        <div class="container-text">
          <div className="text-box">
            <h4>MULTIPLE PLATFORMS TOGETHER!</h4>
            <p>
              Email communication is a breeze with our fully integrated, drag
              &amp; drop <br /> email builder.
            </p>

            <h4>CLOSE</h4>
            <p>
              Capture leads using our landing pages, surveys, forms, calendars,
              inbound phone <br />
              system &amp; more!
            </p>

            <h4>NURTURE</h4>
            <p>
              Capture leads using our landing pages, surveys, forms, calendars,
              inbound phone <br /> system &amp; more!
            </p>
          </div>
          <div className="img-l">
            <img src={imgl} alt="" />
          </div>
        </div>
      </div>
      <div class="pricing-container">
        <h1>We have plans for everyone!</h1>
        <p class="subtitle">
          We started with a strong foundation, then simply built all of the
          sales <br /> and marketing tools ALL businesses need under one
          platform.
        </p>

        <div class="pricing-cards">
          <div class="card">
            <h2>STARTER</h2>
            <p class="desc">
              Best for local businesses needing to improve their online
              reputation.
            </p>
            <h3 class="price">
              $199 <span>/monthly</span>
            </h3>
            <ul>
              <li>✔ Unlimited Users</li>
              <li>✔ GMB Messaging</li>
              <li>✔ Reputation Management</li>
              <li>✔ GMB Call Tracking</li>
              <li>✔ 24/7 Award Winning Support</li>
              <br />
              <br />
            </ul>
            <button>SIGN UP FOR STARTER</button>
          </div>

          <div class="card">
            <h2>GROW</h2>
            <p class="desc">
              Best for all businesses that want to take full control of their
              marketing automation and track their leads, click to close.
            </p>
            <h3 class="price">
              $399 <span>/monthly</span>
            </h3>
            <ul>
              <li>✔ Pipeline Management</li>
              <li>✔ Marketing Automation Campaigns</li>
              <li>✔ Live Call Transfer</li>
              <li>✔ GMB Messaging</li>
              <li>✔ Embed-able Form Builder</li>
              <li>✔ Reputation Management</li>
              <li>✔ 24/7 Award Winning Support</li>
            </ul>
            <button>SIGN UP FOR GROW</button>
          </div>
        </div>
      </div>
      <footer class="footer">
        <div class="footer-container">
          <div class="footer-logo">
          <img src={logo} className="icon" alt="" />
            <span>Hubly</span>
          </div>

          <div class="footer-columns">
            <div class="footer-column">
              <h4>Product</h4>
              <ul>
                <li>Universal checkout</li>
                <li>Payment workflows</li>
                <li>Observability</li>
                <li>UpliftAI</li>
                <li>Apps & integrations</li>
              </ul>
            </div>
            <div class="footer-column">
              <h4>Resources</h4>
              <ul>
                <li>Blog</li>
                <li>Success stories</li>
                <li>News room</li>
                <li>Terms</li>
                <li>Privacy</li>
              </ul>
            </div>
            <div class="footer-column">
              <h4>Why Primer</h4>
              <ul>
                <li>Expand to new markets</li>
                <li>Boost payment success</li>
                <li>Improve conversion rates</li>
                <li>Reduce payments fraud</li>
                <li>Recover revenue</li>
              </ul>
            </div>
           
            <div class="footer-column">
              <h4>Developers</h4>
              <ul>
                <li>Primer Docs</li>
                <li>API Reference</li>
                <li>Payment methods guide</li>
                <li>Service status</li>
                <li>Community</li>
              </ul>
            </div>
            <div class="footer-column">
              <h4>Company</h4>
              <ul>
                <li>Careers</li>
              </ul>
            </div>
          </div>

          
        </div>
        <div class="footer-icons">
            <a href="#">
              <i class="fas fa-envelope"> <MailOutlineIcon/></i>
            </a>
            <a href="#">
              <i class="fab fa-linkedin-in"><InstagramIcon/></i>
            </a>
            <a href="#">
              <i class="fab fa-twitter"><TwitterIcon/></i>
            </a>
            <a href="#">
              <i class="fab fa-youtube"><YouTubeIcon/></i>
            </a>
            <a href="#">
              <i class="fab fa-discord"><LinkedInIcon/></i>
            </a>
            <a href="#">
              <i class="fab fa-github"></i>
            </a>
            <a href="#">
              <i class="fab fa-instagram"></i>
            </a>
          </div>
      </footer>
    </>
  );
};

export default LandingPage;
