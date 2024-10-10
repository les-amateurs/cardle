import { useState, useEffect } from "react";
import { Game, Card, State, IDS, mod, Var, wrap, Vec2 } from "./common.tsx";
import "./App.css";
import Board from "./Board.tsx";
import Selection from "./Selection.tsx";

function randomAnswer() {
    const answer = [];
    while (answer.length < 4) {
        const n = Math.floor(Math.random() * 13);
        if (answer.indexOf(n) == -1) {
            answer.push(n);
        }
    }
    return answer;
}

function App() {
    const game: Var<Game> = wrap(
        useState({
            board: Array(10)
                .fill(0)
                .map((u) =>
                    Array(4).fill({
                        state: State.Empty,
                        n: 0,
                        color: undefined,
                    })
                ),
            answer: randomAnswer(),
            greens: [],
            yellows: new Map(
                Array(13)
                    .fill(0)
                    .map((_, i) => [i, []])
            ),
            grays: [],
        })
    );
    const guess: Var<number[]> = wrap(useState([]));
    const position: Var<Vec2> = wrap(
        useState({ x: 0, y: 0 })
    );
    const currentSelection: Var<number> = wrap(useState(0));
    const validSelections: Var<number[]> = wrap(useState([]));

    function updatePosition(key: string) {
        let pos = { ...position.get };
        switch (key) {
            case "ArrowDown":
                pos.y += 1;
                break;
            case "ArrowUp":
                pos.y -= 1;
                break;
        }
        pos.y = mod(pos.y, 4);
        console.log(pos);
        position.set(pos);
    }

    function updateSelection(key: string | null) {
        let sel = currentSelection.get;
        console.log(sel, validSelections.get.length);
        if (key) {
            switch (key) {
                case "ArrowLeft":
                    sel -= 1;
                    break;
                case "ArrowRight":
                    sel += 1;
                    break;
            }
        }
        currentSelection.set(mod(sel, validSelections.get.length));
    }

    function updateSelections() {
        const valid = [];
        for (let i = 0; i < IDS.length; i++) {
            const isInvalid =
                game.get.greens.indexOf(i) != -1 ||
                game.get.grays.indexOf(i) != -1 ||
                (game.get.yellows.has(i) &&
                    game.get.yellows.get(i)?.indexOf(position.get.y) != -1);
            if (!isInvalid) {
                valid.push(i);
            }
        }
        validSelections.set(valid);
    }

    function select() {
        const lastGuess = guess.get;
        const yPos = position.get.y;
        
        const newGuess = [...lastGuess];
        newGuess[yPos] = currentSelection.get;

        guess.set(newGuess);
    }

    const events = new Map(
        Object.entries({
            ArrowDown: updatePosition,
            ArrowUp: updatePosition,
            ArrowLeft: updateSelection,
            ArrowRight: updateSelection,
            Enter: select,
        })
    );
    const handleKeyPress = (event: KeyboardEvent) => {
        const callback = events.get(event.key);
        if (callback) {
            event.preventDefault(); // i want to reload the page :skull:
            callback(event.key);
        }
    };

    useEffect(() => {
        updateSelection(null);
    }, [validSelections.get]);

    useEffect(() => {
        window.addEventListener("keydown", handleKeyPress);
        return () => window.removeEventListener("keydown", handleKeyPress);
    }, [handleKeyPress]);

    useEffect(() => {
        updateSelections();
    }, []);

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                height: "100vh",
                width: "100%",
                margin: "auto",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Board
                guess={guess.get}
                game={game.get}
                position={position.get}
            ></Board>
            <Selection
                validSelections={validSelections.get}
                currentSelectionIndex={currentSelection.get}
            ></Selection>
        </div>
    );
}

export default App;
