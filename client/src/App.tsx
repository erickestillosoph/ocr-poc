import { ChakraProvider } from '@chakra-ui/react'
import './App.css'
import { FileUploadContainer } from './components/upload-file/file-upload-container'

function App() {

  return (
    <>
      <ChakraProvider>
        <FileUploadContainer />
      </ChakraProvider>
    </>
  )
}

export default App
