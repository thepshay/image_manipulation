import type React from "react";
import { useEffect, useRef, useState } from "react";
import { floodImage } from '../utils/utils.js'

interface FloodFillProps {
  canvasRef: React.RefObject<null>;
  imageAdded: boolean;
}

const FloodFill = ({
  canvasRef,
  imageAdded,
}: FloodFillProps) => {

  const [floodColor, setFloodColor] = useState({ red: 0, green: 0, blue: 0 });
  const [startingPosition, setStartingPosition] = useState({ x_coord: 0, y_coord: 0 });
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  const floodCanvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) {
      console.log('Flood: no canvas found');
      return;
    }

    if (!imageAdded) {
      return;
    }

    const canvas = canvasRef.current as HTMLCanvasElement;
    copyCanvas(canvas);
  }, [imageAdded]);

  const copyCanvas = (canvas: HTMLCanvasElement) => {
    if (!floodCanvasRef.current) {
      console.log('copyCanvas(): no flood canvas');
      return;
    }

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    setWidth(canvasWidth);
    setHeight(canvasHeight);

    const floodCanvas = floodCanvasRef.current as HTMLCanvasElement;
    const ctx = floodCanvas.getContext('2d');

    floodCanvas.width = canvasWidth;
    floodCanvas.height = canvasHeight;

    ctx?.drawImage(canvas, 0, 0, canvasWidth, canvasHeight);
  }

  const handleUpdateColor = (
    e: React.ChangeEvent<HTMLInputElement>,
    color: "red" | "green" | "blue"
  ) => {
    const value = Number(e.target.value);

    setFloodColor({
      ...floodColor,
      [color]: value,
    })
  }

  const handleUpdatePosition = (
    e: React.ChangeEvent<HTMLInputElement>,
    coordinateType: "x_coord" | "y_coord"
  ) => {
    const value = Number(e.target.value);

    setStartingPosition({
      ...startingPosition,
      [coordinateType]: value,
    })
  }

  const handleFlood = () => {
    if (!validateInput()) {
      alert("invalid inputs");
      return;
    }

    console.log('handleFlood() valid');

    floodImage({ floodColor, startingPosition, floodCanvasRef });
  }

  const validateInput = () => {
    if (floodColor.red < 0 || floodColor.red > 255) return false;
    if (floodColor.green < 0 || floodColor.green > 255) return false;
    if (floodColor.blue < 0 || floodColor.blue > 255) return false;

    if (startingPosition.x_coord < 0 || startingPosition.x_coord > width) return false;
    if (startingPosition.y_coord < 0 || startingPosition.y_coord > height) return false;

    return true;
  }

  return (
    <div>
      <br />
      <div>
        <div>
          <div>R</div>
          <input
            type="number"
            min={0}
            max={255}
            onChange={(e) => handleUpdateColor(e, 'red')}
            defaultValue={floodColor.red}
          />
        </div>
        <div>
          <div>G</div>
          <input
            type="number"
            min={0}
            max={255}
            onChange={(e) => handleUpdateColor(e, 'green')}
            defaultValue={floodColor.green}
          />
        </div>
        <div>
          <div>B</div>
          <input
            type="number"
            min={0}
            max={255}
            onChange={(e) => handleUpdateColor(e, 'blue')}
            defaultValue={floodColor.blue}
          />
        </div>
      </div>
      <br />
      <div>
        <div>Starting From:</div>
        <input
          type="number"
          onChange={(e) => handleUpdatePosition(e, "x_coord")}
          defaultValue={startingPosition.x_coord}
        />
        &nbsp;x&nbsp;
        <input
          type="number"
          onChange={(e) => handleUpdatePosition(e, "y_coord")}
          defaultValue={startingPosition.y_coord}
        />
      </div>
      <br />
      <button
        onClick={handleFlood}
      >
        Flood
      </button>
      <div>
        <br />
        <canvas
          id="flood-canvas"
          className={imageAdded ? "" : "hide"}
          ref={floodCanvasRef}
        ></canvas>
      </div>
    </div>
  )
}

export default FloodFill;