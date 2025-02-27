import React, { useEffect, useRef, useState, useCallback } from "react";
import * as d3 from "d3";

const EyeTracker = () => {
  const canvasRef = useRef(null);
  const [gazeData, setGazeData] = useState([]);

  useEffect(() => {
    if (!window.GazeCloudAPI) {
      console.error("GazeCloudAPI not loaded");
      return;
    }

    // Start Eye Tracking
    window.GazeCloudAPI.StartEyeTracking();

    // Capture gaze data
    window.GazeCloudAPI.OnResult = function (GazeData) {
      if (GazeData.state === 0) {
        setGazeData((prevData) => [
          ...prevData,
          { x: GazeData.docX, y: GazeData.docY, timestamp: Date.now() },
        ]);
      }
    };

    return () => {
      window.GazeCloudAPI.StopEyeTracking();
    };
  }, []);

  // ✅ Use useCallback to memoize drawHeatmap function
  const drawHeatmap = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    // Clear previous frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Count how many times each area has been looked at
    const heatmapData = {};
    gazeData.forEach(({ x, y }) => {
      const key = `${Math.round(x / 10) * 10},${Math.round(y / 10) * 10}`;
      heatmapData[key] = (heatmapData[key] || 0) + 1;
    });

    // Determine the max gaze count for color scaling
    const maxGazeCount = Math.max(...Object.values(heatmapData), 1);

    // Define color scale from Green → Yellow → Red
    const colorScale = d3
      .scaleSequential(d3.interpolateRdYlGn)
      .domain([maxGazeCount, 1]); // Red for max, green for low

    // Draw heatmap points
    Object.entries(heatmapData).forEach(([key, count]) => {
      const [x, y] = key.split(",").map(Number);
      ctx.beginPath();
      ctx.arc(x, y, 30, 0, 2 * Math.PI);
      ctx.fillStyle = colorScale(count); // Apply gradient color based on gaze intensity
      ctx.fill();
    });
  }, [gazeData]); // ✅ Now React knows drawHeatmap depends on gazeData

  useEffect(() => {
    drawHeatmap();
  }, [gazeData, drawHeatmap]); // ✅ Added drawHeatmap as a dependency

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
      <h1 style={{ textAlign: "center" }}>Eye Tracking Heatmap</h1>
      <p style={{ textAlign: "center" }}>Move your eyes around the screen.</p>
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          pointerEvents: "none",
        }}
      ></canvas>
    </div>
  );
};

export default EyeTracker;
