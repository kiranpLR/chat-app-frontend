import "./App.css";
import io from "socket.io-client";
import { useEffect, useState } from "react";
import axios from "axios";
const socket = io.connect("http://192.168.0.165:3001");

function App() {
  const [message, setMessage] = useState("");
  const [messageReceived, setMessageReceived] = useState("");
  const [room, setRoom] = useState("");

  const joinRoom = () => {
    if (room !== "") {
      socket.emit("join_room", room);
    }
  };
  const sendMessage = async () => {
    socket.emit("send_message", { message, room });
    await axios({
      headers: {
        "content-type": "application/json",
      },
      data: {
        message,
        roomID: room,
      },
      url: `${process.env.REACT_APP_BASE_API}/setMessage`,
      method: "POST",
    });
    setMessage("");
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageReceived(data.message);
    });
  }, [socket]);
  return (
    <div className="App">
      <div>
        <input
          type="text"
          onChange={(e) => setRoom(e.target.value)}
          value={room}
        />
        <button onClick={joinRoom}>Join Room</button>
      </div>
      <div>
        <input
          type="text"
          onChange={(e) => setMessage(e.target.value)}
          value={message}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
      <h1>{messageReceived}</h1>
    </div>
  );
}

export default App;
