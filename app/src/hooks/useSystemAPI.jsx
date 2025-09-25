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
      return result.data;
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.msg ?? "API GET: Unknown error";
      throw msg;
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
      console.error(error);
      const msg = error.response?.data?.msg ?? "API POST: Unknown error";
      throw msg;
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
      const msg = error.response?.data?.msg ?? "API PUT: Unknown error";
      throw msg;
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
      const msg = error.response?.data?.msg ?? "API DELETE: Unknown error";
      throw msg;
    } finally {
      setApiLoading(false);
    }
  };


  // returns the functions
  return { API_GET, API_POST, API_PUT, API_DELETE, API_LOADING:apiLoading };
};
