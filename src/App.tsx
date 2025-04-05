import { ConfigProvider } from "antd"
import CreateOrder from "./components/CreateOrder"

function App() {

  return (
   <ConfigProvider>
    <CreateOrder/>
   </ConfigProvider>
  )
}

export default App
