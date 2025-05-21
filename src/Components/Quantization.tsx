
// Point Filtering <- probably what we want
//   - Trilinear Filtering
//   - Anisotrophic Filtering
// Bilinear filtering <- blurring

import type React from "react";
import { useEffect, useRef, useState } from "react";
import { copyCanvas } from '../utils/utils.ts'

// Dithering -> reduce color pallete
//   - Ordered Dithering -> https://en.wikipedia.org/wiki/Ordered_dithering

// QUANTIZATIOn
// upload image to new canvas, -> similiar to floodflood
// saves pixels to state? => or fetch from distribution -> easier, less compute, 
//   -> prop drilling :(, potentially issues with state management? 
// a "disabled" slider for base 2
// calculate button

interface QuantizationProps {
  canvasRef: React.RefObject<null>;
  imageAdded: boolean;
  pixelsData: number[][]
}

const Quantization = ({
  canvasRef,
  imageAdded,
  pixelsData,
}: QuantizationProps) => {

  const quantizationCanvasRef = useRef(null);
  const [power, setPower] = useState(1);


  const handleUpdatePower = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPower = Number(e.target.value);
    setPower(newPower);
  }

  useEffect(() => {
    if (pixelsData.length) {
      console.log(pixelsData)
    } 
  }, [pixelsData.length]);

  useEffect(() => {
    if (!canvasRef.current) {
      console.log('Flood: no canvas found');
      return;
    }

    if (!imageAdded) {
      return;
    }

    const canvas = canvasRef.current as HTMLCanvasElement;
    copyCanvas(canvas, quantizationCanvasRef);
  }, [imageAdded]);

  return (
    <div>
      <br />
      Quantization
      <br />
      <br />
      <button>Quantize!</button>
      <br />
      <br />
      <div>
        <input type="range"
          value={power}
          min="1"
          max="8"
          list="power"
          onChange={handleUpdatePower}
        />
        <datalist id='power'>
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
      <br />
      <canvas
        id="quantization-canvas"
        className={imageAdded ? "" : "hide"}
        ref={quantizationCanvasRef}
      ></canvas>
    </div>
  )
}

export default Quantization;