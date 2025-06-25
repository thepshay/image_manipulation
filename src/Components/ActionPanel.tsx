import { useState } from 'react';
import '../assets/stylings/ActionPanel.css'
import ColorDistribution from './ColorDistribution';
import FloodFill from './FloodFill';
import Quantization from './Quantization';
import Pixelate from './Pixelate';

interface ActionPanelProps {
  imageAdded: boolean,
  canvasRef: React.RefObject<null>,
  imageName: string,
}

const ActionPanel = ({
  imageAdded,
  canvasRef,
  imageName,
}: ActionPanelProps) => {
  const [currentTab, setCurrentTab] = useState<string>('pixelate');
  const [pixelsData, setPixelsData] = useState<{ r: number, g: number, b: number, a: number }[]>([])

  const handleTabClick = (tabPage: string) => {
    setCurrentTab(tabPage)
  }

  return (
    <div className="action-panel-container">
      <div className={`button-container ${imageAdded ? '' : 'disabled-tabs'}`}>
        <button
          onClick={() => handleTabClick('distribution')}
          disabled={!imageAdded}
        >
          Distribution
        </button>
        <button
          onClick={() => handleTabClick('floodfill')}
          disabled={!imageAdded}
        >
          Flood Fill
        </button>
        <button
          onClick={() => handleTabClick('quantization')}
          disabled={!imageAdded}
        >
          Quantization
        </button>
        <button
          onClick={() => handleTabClick('pixelate')}
          disabled={!imageAdded}
        >
          Pixelate
        </button>
      </div>
      <div>
        <div className={`${currentTab === 'distribution' ? '' : 'hide'}`}>
          <ColorDistribution
            canvasRef={canvasRef}
            imageAdded={imageAdded}
            setPixelsData={setPixelsData}
          />
        </div>
        <div className={`${currentTab === 'floodfill' ? '' : 'hide'}`}>
          <FloodFill
            canvasRef={canvasRef}
            imageAdded={imageAdded}
            imageName={imageName}
          />
        </div>
        <div className={`${currentTab === 'quantization' ? '' : 'hide'}`}>
          <Quantization
            canvasRef={canvasRef}
            imageAdded={imageAdded}
            pixelsData={pixelsData}
            imageName={imageName}
          />
        </div>
        <div className={`${currentTab === 'pixelate' ? '' : 'hide'}`}>
          <Pixelate
            canvasRef={canvasRef}
            imageAdded={imageAdded}
            pixelsData={pixelsData}
            imageName={imageName}
          />
        </div>
      </div>
    </div>
  )
}

export default ActionPanel;

