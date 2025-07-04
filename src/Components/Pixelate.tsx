import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { getDistanceMappingPixels, medianCut } from "../utils/quantizationUtils";
import { copyCanvas, fillCanvas, getPixelMatrix } from "../utils/utils";
import { getDownscaleMatrix, getUpscalePixelMatrix, orderDither } from "../utils/pixelateUtils";
import DownloadCanvas from "./DownloadCanvas";
import '../assets/stylings/_Pixelate.css';

interface PixelateProps {
  canvasRef: React.RefObject<null>;
  imageAdded: boolean;
  pixelsData: { r: number, g: number, b: number, a: number }[];
  imageName: string;
}

const Pixelate = ({
  canvasRef,
  imageAdded,
  pixelsData,
  imageName,
}: PixelateProps) => {
  const DOWN_DITHER_UP = 0;
  const DITHER_DOWN_UP = 1;
  const DOWN_UP = 2;
  const DOWN_DIST_UP = 3;

  const pixelateCanvasRef = useRef(null);
  const [power, setPower] = useState(3);
  const nonTransparentPixels = pixelsData.filter((color) => color.a !== 0);
  const [pixelSize, setPixelSize] = useState(8);
  const [pixelateType, setPixeateType] = useState(DOWN_DITHER_UP);

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

  const handleSelectPixelateOption = (e: ChangeEvent<HTMLSelectElement>) => {
    setPixeateType(Number(e.target.value));
  }

  const handlePixelateDownDitherUp = () => {
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
    const mapCanvas = pixelateCanvasRef.current as HTMLCanvasElement
    const processedMatrix = handlePixelation(pixelMatrix, colorPalette);

    fillCanvas(mapCanvas, processedMatrix);

    console.log('finish pixelate');
  }

  const handlePixelation = (
    pixelMatrix: {
      r: number,
      g: number,
      b: number,
      a: number,
    }[][],
    colorPalette: {
      r: number,
      g: number,
      b: number,
    }[]) => {
    if (pixelateType === DOWN_DITHER_UP) {
      // 1. downscale -> dither -> upscale
      const downscalePixelMatrix = getDownscaleMatrix(pixelMatrix, pixelSize);
      const ditheredMatrix = orderDither(downscalePixelMatrix, 4, colorPalette);

      return getUpscalePixelMatrix(ditheredMatrix, pixelSize);
    } else if (pixelateType === DITHER_DOWN_UP) {
      // 2. dither -> downscale -> upscale
      const ditheredMatrix = orderDither(pixelMatrix, 4, colorPalette);
      const downscaledMatrix = getDownscaleMatrix(ditheredMatrix, pixelSize);

      return getUpscalePixelMatrix(downscaledMatrix, pixelSize);
    } else if (pixelateType === DOWN_UP) {
      const downscaledMatrix = getDownscaleMatrix(pixelMatrix, pixelSize);

      return getUpscalePixelMatrix(downscaledMatrix, pixelSize);
    } else if (pixelateType === DOWN_DIST_UP) {
      const downscaledMatrix = getDownscaleMatrix(pixelMatrix, pixelSize);
      const distanceMappingMatrix = getDistanceMappingPixels(downscaledMatrix, colorPalette);

      return getUpscalePixelMatrix(distanceMappingMatrix, pixelSize);
    } else {
      return pixelMatrix;
    }
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
            <div>Palette Count</div>
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
                    <label htmlFor={`size-${value}`}>{Math.pow(2, idx)}</label>
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
            <input type="range" value={pixelSize} min='1' max='24' list='pixel-size' onChange={updatePixelSize} />
            <datalist id='pixel-size'>
              {new Array(24).fill(null).map((val, idx) => {
                return (
                  <option key={idx} value={val} />
              )
              })}
            </datalist>
            <div>{pixelSize}</div>
          </div>
        </div>
        <div>
          <div>Pixelate options</div>
          <select onChange={handleSelectPixelateOption}>
            <option value={DOWN_DITHER_UP}>Downscale | Dither | Upscale</option>
            <option value={DITHER_DOWN_UP}>Dither | Downscale | Upscale</option>
            <option value={DOWN_UP}>Downscale | Upscale</option>
            <option value={DOWN_DIST_UP}>Downscale | Distance | Upscale</option>
          </select>
        </div>
      </div>
      <br />
      <button onClick={handlePixelateDownDitherUp}>Pixelate</button>
      <br />
      <br />
      <canvas
        id="pixelate-canvas"
        className={imageAdded ? "" : "hide"}
        ref={pixelateCanvasRef}
      ></canvas>
      {pixelateCanvasRef.current && imageAdded &&
        <DownloadCanvas
          canvas={pixelateCanvasRef.current as HTMLCanvasElement}
          imageName={`${imageName}_Pixelate_${pixelateType}_c${Math.pow(2, power)}_s${pixelSize}`}
        />
      }
    </div>
  )
}

export default Pixelate;