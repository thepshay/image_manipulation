import { useEffect, useRef, useState } from "react";
import { medianCut, remapCanvas } from "../utils/quantizationUtils";
import { copyCanvas, fillCanvas, getPixelMatrix } from "../utils/utils";
import { getDownscaleMatrix, getUpscalePixelMatrix, orderDither } from "../utils/pixelateUtils";
import DownloadCanvas from "./DownloadCanvas";

interface PixelateProps {
  canvasRef: React.RefObject<null>;
  imageAdded: boolean;
  pixelsData: { r: number, g: number, b: number, a: number }[];
}

const Pixelate = ({
  canvasRef,
  imageAdded,
  pixelsData,
}: PixelateProps) => {

  const pixelateCanvasRef = useRef(null);
  const [power, setPower] = useState(1);
  const nonTransparentPixels = pixelsData.filter((color) => color.a !== 0);
  const [toBeScaled, setToBeScaled] = useState(4);

  useEffect(() => {
    if (!canvasRef.current) {
      console.log('Flood: no canvas found');
      return;
    }

    if (!imageAdded) {
      return;
    }

    const canvas = canvasRef.current as HTMLCanvasElement;
    copyCanvas(canvas, pixelateCanvasRef);
  }, [imageAdded]);


  const handleUpdatePower = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPower = Number(e.target.value);
    setPower(newPower);
  }

  const handlePixelate = () => {
    if (!canvasRef.current) {
      console.log('no original canvas ref');
      return;
    }

    if (!pixelateCanvasRef.current) {
      console.log('no pixel canvas ref');
      return;
    }

    const originalCanvas = canvasRef.current as HTMLCanvasElement;
    const colorPalette = medianCut(nonTransparentPixels, power);
    const pixelMatrix = getPixelMatrix(pixelsData, originalCanvas.width, originalCanvas.height);
    const downscalePixelMatrix = getDownscaleMatrix(pixelMatrix, toBeScaled);
    const ditheredMatrix = orderDither(downscalePixelMatrix, 4, colorPalette);
    const upscalePixelMatrix = getUpscalePixelMatrix(ditheredMatrix, toBeScaled);
    const mapCanvas = pixelateCanvasRef.current as HTMLCanvasElement
    const ctx = mapCanvas.getContext('2d') as CanvasRenderingContext2D;

    fillCanvas(ctx, upscalePixelMatrix, mapCanvas.width, mapCanvas.height);

    console.log('finish pixelate');
  }

  return (
    <div>
      <div>
        <input type="range"
          value={power}
          min="0"
          max="8"
          list="power"
          onChange={handleUpdatePower}
        />
        <datalist id='power'>
          <option value="0" />
          <option value="1" />
          <option value="2" />
          <option value="3" />
          <option value="4" />
          <option value="5" />
          <option value="6" />
          <option value="7" />
          <option value="8" />
        </datalist>
        <br />
        <span>{power}</span>
      </div>
      <button onClick={handlePixelate}>Pixelate</button>
      <br />
      <canvas
        id="pixelate-canvas"
        className={imageAdded ? "" : "hide"}
        ref={pixelateCanvasRef}
      ></canvas>
      {pixelateCanvasRef.current && imageAdded &&
        <DownloadCanvas
          canvas={pixelateCanvasRef.current as HTMLCanvasElement}
        />
      }
    </div>
  )
}

export default Pixelate;