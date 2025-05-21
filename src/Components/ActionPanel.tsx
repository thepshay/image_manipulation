import { useState } from 'react';
import '../assets/stylings/ActionPanel.css'
import ColorDistribution from './ColorDistribution';
import FloodFill from './FloodFill';
import Quantization from './Quantization';
import QuantizedFloodFill from './QuantizedFloodFill';

interface ActionPanelProps {
  imageAdded: boolean,
  canvasRef: React.RefObject<null>,
}

const ActionPanel = ({
  imageAdded,
  canvasRef,
}: ActionPanelProps) => {
  const [currentTab, setCurrentTab] = useState<string>('floodfill');

  //TODO set type
  const [pixelsData, setPixelsData] = useState<number[][]>([])

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
          onClick={() => handleTabClick('quantizedfloodfill')}
          disabled={!imageAdded}
        >
          Quantized Flood Fill
        </button>
      </div>
      <div>
        <div className={`${currentTab === 'distribution' ? '' : 'hide'}`}>
          <ColorDistribution
            canvasRef={canvasRef}
            imageAdded={imageAdded}
            pixelsData={pixelsData}
            setPixelsData={setPixelsData}
          />
        </div>
        <div className={`${currentTab === 'floodfill' ? '' : 'hide'}`}>
          <FloodFill
            canvasRef={canvasRef}
            imageAdded={imageAdded}
          />
        </div>
        <div className={`${currentTab === 'quantization' ? '' : 'hide'}`}>
          <Quantization 
            canvasRef={canvasRef}
            imageAdded={imageAdded}
          />
        </div>
        <div className={`${currentTab === 'quantizedfloodfill' ? '' : 'hide'}`}>
          <QuantizedFloodFill />
        </div>
      </div>
    </div>
  )
}

export default ActionPanel;

