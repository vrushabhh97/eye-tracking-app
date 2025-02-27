import React, { useEffect, useState } from "react";

const EyeTracker = () => {
  const [apiLoaded, setApiLoaded] = useState(false);

  useEffect(() => {
    const loadScript = () => {
      console.log("🔄 Injecting GazeRecorderAPI script...");
      const script = document.createElement("script");
      script.src = "https://api.gazerecorder.com/GazeCloudAPI.js";
      script.async = true;
      script.onload = () => {
        console.log("✅ GazeRecorderAPI Script Loaded");
        checkApiReady();
      };
      script.onerror = () => console.error("❌ Failed to load GazeRecorderAPI script");
      document.body.appendChild(script);
    };

    const checkApiReady = () => {
      if (window.GazeRecorderAPI && typeof window.GazeRecorderAPI.Rec === "function") {
        console.log("✅ GazeRecorderAPI is fully initialized!");
        setApiLoaded(true);
      } else {
        console.warn("⏳ Waiting for GazeRecorderAPI... Retrying in 2 seconds...");
        setTimeout(checkApiReady, 2000);
      }
    };

    if (!window.GazeRecorderAPI) {
      loadScript();
    } else {
      checkApiReady();
    }
  }, []);

  const handleStartTracking = () => {
    if (!apiLoaded) {
      console.error("❌ GazeRecorderAPI is not loaded yet.");
      return;
    }

    console.log("🎯 Starting Eye Tracking...");
    window.GazeRecorderAPI.Rec();
    
    // ✅ ENABLE HEATMAP
    window.GazeRecorderAPI.ShowHeatMap(true);
  };

  const handleStopTracking = () => {
    if (!apiLoaded) {
      console.error("❌ GazeRecorderAPI is not loaded yet.");
      return;
    }

    window.GazeRecorderAPI.StopRec();
    console.log("🚫 Eye Tracking Stopped.");
    
    // ✅ DISABLE HEATMAP
    window.GazeRecorderAPI.ShowHeatMap(false);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Gaze Tracking with Heatmap</h1>
      {!apiLoaded ? (
        <p>⏳ Loading GazeRecorder API... (Please wait)</p>
      ) : (
        <>
          <p>Click the button below to start eye tracking with heatmap.</p>
          <button
            onClick={handleStartTracking}
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
            Start Tracking
          </button>

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
              marginLeft: "20px",
            }}
          >
            Stop Tracking
          </button>
        </>
      )}
    </div>
  );
};

export default EyeTracker;
