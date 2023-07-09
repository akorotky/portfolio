import { useRef, useEffect } from "react";
import { createAnimation, animate, cleanup } from "./threeJsAnimation";

export const ThreeJsCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const state = createAnimation(canvasRef.current);
    animate({ ...state });
    return () => cleanup({ ...state });
  }, []);

  return <canvas ref={canvasRef}></canvas>;
};
