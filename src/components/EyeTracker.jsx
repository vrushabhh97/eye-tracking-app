import React, { useEffect, useState } from "react";

const EyeTracker = () => {
  const [apiLoaded, setApiLoaded] = useState(false);
  const [calibrated, setCalibrated] = useState(false);
  const [tracking, setTracking] = useState(false);

  useEffect(() => {
    // ✅ Dynamically add the GazeRecorderAPI script
    const script = document.createElement("script");
    script.src = "https://api.gazerecorder.com/GazeCloudAPI.js";
    script.async = true;
    script.onload = () => {
      console.log("✅ GazeRecorderAPI Script Loaded Successfully");
      checkApiLoaded();
    };
    script.onerror = () => console.error("❌ Failed to load GazeRecorderAPI script");
    document.body.appendChild(script);

    const checkApiLoaded = () => {
      if (window.GazeRecorderAPI && typeof window.GazeRecorderAPI.Rec === "function") {
        console.log("✅ GazeRecorderAPI is fully initialized!");
        setApiLoaded(true);
      } else {
        console.warn("❌ GazeRecorderAPI not ready. Retrying in 1 second...");
        setTimeout(checkApiLoaded, 1000);
      }
    };
  }, []);

  const handleStartCalibration = () => {
    if (!apiLoaded) {
      console.error("❌ GazeRecorderAPI is not loaded yet.");
      return;
    }

    console.log("🎯 Starting Calibration...");
    window.GazeRecorderAPI.Rec();

    window.GazeRecorderAPI.OnCalibrationComplete = function () {
      console.log("✅ Gaze Calibration Complete");
      setCalibrated(true);
      setTracking(true);
    };

    window.GazeRecorderAPI.OnError = function (msg) {
      console.error("❌ GazeRecorderAPI Error:", msg);
    };
  };

  const handleStopTracking = () => {
    if (!apiLoaded) {
      console.error("❌ GazeRecorderAPI is not loaded yet.");
      return;
    }

    window.GazeRecorderAPI.StopRec();
    setTracking(false);
    console.log("🚫 Eye Tracking Stopped.");
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Gaze Tracking with GazeRecorder</h1>
      {!apiLoaded ? (
        <p>⏳ Loading GazeRecorder API... (Please wait)</p>
      ) : !calibrated ? (
        <>
          <p>Click below to start calibration.</p>
          <button
            onClick={handleStartCalibration}
            style={{
              marginTop: "20px",
              padding: "10px 20px",
              backgroundColor: "blue",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Start Calibration
          </button>
        </>
      ) : tracking ? (
        <>
          <p>Move your eyes around, and your heatmap will be generated.</p>
          <p>Check the GazeRecorder dashboard for heatmap analysis.</p>
          <button
            onClick={handleStopTracking}
            style={{
              marginTop: "20px",
              padding: "10px 20px",
              backgroundColor: "red",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Stop Eye Tracking
          </button>
        </>
      ) : (
        <p>🚫 Eye tracking has been stopped.</p>
      )}
    </div>
  );
};

export default EyeTracker;
