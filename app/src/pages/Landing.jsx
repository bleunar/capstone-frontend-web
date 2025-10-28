import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationContext";
import Logo from '../assets/img/claims-name-white.png'

function LandingPage() {
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const { login, authLoading, authenticated } = useAuth()
  const { notifyConfirm, notifyError } = useNotifications()
  const nav = useNavigate()

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // login function
  const HandleLogin = async (e) => {
    e.preventDefault()
    try {
      await login(loginUsername, loginPassword)
      notifyConfirm("Logged In!")
    } catch (error) {
      notifyError(error)
    }
  }

  // on component load, check if authenticated. navigate to dashbaord if authenticated
  useEffect(() => {
    if (authenticated) {
      nav("/dashboard")
    }
  }, [authenticated])

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center position-relative"
      style={{
        fontFamily: "Cambria, Georgia, serif",
        backgroundColor: "#001a0d",
        overflow: "hidden",
      }}
    >
   
     

  
      <div
        style={{
          backgroundImage: "url('pui.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          filter: "blur(6px) brightness(0.5)",
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
        }}
      ></div>

      
      <div
        style={{
          backgroundColor: "rgba(0, 30, 10, 0.55)", 
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 0.5,
        }}
      ></div>

      {/* Login Box */}
      <div
        className="card shadow-lg text-center p-4 p-md-5"
        style={{
          maxWidth: "400px",
          width: "100%",
          borderRadius: "18px",
          background: "rgba(0, 40, 20, 0.92)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 204, 0, 0.25)",
          zIndex: 1,
          color: "#fff",
        }}
      >
        <div className="d-flex justify-content-center mb-3">
          <img
            src={Logo}
            alt="Claims Logo"
            style={{
              width: "150px",
              borderRadius: "8px",
            }}
          />
        </div>

        <p
          style={{
            color: "#ffffffcc",
            fontSize: "0.95rem",
            marginBottom: "1.5rem",
          }}
        >
          Please log in to continue.
        </p>

        <form onSubmit={HandleLogin}>
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Username"
            value={loginUsername}
            onChange={(e) => setLoginUsername(e.target.value)}
            required
            style={{
              borderColor: "#FFCC00",
              backgroundColor: "#002912",
              color: "#fff",
              borderRadius: "10px",
              padding: "10px",
            }}
            onFocus={(e) => (e.target.style.boxShadow = "0 0 6px #FFCC00")}
            onBlur={(e) => (e.target.style.boxShadow = "none")}
          />

          <div className="position-relative mb-3">
            <input
              type={showLoginPassword ? "text" : "password"}
              className="form-control"
              placeholder="Password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              required
              style={{
                borderColor: "#FFCC00",
                backgroundColor: "#002912",
                color: "#fff",
                borderRadius: "10px",
                padding: "10px",
              }}
              onFocus={(e) => (e.target.style.boxShadow = "0 0 6px #FFCC00")}
              onBlur={(e) => (e.target.style.boxShadow = "none")}
            />
            <span
              className="position-absolute end-0 top-50 translate-middle-y pe-3"
              style={{ cursor: "pointer", color: "#FFCC00" }}
              onClick={() => setShowLoginPassword(!showLoginPassword)}
            >
              {showLoginPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <button
            type="submit"
            className="btn w-100 mb-3"
            style={{
              backgroundColor: "#FFCC00",
              color: "#003319",
              fontWeight: "bold",
              border: "none",
              borderRadius: "10px",
              transition: "0.3s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#e6b800")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#FFCC00")
            }
          >
            Login
          </button>

        </form>
      </div>

      
      <style>{`
        input::placeholder {
          color: #FFCC00 !important;
          opacity: 0.85;
        }
      `}</style>
    </div>
  );
}

export default LandingPage;
