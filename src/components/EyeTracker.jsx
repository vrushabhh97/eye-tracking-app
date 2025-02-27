import React, { useEffect, useState } from "react";

const EyeTracker = () => {
  const [calibrated, setCalibrated] = useState(false);
  const [tracking, setTracking] = useState(false);

  // Function to start calibration
  const handleStartCalibration = () => {
    if (!window.GazeRecorderAPI) {
      console.error("GazeRecorderAPI not loaded");
      return;
    }

    console.log("Starting Calibration...");
    window.GazeRecorderAPI.Rec(); // Start calibration & tracking

    // Handle calibration completion
    window.GazeRecorderAPI.OnCalibrationComplete = function () {
      console.log("Gaze Calibration Complete");
      setCalibrated(true); // Set calibration as complete
      setTracking(true); // Start tracking after calibration
    };

    // Handle errors
    window.GazeRecorderAPI.OnError = function (msg) {
      console.error("GazeRecorderAPI Error:", msg);
    };
  };

  // Function to stop tracking
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
      {!calibrated ? (
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
        <p>Eye tracking has been stopped.</p>
      )}
    </div>
  );
};

export default EyeTracker;
