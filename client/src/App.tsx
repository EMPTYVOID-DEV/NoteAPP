import { useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";

function App() {
  const [img, setimg] = useState<any>(null);
  const send = async (e: any) => {
    e.preventDefault();
    // const fd = new FormData();
    // // fd.append("email", "aymen@gmail,com");
    // // fd.append("password", "password");
    fetch("/api/user ", {
      method: "POST",
      body: JSON.stringify({ email: "aymen@gmail.com", password: "password" }),
      headers: {
        Accept: "application/json",
        "content-type": "application/json",
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => console.log(data))
      .catch((err) => {
        console.log(`${err} unable to register`);
      });
  };
  return (
    <div className="App">
      <button onClick={send}>send</button>
    </div>
  );
}

export default App;
