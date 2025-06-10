import React from 'react';
import '../assets/stylings/ImageInputContainer.css'

interface ImageInputContainerProps {
  imageAdded: boolean;
  setImageAdded: (a: boolean) => void;
  canvasRef: React.RefObject<null>;
  setResetKey: (a: number | { (arg1: number): number }) => void;
}

const ImageInputContainer = ({
  imageAdded,
  setImageAdded,
  canvasRef,
  setResetKey,
}: ImageInputContainerProps) => {
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      console.log('no file selected');
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (e: Event) => {
      const imageBase64 = (e.target as FileReader)?.result;

      loadImageOnCanvas(imageBase64 as string);
    }
  }

  const loadImageOnCanvas = (imageBase64: string) => {
    if (!canvasRef.current) {
      console.log('no canvas found');
      return;
    }

    const canvas = canvasRef.current as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    const image = new Image();
    image.src = imageBase64;

    image.onload = () => {
      const width = image.width;
      const height = image.height;
      canvas.width = width;
      canvas.height = height;
      (ctx as CanvasRenderingContext2D).drawImage(image, 0, 0, width, height);

      setImageAdded(true);
    }
  }

  const handleResetImage = () => {
    setResetKey((prev: number) => prev + 1);
    setImageAdded(false);

    if (!canvasRef.current) {
      console.log('Reset canvas: no canvas found')
      return;
    }

    const canvas = canvasRef.current as HTMLCanvasElement;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  return (
    <div className='image-input-container'>
      <input
        className='file-input'
        type='file'
        accept='image/png, image/jpeg'
        onChange={handleFileInput}
      />
      <button onClick={handleResetImage}>Reset Image</button>
      <br></br>
      <canvas
        id='image-canvas'
        className={imageAdded ? "" : "hide"}
        ref={canvasRef}
      ></canvas>
      {(canvasRef.current && imageAdded) &&
        <div>
          {(canvasRef.current as HTMLCanvasElement).width} x {(canvasRef.current as HTMLCanvasElement).height}
        </div>}
    </div>
  )
}

export default ImageInputContainer;