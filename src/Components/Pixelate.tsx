import { useEffect, useRef, useState } from "react";
import { medianCut } from "../utils/quantizationUtils";
import { copyCanvas } from "../utils/utils";

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

  const pixelateCanvasRev = useRef(null);
  const [power, setPower] = useState(1);
  const nonTransparentPixels = pixelsData.filter((color) => color.a !== 0);
  const [scaleToDownscale, setScaleToDownscale] = useState(4);

  useEffect(() => {
    if (!canvasRef.current) {
      console.log('Flood: no canvas found');
      return;
    }

    if (!imageAdded) {
      return;
    }

    const canvas = canvasRef.current as HTMLCanvasElement;
    copyCanvas(canvas, pixelateCanvasRev);
  }, [imageAdded]);


  const handleUpdatePower = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPower = Number(e.target.value);
    setPower(newPower);
  }

  const handlePixelate = () => {
    if (!canvasRef.current) {
      return;
    }

    const originalCanvas = canvasRef.current as HTMLCanvasElement;
    const colorPalette = medianCut(nonTransparentPixels, power);
    // const pixelMatrix = getPixelMatrix(pixelsData, originalCanvas.width, originalCanvas.height);

    // const downscalePixelMatrix = getDownscaleMatrix(pixelMatrix, scaleToDownscale);

    // console.log(downscalePixelMatrix)
  }

  const getPixelMatrix = (colorData: Uint8ClampedArray<ArrayBufferLike>, width: number, height: number) => {
    const colorMatrix = [];

    for (let y = 0; y < height; y++) {
      const row = [];

      for (let x = 0; x < width; x++) {
        const index = (y * width + x) * 4;

        const r = colorData[index];
        const g = colorData[index + 1];
        const b = colorData[index + 2];
        const a = colorData[index + 3];

        const color = { r, g, b, a };
        row.push(color);

      }
      colorMatrix.push(row);
    }

    return colorMatrix;
  }

  const getDownscaleMatrix = (
    pixelMatrix: {
      r: number;
      g: number;
      b: number;
      a: number;
    }[][],
    scaleToDownscale: number
  ) => {
    const newHeight = Math.floor(pixelMatrix.length / scaleToDownscale);
    const newWidth = Math.floor(pixelMatrix[0].length / scaleToDownscale);

    const downscaleMatrix = [];

    for (let i = 0; i < newHeight; i++) {
      const row = [];
      for (let j = 0; j < newWidth; j++) {
        const pixel = pixelMatrix[i * scaleToDownscale][j * scaleToDownscale];
        row.push(pixel);
      }
      downscaleMatrix.push(row);
    }

    return downscaleMatrix;
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
        ref={pixelateCanvasRev}
      ></canvas>
    </div>
  )
}

export default Pixelate;