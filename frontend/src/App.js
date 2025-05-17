// Ensure .env file has: REACT_APP_BACKEND_URL=http://localhost:5001

import React, { useEffect, useRef, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Peer from "simple-peer";
import io from "socket.io-client";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import PhoneIcon from "@material-ui/icons/Phone";
import AssignmentIcon from "@material-ui/icons/Assignment";
import Navbar from "./components/Navbar";
import "./App.css";

const socket = io.connect("https://telecounselling-2.onrender.com" || "http://localhost:5001");

// Rest of your App component (same as before)...

function App() {
  const [me, setMe] = useState("");
  const [stream, setStream] = useState();
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [idToCall, setIdToCall] = useState("");
  const [myName, setMyName] = useState("");
  const [callerName, setCallerName] = useState("");
  const [role, setRole] = useState(null);
  const [concern, setConcern] = useState("");

  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();

  const requestMedia = async () => {
    try {
      const currentStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setStream(currentStream);
    } catch (err) {
      console.error("Media access denied:", err);
    }
  };

  useEffect(() => {
    if (role) {
      requestMedia();
    }
  }, [role]);

  useEffect(() => {
    socket.on("me", (id) => setMe(id));
    socket.on("callUser", (data) => {
      setReceivingCall(true);
      setCaller(data.from);
      setCallerSignal(data.signal);
      setCallerName(data.name);
    });

    return () => {
      socket.off("me");
      socket.off("callUser");
    };
  }, []);

  useEffect(() => {
    if (myVideo.current && stream) {
      myVideo.current.srcObject = stream;
    }
  }, [stream]);

  const callUser = (id) => {
    const peer = new Peer({ initiator: true, trickle: false, stream });

    peer.on("signal", (data) => {
      socket.emit("callUser", {
        userToCall: id,
        signalData: data,
        from: me,
        name: myName,
      });
    });

    peer.on("stream", (remoteStream) => {
      if (userVideo.current) {
        userVideo.current.srcObject = remoteStream;
      }
    });

    socket.on("callAccepted", (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  const answerCall = () => {
    setCallAccepted(true);
    const peer = new Peer({ initiator: false, trickle: false, stream });

    peer.on("signal", (data) => {
      socket.emit("answerCall", { signal: data, to: caller });
    });

    peer.on("stream", (remoteStream) => {
      if (userVideo.current) {
        userVideo.current.srcObject = remoteStream;
      }
    });

    peer.signal(callerSignal);
    connectionRef.current = peer;
  };

  const leaveCall = () => {
    setCallEnded(true);
    connectionRef.current?.destroy();
    window.location.reload();
  };

  if (!role) {
    return (
      <>
        <Navbar />
        <div className="role-selection" style={{ textAlign: "center", paddingTop: 60 }}>
          <h2 style={{ marginBottom: 30 }}>Welcome to MindConnect</h2>
          <p style={{ color: "#666", marginBottom: 40 }}>How would you like to continue?</p>
          <div style={{ display: "flex", justifyContent: "center", gap: "40px" }}>
            <div
              onClick={() => setRole("doctor")}
              style={{
                background: "#e0f7f1",
                padding: "30px 40px",
                borderRadius: 16,
                cursor: "pointer",
                width: 220,
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <h3>🧑‍⚕️ Doctor</h3>
              <p style={{ fontSize: "14px", color: "#444" }}>Start as a professional</p>
            </div>

            <div
              onClick={() => setRole("patient")}
              style={{
                background: "#e8ecff",
                padding: "30px 40px",
                borderRadius: 16,
                cursor: "pointer",
                width: 220,
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <h3>🙋 Patient</h3>
              <p style={{ fontSize: "14px", color: "#444" }}>Connect for a session</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container">
        <h1 className="heading">MindConnect - Secure Video Consultation</h1>
        <div className="glass-card">
          <div className="video-container">
            {callAccepted && !callEnded ? (
              <div className="video-wrapper">
                <video playsInline ref={userVideo} autoPlay className="remote-video" />
                {callerName && <div className="name-tag">{callerName}</div>}
              </div>
            ) : (
              <div className="remote-video" style={{ display: "flex", alignItems: "center", justifyContent: "center", color: "#ccc" }}>
                Waiting for connection...
              </div>
            )}

            <div className="video-wrapper local-video-wrapper">
              <video playsInline muted ref={myVideo} autoPlay className="local-video" />
              {myName && <div className="name-tag local-name-tag">{myName}</div>}
            </div>
          </div>

          <div style={{ marginTop: 30 }}>
            <TextField
              label="Your Name"
              variant="filled"
              value={myName}
              onChange={(e) => setMyName(e.target.value)}
              fullWidth
              style={{ marginBottom: 16 }}
            />

            {role === "patient" && (
              <>
                <TextField
                  label="What brings you here today?"
                  variant="filled"
                  value={concern}
                  onChange={(e) => setConcern(e.target.value)}
                  fullWidth
                  style={{ marginBottom: 16 }}
                />

                <TextField
                  label="Doctor ID"
                  variant="filled"
                  value={idToCall}
                  onChange={(e) => setIdToCall(e.target.value)}
                  fullWidth
                  style={{ marginBottom: 20 }}
                />
              </>
            )}

            {role === "doctor" && (
              <CopyToClipboard text={me}>
                <Button
                  variant="contained"
                  startIcon={<AssignmentIcon />}
                  style={{ backgroundColor: "#2f8673", color: "white", marginBottom: 16 }}
                  fullWidth
                >
                  Copy Your Doctor ID
                </Button>
              </CopyToClipboard>
            )}

            <div>
              {callAccepted && !callEnded ? (
                <Button variant="contained" color="secondary" onClick={leaveCall} fullWidth>
                  End Consultation
                </Button>
              ) : role === "patient" ? (
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<PhoneIcon />}
                  onClick={() => callUser(idToCall)}
                  fullWidth
                >
                  Join Consultation
                </Button>
              ) : null}
            </div>

            {receivingCall && !callAccepted && (
              <div style={{ marginTop: 20 }}>
                <h2>{callerName || "Someone"} is calling...</h2>
                <Button
                  variant="contained"
                  style={{ backgroundColor: "#2f8673", color: "white" }}
                  onClick={answerCall}
                  fullWidth
                >
                  Accept Consultation
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;