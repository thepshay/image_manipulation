import { useRef, useState } from 'react'
import '../assets/stylings/App.css'
import ActionPanel from './ActionPanel'
import ImageInputContainer from './ImageInputContainer'

function App() {

  const [imageAdded, setImageAdded] = useState(false);
  const canvasRef = useRef(null);
  const [resetKet, setResetKey] = useState(0);

  return (
    <>
      <ImageInputContainer 
        imageAdded={imageAdded}
        setImageAdded={setImageAdded}
        canvasRef={canvasRef}
        setResetKey={setResetKey}
      />
      <ActionPanel 
        imageAdded={imageAdded}
        canvasRef={canvasRef}
        key={resetKet}
      />
    </>
  )
}

export default App
