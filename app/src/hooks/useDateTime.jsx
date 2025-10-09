import { useState, useEffect } from "react";

function Clock() {
  const [dateTime, setDateTime] = useState(new Date());   // date state

  // updates the date data every one second
  useEffect(() => {
    const interval = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(interval)
  }, []);

  // formates the date
  const date = dateTime.toLocaleDateString("en-PH", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Manila"
  });

  // formats the time
  const time = dateTime.toLocaleTimeString("en-PH", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: "Asia/Manila"
  });

  // return the formatted date and time
  return {
    date,
    time
  };
}

// returns the current date and time
export default function useDateTime() {
  const { date, time } = Clock();

  return {
    time, date
  }
}