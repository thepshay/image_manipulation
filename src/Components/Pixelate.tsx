import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { medianCut } from "../utils/quantizationUtils";
import { copyCanvas, fillCanvas, getPixelMatrix } from "../utils/utils";
import { getDownscaleMatrix, getUpscalePixelMatrix, orderDither } from "../utils/pixelateUtils";
import DownloadCanvas from "./DownloadCanvas";
import '../assets/stylings/_Pixelate.css';

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
  const [pixelSize, setPixelSize] = useState(4);

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
    const downscalePixelMatrix = getDownscaleMatrix(pixelMatrix, pixelSize);
    const ditheredMatrix = orderDither(downscalePixelMatrix, 4, colorPalette);
    const upscalePixelMatrix = getUpscalePixelMatrix(ditheredMatrix, pixelSize);
    const mapCanvas = pixelateCanvasRef.current as HTMLCanvasElement
    const ctx = mapCanvas.getContext('2d') as CanvasRenderingContext2D;

    fillCanvas(ctx, upscalePixelMatrix, mapCanvas.width, mapCanvas.height);

    console.log('finish pixelate');
  }

  const updatePixelSize = (e: ChangeEvent<HTMLInputElement>) => {
    const newSize = Number(e.target.value);
    setPixelSize(newSize);
  }

  return (
    <div>
      <div>
        <div className="control-container">
          <div>
            <div>Color Palette (base 2 scale)</div>
            <div className="radio-container">
              {new Array(9).fill(null).map((_, idx) => {
                const value = idx;
                return (
                  <div key={idx} className="radio-item">
                    <input
                      type='radio'
                      id={`size-${value}`}
                      value={value}
                      checked={value === power}
                      onChange={handleUpdatePower}
                    />
                    <label htmlFor={`size-${value}`}>{value}</label>
                  </div>
                )
              })}
            </div>
          </div>
          <br />
        </div>
        <div>
          <div>Pixel Size</div>
          <div className="radio-container">
            {new Array(9).fill(null).map((_, idx) => {
              const value = idx * idx;
              return (
                <div key={idx} className="radio-item">
                  <input
                    type='radio'
                    id={`size-${value}`}
                    value={value}
                    checked={value === pixelSize}
                    onChange={updatePixelSize}
                  />
                  <label htmlFor={`size-${value}`}>{value}</label>
                </div>
              )
            })}
          </div>
        </div>
      </div>
      <br />
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