import React, { useEffect, useState } from "react";
import axios from "axios";

const Greeting = () => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/users/greet")
      .then((response) => {
        setMessage(response.data);
      })
      .catch((error) => {
        console.error("Error fetching greeting:", error);
        setMessage("Failed to fetch greeting.");
      });
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-2">Greeting from Backend:</h1>
      <p className="text-lg text-gray-700">{message}</p>
    </div>
  );
};

export default Greeting;
