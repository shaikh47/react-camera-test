import Webcam from "react-webcam";
import React from "react";
import { useState, useRef, useCallback } from "react";
import Webcam_modified from "./Webcam";

const App = () => {
  const webcamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [recordedChunks, setRecordedChunks] = useState([]);

  const handleStartCaptureClick = useCallback(() => {
    mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
      mimeType: "video/webm",
    });
    mediaRecorderRef.current.addEventListener(
      "dataavailable",
      handleDataAvailable
    );
    mediaRecorderRef.current.start();
  }, [webcamRef, mediaRecorderRef]);

  const handleDataAvailable = useCallback(
    ({ data }) => {
      if (data.size > 0) {
        setRecordedChunks((prev) => prev.concat(data));
      }
    },
    [setRecordedChunks]
  );

  const handleStopCaptureClick = useCallback(() => {
    mediaRecorderRef.current.stop();
  }, [mediaRecorderRef, webcamRef]);

  const handleDownload = useCallback(() => {
    if (recordedChunks.length) {
      const blob = new Blob(recordedChunks, {
        type: "video/mp4",
      });
      const url = URL.createObjectURL(blob);

      console.log(url)

      const a = document.createElement("a");
      document.body.appendChild(a);
      a.style = "display: none";
      a.href = url;
      a.download = "react-webcam-stream-capture.mp4";
      a.click();
      window.URL.revokeObjectURL(url);
      setRecordedChunks([]);
    }
  }, [recordedChunks]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "5px",
      }}
    >
      <button onClick={handleStartCaptureClick}> Start Capture</button>
      <button onClick={handleStopCaptureClick}> Stop Capture</button>
      {recordedChunks.length > 0 && (
        <button onClick={handleDownload}>Download</button>
      )}
      <Webcam audio={true} ref={webcamRef} />
    </div>
  );
};

export default App;
