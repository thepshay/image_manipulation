import { useEffect, useState } from "react";

interface ColorDistributionProps {
  canvasRef: React.RefObject<null>,
  imageAdded: boolean;
}

const ColorDistribution = ({
  canvasRef,
  imageAdded,
}: ColorDistributionProps) => {

  if (!imageAdded) return null;

  const [colorDistribution, setColorDistribution] = useState<{ [key: string]: number }>({})

  useEffect(() => {
    if (!canvasRef.current) {
      console.log('no canvas found on distribution');
      return;
    }

    console.log('distribution useEffect')

    const canvas = canvasRef.current as HTMLCanvasElement;
    calculateDistribution(canvas)
  }, [imageAdded]);

  const calculateDistribution = (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

    const imageData = ctx.getImageData(0, 0, canvas.height, canvas.width) as ImageData;
    const colorData = imageData.data as Uint8ClampedArray<ArrayBufferLike>;

    const colorCounter: { [key: string]: number } = {};

    for (let i = 0; i < colorData.length; i += 4) {
      const r = colorData[i];
      const g = colorData[i + 1];
      const b = colorData[i + 2];
      const a = colorData[i + 3];

      const rgba = `rgba(${r}, ${g}, ${b}, ${a})`

      if (!colorCounter[rgba]) colorCounter[rgba] = 0;
      colorCounter[rgba] += 1;
    };

    setColorDistribution(colorCounter);

    console.log(Object.keys(colorCounter).length);
  }

  const sortKeys = (dict : {[key: string]: number}, type: "desc" | "asc" = "desc") : string[] => {
    const entries = Object.entries(dict);

    if (type === "desc") {
      entries.sort((a, b) => b[1] - a[1]);
    } else {
      entries.sort((a, b) => a[1] - b[1]);
    }

    const sortedKeys = entries.map(entry => entry[0]);
    return sortedKeys;
  }

  const getPercentage = (pixelCount: number) => {
    if (!canvasRef.current) {
      console.log('no canvas found on distribution');
      return;
    }

    const {width, height} = canvasRef.current as HTMLCanvasElement;

    const pixelRatio = pixelCount / (width * height);

    return Math.round(pixelRatio * 10000) / 100
  }

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

          {sortKeys(colorDistribution).map((color) => {
            const count = colorDistribution[color];

            return (
              <tr>
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

export default ColorDistribution;