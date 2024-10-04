import { useState } from "react";
import reactLogo from "./assets/react.svg";
import balatroKing from "./assets/cards/two-of-diamonds.png";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";

function App() {
    const [greetMsg, setGreetMsg] = useState("");
    const [name, setName] = useState("");

    async function greet() {
        // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
        setGreetMsg(await invoke("greet", { name }));
    }

    const cards = [];
    for (let i = 0; i < 4; i++) {
        cards.push(
            <img
                src={balatroKing}
                style={{
                    width: "100%",
                    objectFit: "contain",
                    imageRendering: "-moz-crisp-edges",
                }}
            ></img>
        );
    }

    return (
        <div
            style={{
                borderColor: "gray",
                borderWidth: "2px",
                borderStyle: "solid",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                }}
            >
                {cards}
            </div>
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                }}
            >
                {cards}
            </div>
        </div>
    );

    // return (
    //   <div className="container">
    //     <h1>Welcome to Tauri!</h1>

    //     <div className="row">
    //       <a href="https://vitejs.dev" target="_blank">
    //         <img src={balatroKing} className="logo vite" alt="Vite logo" />
    //       </a>
    //       <a href="https://tauri.app" target="_blank">
    //         <img src="/tauri.svg" className="logo tauri" alt="Tauri logo" />
    //       </a>
    //       <a href="https://reactjs.org" target="_blank">
    //         <img src={reactLogo} className="logo react" alt="React logo" />
    //       </a>
    //     </div>

    //     <p>Click on the Tauri, Vite, and React logos to learn more.</p>

    //     <form
    //       className="row"
    //       onSubmit={(e) => {
    //         e.preventDefault();
    //         greet();
    //       }}
    //     >
    //       <input
    //         id="greet-input"
    //         onChange={(e) => setName(e.currentTarget.value)}
    //         placeholder="Enter a name..."
    //       />
    //       <button type="submit">Greet</button>
    //     </form>

    //     <p>{greetMsg}</p>
    //   </div>
    // );
}

export default App;
