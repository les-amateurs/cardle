import { useState, useEffect } from "react";
import { Game, Card, State, IDS, mod, Var, wrap, Vec2 } from "./common.tsx";
import "./App.css";
import Board from "./Board.tsx";
import Selection from "./Selection.tsx";

const SHORTCODES = new Map(Object.entries({ "2": 0, "3": 1, "4": 2, "5": 3, "6": 4, "7": 5, "8": 6, "9": 7, "10": 8, "j": 9, "q": 10, "k": 11, "a": 12 }));

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
        position.set(pos);
    }

    function updateSelection(key: string | null) {
        let sel = currentSelection.get;
        if (key) {
            switch (key) {
                case "ArrowLeft":
                    sel -= 1;
                    break;
                case "ArrowRight":
                    sel += 1;
                    break;
                default:
                    const card = SHORTCODES.get(key);
                    if (card !== undefined) {
                        const idx = validSelections.get.indexOf(card);
                        if (idx != -1) {
                            sel = idx;
                        }
                    }
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
            2: updateSelection,
            3: updateSelection,
            4: updateSelection,
            5: updateSelection,
            6: updateSelection,
            7: updateSelection,
            8: updateSelection,
            9: updateSelection,
            10: updateSelection,
            j: updateSelection,
            q: updateSelection,
            k: updateSelection,
            a: updateSelection,
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
