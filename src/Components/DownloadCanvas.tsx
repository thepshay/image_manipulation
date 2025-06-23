import "../assets/stylings/_DownloadCanvas.css";

interface DownloadCanvasProps {
  canvas: HTMLCanvasElement;
}

const DownloadCanvas = ({
  canvas,
}: DownloadCanvasProps) => {

  const handleDownload = () => {
    console.log('handle download');

    const link = document.createElement('a');
    link.download = "new-image.png";
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