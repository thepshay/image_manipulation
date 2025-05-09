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
} : ActionPanelProps) => {
  const [currentTab, setCurrentTab] = useState<string>('distribution');

  const handleTabClick = (tabPage: string) => {
    setCurrentTab(tabPage)
  }

  const displaySelectedPage = () => {

    if (!imageAdded) {
      return null;
    }

    if (currentTab === 'distribution') {
      return (
        <ColorDistribution 
          canvasRef={canvasRef}
          imageAdded={imageAdded}
        />
      )
    } else if (currentTab === 'floodfill') {
      return <FloodFill />
    } else if (currentTab === 'quantization') {
      return <Quantization />
    } else if (currentTab === 'quantizedfloodfill') {
      return <QuantizedFloodFill />
    } else {
      return null;
    }
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
        {displaySelectedPage()}
      </div>
    </div>
  )
}

export default ActionPanel;

