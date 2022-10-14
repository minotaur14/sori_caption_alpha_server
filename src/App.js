import "./App.css";
// import axios from "axios";

function App() {
  return (
    <div className="App">
      <ShowChannel></ShowChannel>
    </div>
  );
}
function ShowChannel() {
  return (
    <div>
      <div>테스트 페이지</div>
      <button onClick={test}>버전 확인</button>
    </div>
  );

  function test() {
    window.api.receive("app_version", (arg) => {
      alert(`현재 버전: v ${arg.version}`);
    });
    // window.api.send("toMain", "here is renderer");
    // window.ipcRenderer.send("test", "test 입니다.");
  }
}

export default App;
