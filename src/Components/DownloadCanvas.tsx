import "../assets/stylings/_DownloadCanvas.css";

interface DownloadCanvasProps {
  canvas: HTMLCanvasElement;
  imageName?: string;
}

const DownloadCanvas = ({
  canvas,
  imageName,
}: DownloadCanvasProps) => {
  const fileName = imageName || "new_image";

  const handleDownload = () => {
    console.log('handle download');

    const link = document.createElement('a');
    link.download = `${fileName}` + ".png";
    link.href = canvas.toDataURL();
    link.click();
  }

  console.log(canvas);

  return (
    <div className="download-canvas-container">
      <button onClick={handleDownload}>Download Canvas</button>
    </div>
  )
}

export default DownloadCanvas;  