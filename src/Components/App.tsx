import { useRef, useState } from 'react'
import '../assets/stylings/App.css'
import ActionPanel from './ActionPanel'
import ImageInputContainer from './ImageInputContainer'

function App() {

  const [imageAdded, setImageAdded] = useState(false);
  const canvasRef = useRef(null);

  return (
    <>
      <ImageInputContainer 
        imageAdded={imageAdded}
        setImageAdded={setImageAdded}
        canvasRef={canvasRef}
      />
      <ActionPanel 
        imageAdded={imageAdded}
        canvasRef={canvasRef}
      />
    </>
  )
}

export default App
