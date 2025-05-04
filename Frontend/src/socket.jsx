import { createContext, useContext, useMemo } from "react";
import io from "socket.io-client";

const SocketContext = createContext();
const GetSocket = () => useContext(SocketContext);

const SocketProvider = ({ children }) => {
  const socket = useMemo(() => {
    const token = localStorage.getItem("token");

    return io(import.meta.env.VITE_SERVER, {
      transports: ["websocket"],
      query: {
        token,
      },
    });
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export { SocketProvider, GetSocket };
