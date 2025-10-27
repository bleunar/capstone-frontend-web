import { useState } from "react";
import { axiosClient } from "../services/api";

// email services URL
const TARGET_EMAIL = import.meta.env.VITE_TARGET_EMAIL;

export function useEmailService() {
  const [apiLoading, setApiLoading] = useState(false); // handles checking of operations

  // FUNCTION TO COMMUNICATE WITH EMAIL SERVICE
  function EMAIL_SEND(payload) {
    setApiLoading(true);
    try {
      const ret = axiosClient.post(TARGET_EMAIL + "/send/activity", payload)
    } catch (error) {
      let msg = error?.response?.data?.msg || error?.response?.data?.error || error?.message || "unknown error when fetching data";
      throw new Error(msg);
    } finally {
      setApiLoading(false);
    }
  }

  // returns the functions
  return { EMAIL_SEND, EMAIL_LOADING: apiLoading };
};
