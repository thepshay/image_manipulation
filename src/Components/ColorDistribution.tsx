import { useEffect } from "react";

interface ColorDistributionProps {
  canvasRef: React.RefObject<null>,
}

const ColorDistribution = ({
  canvasRef
} : ColorDistributionProps) => {

  useEffect(() => {
    if (!canvasRef.current) {
      console.log('no canvas found on distribution');
      return;
    }

    const canvas = canvasRef.current as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
  }, [])

  return (
    <div>
      Color Distrubtion
    </div>
  )
}

export default ColorDistribution;