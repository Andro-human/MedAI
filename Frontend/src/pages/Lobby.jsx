import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../context/SocketProvider";

const LobbyScreen = () => {
  const [email, setEmail] = useState("");
  const [room, setRoom] = useState("");
  const socket = useSocket();
  const navigate = useNavigate();

  const handleJoin = () => {
    if (!room || !email) return;
    socket.emit("join", room);
    navigate(`/room/${room}`);
  };

  return (
    <div>
      <h2>Join Room</h2>
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <input value={room} onChange={(e) => setRoom(e.target.value)} placeholder="Room ID" />
      <button onClick={handleJoin}>Join</button>
    </div>
  );
};

export default LobbyScreen;
