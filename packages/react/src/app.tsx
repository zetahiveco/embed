import { Dashboard } from "./lib/dashboard";
import { css } from "@emotion/css";

function App() {

  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyZXNvdXJjZUlkIjoiZDMyNTdiMmYtNWJjZC00MDZkLWEyYmYtNTQyYTMyYjQ4MWFjIiwidmFyaWFibGVzIjpbeyJuYW1lIjoib3JnYW5pemF0aW9uX2lkIiwidmFsdWUiOiI2ZDBkMWIyNC0wYmI0LTQyMzctOGJjMS1kNmM0ZDI3MmU3NjcifV0sImlhdCI6MTcwOTUzMDg3NCwiZXhwIjoxNzExMjQwNzA1ODI4fQ.MhIbHjkBmSqiSWOu57DvIoI3iRLtJIankJ8yTek9Kd0"

  return (
    <div className={css`
      height: 100vh;
      width: 100vw;
      display: flex;
      flex-wrap: wrap;
    `}>
      <Dashboard id="96478b9b-dac3-4c42-ab0b-c7549345dd05" server="http://localhost:8080" token={token} />
    </div>
  )
}

export default App
