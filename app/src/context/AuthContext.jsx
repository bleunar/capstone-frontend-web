import { createContext, useContext, useEffect, useState } from "react";
import { axiosClient, attempt_refresh } from "../services/api";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

/*
  handles authentication and authorization logic for the app.
*/

const TARGET_AUTH = import.meta.env.VITE_TARGET_AUTH; // Flask Auth API
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const nav = useNavigate();

  // Authentication states
  const [authLoading, setAuthLoading] = useState(false);
  const [authFetching, setAuthFetching] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [credentials, setCredentials] = useState(null);

  // User data
  const [profile, setProfile] = useState({});
  const [credential, setCredential] = useState({});
  const [settings, setSettings] = useState({});

  
  async function login(username, password) {
    setAuthLoading(true);
    try {
      const response = await axiosClient.post(`${TARGET_AUTH}/login`, {
        username,
        password,
      });

      const token = response.data.data?.tkn_acc; // Flask returns wrapped JSON
      if (token) {
        localStorage.setItem("accessToken", token);
        setAuthenticated(true);
        await fetchAccountData();
        nav("/dashboard");
      } else {
        throw new Error("No access token received.");
      }
    } catch (error) {
      const msg =
        error?.response?.data?.error ||
        error.message ||
        "Unknown error during login.";
      console.error("[AUTH] Login failed:", msg);
      throw msg;
    } finally {
      setAuthLoading(false);
    }
  }

  
  async function logout() {
    setAuthLoading(true);
    try {
      await axiosClient.post(`${TARGET_AUTH}/logout`, {}, { withCredentials: true });
    } catch (error) {
      console.warn("[AUTH] Logout warning:", error);
    } finally {
      localStorage.clear();
      setAuthenticated(false);
      setCredentials(null);
      nav("/");
      setAuthLoading(false);
    }
  }

  
  async function fetchAccountData() {
    setAuthFetching(true)
    await Promise.all([
      fetchAccountProfile(),
      fetchAccountCredential(),
      fetchAccountSettings(),
    ]);
    setAuthFetching(false)
  }

  
  async function fetchAccountProfile() {
    setAuthFetching(true)
    const res = await axiosClient.get(`${TARGET_AUTH}/me/profile`);
    setProfile(res.data.data);
    setAuthFetching(false)
  }

  
  async function fetchAccountCredential() {
    setAuthFetching(true)
    const res = await axiosClient.get(`${TARGET_AUTH}/me/credential`);
    setCredential(res.data.data);
    setAuthFetching(false)
  }

  
  async function fetchAccountSettings() {
    setAuthFetching(true)
    const res = await axiosClient.get(`${TARGET_AUTH}/me/settings`);
    setSettings(res.data.data);
    setAuthFetching(false)
  }

  
  async function editAccountProfile(data) {
    setAuthFetching(true)
    await axiosClient.put(`${TARGET_AUTH}/me/profile`, data);
    await fetchAccountProfile();
    setAuthFetching(false)
    return true;
  }

  
  async function editAccountCredential(data) {
    setAuthFetching(true)
    await axiosClient.put(`${TARGET_AUTH}/me/credential`, data);
    await fetchAccountCredential();
    setAuthFetching(false)
    return true;
  }

  
  async function editAccountSettings(data) {
    setAuthFetching(true)
    await axiosClient.put(`${TARGET_AUTH}/me/settings`, data);
    await fetchAccountSettings();
    setAuthFetching(false)
    return true;
  }

  
  useEffect(() => {
    if (authenticated) {
      fetchAccountData().catch((err) =>
        console.error("[AUTH] Fetch data error:", err)
      );
    }
  }, [authenticated]);

  
  useEffect(() => {
    const init = async () => {
      setInitialized(false);
      try {
        // Try refreshing token using cookie
        const refreshed = await attempt_refresh();
        if (!refreshed) throw new Error("Refresh failed.");

        const token = localStorage.getItem("accessToken");
        if (token && token.split(".").length === 3) {
          const decoded = jwtDecode(token);
          setCredentials(decoded);
          setAuthenticated(true);
          localStorage.removeItem("session_ended");
        } else {
          throw new Error("Invalid or missing access token.");
        }
      } catch (error) {
        console.warn("[AUTH INIT ERROR]", error);
        localStorage.clear();
        setAuthenticated(false);
        setCredentials(null);
        nav("/");
      } finally {
        setInitialized(true);
      }
    };

    init();
  }, [nav]);

  
  const values = {
    authLoading,
    authFetching,
    initialized,
    authenticated,
    credentials,

    profile,
    credential,
    settings,

    login,
    logout,

    fetchAccountProfile,
    fetchAccountCredential,
    fetchAccountSettings,

    editAccountProfile,
    editAccountCredential,
    editAccountSettings,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}