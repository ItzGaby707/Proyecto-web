import React, { useRef, useEffect, useState } from "react";
import * as tmImage from "@teachablemachine/image";

const PreguntaGeometrica = () => {
  const webcamRef = useRef(null);
  const containerRef = useRef(null);
  const [figura, setFigura] = useState("Inicializando...");
  const modelRef = useRef(null);
  const rafIdRef = useRef(null);

  const MODEL_URL = "/model_figuras/";

  useEffect(() => {
    let isMounted = true;

    const loadModelAndWebcam = async () => {
      try {
        const modelURL = MODEL_URL + "model.json";
        const metadataURL = MODEL_URL + "metadata.json";

        // Cargar modelo
        const model = await tmImage.load(modelURL, metadataURL);
        modelRef.current = model;

        // Inicializar webcam
        const webcam = new tmImage.Webcam(224, 224, true);
        await webcam.setup();
        await webcam.play();
        webcamRef.current = webcam;

        // Mostrar canvas en contenedor
        if (isMounted && containerRef.current) {
          containerRef.current.innerHTML = "";
          containerRef.current.appendChild(webcam.canvas);
        }

        // Iniciar loop de predicción
        detectLoop();
      } catch (err) {
        console.error("Error inicializando modelo o cámara:", err);
        setFigura("Error al cargar modelo");
      }
    };

    const detectLoop = async () => {
      if (!modelRef.current || !webcamRef.current) return;

      webcamRef.current.update();

      const predictions = await modelRef.current.predict(webcamRef.current.canvas);

      if (predictions.length > 0) {
        const mejor = predictions.reduce((a, b) =>
          a.probability > b.probability ? a : b
        );
        setFigura(`${mejor.className} (${(mejor.probability * 100).toFixed(1)}%)`);
      }

      rafIdRef.current = requestAnimationFrame(detectLoop);
    };

    loadModelAndWebcam();

    return () => {
      isMounted = false;
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      if (webcamRef.current) webcamRef.current.stop();
    };
  }, []);

  return (
    <div style={{ textAlign: "center", padding: "1rem" }}>
      <h2>Detector de Figuras Geométricas</h2>
      <div ref={containerRef} style={{ marginBottom: "1rem" }} />
      <div
        style={{
          fontSize: "1.5rem",
          fontWeight: "bold",
          color: "#1e88e5"
        }}
      >
        {figura}
      </div>
    </div>
  );
};

export default PreguntaGeometrica;
