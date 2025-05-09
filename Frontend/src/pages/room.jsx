import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useSocket } from "../context/SocketProvider";

const Room = () => {
  const { roomId } = useParams();
  const socket = useSocket();
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const peerConnectionRef = useRef(null); 
  const remoteStreamRef = useRef(new MediaStream());

  const config = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  };

  useEffect(() => {
    if (!socket) return;

    const init = async () => {
      const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localVideoRef.current.srcObject = localStream;

      const pc = new RTCPeerConnection(config);
      peerConnectionRef.current = pc;

      // Add tracks only once
      localStream.getTracks().forEach(track => {
        pc.addTrack(track, localStream);
      });

      // ICE candidates
      pc.onicecandidate = (e) => {
        if (e.candidate) {
          socket.emit("ice-candidate", { candidate: e.candidate, target: roomId });
        }
      };

      // Handle incoming remote tracks
      pc.ontrack = (e) => {
        if (!remoteVideoRef.current.srcObject) {
          remoteVideoRef.current.srcObject = remoteStreamRef.current;
        }
        remoteStreamRef.current.addTrack(e.track);
      };

      socket.emit("join", roomId);
    };

    init();

    // Listeners
    socket.on("user-joined", async (id) => {
      const pc = peerConnectionRef.current;
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      socket.emit("offer", { target: id, sdp: offer });
    });

    socket.on("offer", async ({ sdp, sender }) => {
      const pc = peerConnectionRef.current;
      await pc.setRemoteDescription(new RTCSessionDescription(sdp));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socket.emit("answer", { target: sender, sdp: answer });
    });

    socket.on("answer", async ({ sdp }) => {
      const pc = peerConnectionRef.current;
      await pc.setRemoteDescription(new RTCSessionDescription(sdp));
    });

    socket.on("ice-candidate", ({ candidate }) => {
      const pc = peerConnectionRef.current;
      if (candidate) pc.addIceCandidate(new RTCIceCandidate(candidate));
    });

    return () => {
      socket.off("user-joined");
      socket.off("offer");
      socket.off("answer");
      socket.off("ice-candidate");
      peerConnectionRef.current?.close();
    };
  }, [socket, roomId]);

  return (
    <div>
      <h2>Room: {roomId}</h2>
      <video ref={localVideoRef} autoPlay muted playsInline />
      <video ref={remoteVideoRef} autoPlay playsInline />
    </div>
  );
};

export default Room;
