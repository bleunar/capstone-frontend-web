import { useState } from "react";
import { axiosClient } from "../services/api";

/*
  na gamit dya para mag handle CRUD operations sa system
*/

// system api URL
const TARGET_SYSTEM = import.meta.env.VITE_TARGET_SYSTEM;


export const useSystemAPI = () => {
  const [apiLoading, setApiLoading] = useState(false); // handles checking of operations


  // handles the GET operations with the system
  const API_GET = async (url, config = {}) => {
    setApiLoading(true);
    try {
      const result = await axiosClient.get(`${TARGET_SYSTEM}${url}`, config);
      return result?.data?.data;
    } catch (error) {
      console.error(error);
      let msg = error?.response?.data?.msg || error?.response?.data?.error || error?.message || "unknown error when fetching data";
      console.error(msg);
      throw new Error(msg);
    } finally {
      setApiLoading(false);
    }
  };


  // handles the POST operations with the system
  const API_POST = async (url, body = {}, config = {}) => {
    setApiLoading(true);
    try {
      const result = await axiosClient.post(`${TARGET_SYSTEM}${url}`, body, config);
      return result.data;
    } catch (error) {
      let msg = error?.response?.data?.msg || error?.response?.data?.error || error?.message || "unknown error when sending data";
      console.error(msg);
      throw new Error(msg);
    } finally {
      setApiLoading(false);
    }
  };


  // handles the PUT operations with the system
    const API_PUT = async (url, body = {}, config = {}) => {
    setApiLoading(true);
    try {
      const result = await axiosClient.put(`${TARGET_SYSTEM}${url}`, body, config);
      return result.data;
    } catch (error) {
      console.error(error);
      let msg = error?.response?.data?.msg || error?.response?.data?.error || error?.message || "unknown error when updating data";
      console.error(msg);
      throw new Error(msg);
    } finally {
      setApiLoading(false);
    }
  };


  // handles the DELETE operations with the system
  const API_DELETE = async (url, config = {}) => {
    setApiLoading(true);
    try {
      const result = await axiosClient.delete(`${TARGET_SYSTEM}${url}`, config);
      return result.data;
    } catch (error) {
      console.error(error);
      let msg = error?.response?.data?.msg || error?.response?.data?.error || error?.message || "unknown error when deleting data";
      console.error(msg);
      throw new Error(msg);
    } finally {
      setApiLoading(false);
    }
  };


  // returns the functions
  return { API_GET, API_POST, API_PUT, API_DELETE, API_LOADING:apiLoading };
};
