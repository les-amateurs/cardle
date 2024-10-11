import "./App.css";
import { Var, wrap, SOUND_EFFECTS } from "./common.tsx";
import { useState } from "react";
import Cardle from "./Cardle.tsx";

function App() {
    const scene: Var<number> = wrap(useState(0));
    switch (scene.get) {
        case 0: {
            const titleChars = ["C", "A", "R", "D", "L", "E"];
            const title = [];
            for (let i = 0; i < titleChars.length; i++) {
                const scale = 100 + Math.floor(Math.random() * 20);
                const jitter = Math.floor(Math.random() * 20) - 10;
                const char = (
                    <div
                        style={{
                            fontFamily: "balatro",
                            fontSize: "35vh",
                            transform: `scale(${scale}%) rotate(${jitter}deg)`,
                        }}
                        className="title"
                    >
                        <span>{titleChars[i]}</span>
                    </div>
                );
                title.push(char);
            }

            const startChars = ["s", "t", "a", "r", "t"];
            const start = [];
            for (let i = 0; i < startChars.length; i++) {
                const char = (
                    <div
                        style={{
                            fontFamily: "balatro",
                            fontSize: "20vh",
                        }}
                    >
                        <span>{startChars[i]}</span>
                    </div>
                );
                start.push(char);
            }

            return (
                <div
                    style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "20vh",
                        flexShrink: "0",
                    }}
                >
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: `repeat(${titleChars.length}, 1fr)`,
                            gap: "1vw",
                        }}
                    >
                        {title}
                    </div>
                    <div>
                        <button
                            style={{
                                fontFamily: "balatro",
                                border: "none",
                                backgroundColor: "transparent",
                            }}
                            className="button"
                            onClick={() => {
                                SOUND_EFFECTS.cardFan();
                                scene.set(1);
                            }}
                        >
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: `repeat(${startChars.length}, 1fr)`,
                                }}
                            >
                                {start}
                            </div>
                        </button>
                    </div>
                </div>
            );
        }
        case 1:
            return <Cardle restart={() => scene.set(0)}></Cardle>;
    }
}

export default App;
