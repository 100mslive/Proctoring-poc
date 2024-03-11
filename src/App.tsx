import "./App.css";
import { HMSRoom } from "./HMSRoom";

function App() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gridTemplateRows: "repeat(2, 1fr)",
        placeItems: "center",
        height: "100%",
      }}
    >
      <HMSRoom roomCode="kqu-fxgs-qtb" userId="user1" />
      <HMSRoom roomCode="xqk-nljs-pnv" userId="user2" />
    </div>
  );
}

export default App;
