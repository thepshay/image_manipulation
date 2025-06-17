import React from "react";
import { useEffect, useState } from "react";

interface ColorDistributionProps {
  canvasRef: React.RefObject<null>,
  imageAdded: boolean;
  setPixelsData: (a: { r: number, g: number, b: number, a: number }[]) => void;
}

const ColorDistribution = ({
  canvasRef,
  imageAdded,
  setPixelsData,
}: ColorDistributionProps) => {

  const [colorDistribution, setColorDistribution] = useState<{ [key: string]: number }>({})
  const [totalPixels, setTotalPixels] = useState<number>(0);

  useEffect(() => {
    if (!canvasRef.current) {
      console.log('no canvas found on distribution');
      return;
    }

    const canvas = canvasRef.current as HTMLCanvasElement;
    setTotalPixels(canvas.width * canvas.height)

    calculateDistribution(canvas)
  }, [imageAdded]);

  const calculateDistribution = (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height) as ImageData;
    const colorData = imageData.data;

    const colorCounter: { [key: string]: number } = {};
    const colorList = [];

    for (let i = 0; i < colorData.length; i += 4) {
      const r = colorData[i];
      const g = colorData[i + 1];
      const b = colorData[i + 2];
      const a = colorData[i + 3];

      const rgba = `rgba(${r}, ${g}, ${b}, ${a})`;

      const color = { r, g, b, a };
      colorList.push(color);

      if (!colorCounter[rgba]) colorCounter[rgba] = 0;
      colorCounter[rgba] += 1;
    };

    setPixelsData(colorList);
    setColorDistribution(colorCounter);
  }

  const sortKeys = (dict: { [key: string]: number }, type: "desc" | "asc" = "desc"): string[] => {
    console.log('sortKeys()')

    const entries = Object.entries(dict);

    if (type === "desc") {
      entries.sort((a, b) => b[1] - a[1]);
    } else {
      entries.sort((a, b) => a[1] - b[1]);
    }

    {/* TODO: batch pagination */ }
    const sortedKeys = entries.slice(0, 1000).map(entry => entry[0]);

    console.log('finish key sort')

    return sortedKeys;
  }

  const getPercentage = (pixelCount: number) => {
    console.log('getPercentage()')

    const pixelRatio = pixelCount / totalPixels;
    return Math.round(pixelRatio * 10000) / 100;
  }

  if (!imageAdded) return null;

  return (
    <div>
      <table id="color-table">
        <thead>
          <tr>
            <th id="color-name">RGB</th>
            <th id="color-box>">Color</th>
            <th id="count-header">Count</th>
            <th id="percentage">Percentage</th>
          </tr>

          {/* TODO: batch display */}
          {sortKeys(colorDistribution).map((color, idx) => {
            const count = colorDistribution[color];
            return (
              <tr key={idx}>
                <td>{color}</td>
                <td
                  style={{
                    backgroundColor: color
                  }}
                ></td>
                <td>{count}</td>
                <td>{getPercentage(count)}%</td>
              </tr>
            )
          })}

        </thead>
      </table>
    </div>
  )
}

export default React.memo(ColorDistribution);