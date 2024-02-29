import { Visualization } from "./lib/visualization"
import { css } from "@emotion/css";

function App() {

  const token = ""

  return (

    <div className={css`
      height: 100vh;
      width: 100vw;
      display: flex;
      flex-wrap: wrap;
    `}>
      <div className={css`
        height: 50%;
        width: 50;
      `}>
        <Visualization
          server="http://localhost:8080"
          id="15618019-e886-408d-b2d5-da267a9d7daf"
          token={token}
        />
      </div>
    </div>
  )
}

export default App
