import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { axiosClient, attempt_refresh } from "../services/api";
import { href, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const TARGET_AUTH = import.meta.env.VITE_TARGET_AUTH; // Authentication Service URL
const TARGET_SYSTEM = import.meta.env.VITE_TARGET_SYSTEM; // Authentication Service URL

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const nav = useNavigate()

  // used to track the authentication state
  const [authLoading, setAuthLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false);

  // user data fetched from database
  const [cred, setCred] = useState({})
  const [account, setAccount] = useState({});
  const [settings, setSettings] = useState({});

  async function login(username, password) {
    try {
      const response = await axiosClient.post(TARGET_AUTH + "/auth/login", { username, password });
      const token = response.data.tkn_acc;

      if (token) {
        localStorage.setItem("accessToken", token)
        setAuthenticated(true);
        fetchAccountData()
        nav("/dashboard")
      }

    } catch (error) {
      console.error(error)
      let msg = error.response?.data?.msg ? error.response.data.msg : "unknown error when logging in";
      throw msg;
    }
  }


  async function logout() {
    try {
      await axiosClient.post(TARGET_AUTH + "/auth/logout");
      localStorage.clear();
      setAuthenticated(false)
      nav("/")
      notify
    } catch (error) {
      let msg = error.response?.data?.msg ? error.response.data.msg : "unknown error when logging out";
      throw msg;
    }
  }


  async function fetchAccountData() { // general account data fetch
    try {
      await fetchAccount();
      await fetchAccountSettings();
    } catch (error) {
      let msg = error.response?.data?.msg ? error.response.data.msg : "unknown error when fetch all account data";
      throw msg;
    } finally {
    }
  }
  async function fetchAccount() {
    try {
      const result = await axiosClient.get(TARGET_SYSTEM + "/accounts/me");
      setAccount(result.data.data[0]);
    } catch (error) {
      let msg = error.response?.data?.msg ? error.response.data.msg : "unknown error when fetching account data";
      throw msg;
    }
  }

  async function fetchAccountSettings() {
    try {
      const result = await axiosClient.get(TARGET_SYSTEM + "/account_settings/");
      setSettings(result.data.data);
    } catch (error) {
      let msg = error.response?.data?.msg ? error.response.data.msg : "unknown error when fetching account settings";
      throw msg;
    }
  }





  async function editAccount(data) {
    try {
      await axiosClient.put(TARGET_AUTH + "/accounts/", { data });
      return true
    } catch (error) {
      console.log('[AUTH] ERROR: fetch account data. ' + error)
    }
  }


  async function editAccountSettings(data) {
    try {
      await axiosClient.put(TARGET_SYSTEM + "/account_settings", { ...data });
      fetchAccountSettings()
      return true
    } catch (error) {
      console.log('[AUTH] ERROR: fetch account data. ' + error)
    }
  }


  useEffect(() => {
    if (authenticated) {
      fetchAccountData()
    }
  }, [authenticated])

  // auth check on load
  useEffect(() => {
    const init = async () => {
      setAuthLoading(true);
      try {
        const refreshed = await attempt_refresh();

        if (refreshed) {
          const token = localStorage.getItem("accessToken");
          if (token && token.split(".").length === 3) {
            try {
              const decoded = jwtDecode(token);
              setCred(decoded);
              localStorage.removeItem("session_ended");
              setAuthenticated(true);
            } catch (decodeErr) {
              console.error("[JWT DECODE FAILED]", decodeErr);
              console.warn("[INVALID TOKEN FORMAT]");
              localStorage.clear();
              setAuthenticated(false);
              setCred(null);
              nav("/");
            }
          } else {
            console.warn("[INVALID TOKEN FORMAT]");
            localStorage.clear();
            setAuthenticated(false);
            setCred(null);
            nav("/");
          }
        } else {
          localStorage.clear();
          localStorage.setItem("session_ended", "yas");
          setAuthenticated(false);
          setCred(null);
          nav("/");
        }
      } catch (error) {
        console.error("[AUTH INIT ERROR]", error);
        localStorage.clear();
        setAuthenticated(false);
        setCred(null);
        nav("/");
      } finally {
        setAuthLoading(false);
      }
    };

    init();
  }, [nav]);


  const values = {
    // used to check state of authentication
    authLoading,
    authenticated,

    // stores the user's account data and settings fetched from the database
    account,
    settings,

    // core authentication functions
    login,
    logout,

    // fetches account data, credentials, and settings
    fetchAccountData,

    // manual fetch for account data, credentials, and settings
    fetchAccount,
    fetchAccountSettings,

    // edit function for account data and settings
    editAccount,
    editAccountSettings,
  }

  return (
    <AuthContext.Provider value={values}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
