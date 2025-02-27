import React, { useEffect, useState } from "react";

const EyeTracker = () => {
  const [tracking, setTracking] = useState(true); // State to track if eye tracking is active

  useEffect(() => {
    if (!window.GazeRecorderAPI) {
      console.error("GazeRecorderAPI not loaded");
      return;
    }

    console.log("Starting Eye Tracking...");
    window.GazeRecorderAPI.Rec(); // Start recording gaze data
    setTracking(true);

    // Optional: Handle calibration completion
    window.GazeRecorderAPI.OnCalibrationComplete = function () {
      console.log("Gaze Calibration Complete");
    };

    // Optional: Handle errors
    window.GazeRecorderAPI.OnError = function (msg) {
      console.error("GazeRecorderAPI Error:", msg);
    };

    return () => {
      console.log("Stopping Eye Tracking...");
      window.GazeRecorderAPI.StopRec(); // Stop tracking when component unmounts
      setTracking(false);
    };
  }, []);

  // Function to manually stop tracking
  const handleStopTracking = () => {
    if (window.GazeRecorderAPI) {
      window.GazeRecorderAPI.StopRec();
      setTracking(false);
      console.log("Eye Tracking Stopped.");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Gaze Tracking with GazeRecorder</h1>
      <p>Move your eyes around, and your heatmap will be generated.</p>
      <p>Check the GazeRecorder dashboard for heatmap analysis.</p>
      
      {tracking ? (
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
      ) : (
        <p>Eye tracking has been stopped.</p>
      )}
    </div>
  );
};

export default EyeTracker;
