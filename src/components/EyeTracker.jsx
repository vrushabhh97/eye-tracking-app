import React, { useEffect, useState } from "react";

const EyeTracker = () => {
  const [apiLoaded, setApiLoaded] = useState(false);
  const [calibrated, setCalibrated] = useState(false);
  const [tracking, setTracking] = useState(false);

  useEffect(() => {
    // ✅ Check every 500ms if GazeRecorderAPI is loaded
    const checkApi = setInterval(() => {
      if (window.GazeRecorderAPI) {
        clearInterval(checkApi);
        setApiLoaded(true);
        console.log("✅ GazeRecorderAPI Loaded Successfully");
      }
    }, 500);

    return () => clearInterval(checkApi);
  }, []);

  // Function to start calibration
  const handleStartCalibration = () => {
    if (!apiLoaded) {
      console.error("❌ GazeRecorderAPI not loaded yet.");
      return;
    }

    console.log("🎯 Starting Calibration...");
    window.GazeRecorderAPI.Rec(); // Start calibration & tracking

    // Handle calibration completion
    window.GazeRecorderAPI.OnCalibrationComplete = function () {
      console.log("✅ Gaze Calibration Complete");
      setCalibrated(true);
      setTracking(true);
    };

    // Handle errors
    window.GazeRecorderAPI.OnError = function (msg) {
      console.error("❌ GazeRecorderAPI Error:", msg);
    };
  };

  // Function to stop tracking
  const handleStopTracking = () => {
    if (!apiLoaded) {
      console.error("❌ GazeRecorderAPI not loaded yet.");
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
        <p>⏳ Loading GazeRecorder API...</p> // ✅ Show loading message until API loads
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
