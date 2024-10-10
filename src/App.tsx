import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Game, Card, State, IDS, mod, Var, wrap, Vec2 } from "./common.tsx";
import "./App.css";
import Board from "./Board.tsx";
import Selection from "./Selection.tsx";

function updateSelections(
    game: Game,
    position: Vec2,
    validSelections: Var<number[]>
) {
    const valid = [];
    for (let i = 0; i < IDS.length; i++) {
        const isInvalid =
            game.greens.indexOf(i) != -1 ||
            game.grays.indexOf(i) != -1 ||
            (game.yellows.has(i) &&
                game.yellows.get(i)?.indexOf(position.y) != -1);
        if (!isInvalid) {
            valid.push(i);
        }
    }
    validSelections.set(valid);
}

function updateGame(currentGuess: number, setGame: any) {
    setGame((game: Game) => {
        const newGreens = [...game.greens];
        const newYellows = new Map(game.yellows);
        const newGrays = [...game.grays];
        const guess = game.board[currentGuess];
        for (let i = 0; i < 4; i++) {
            const n = guess[i].n;
            if (n == game.answer[i]) {
                newGreens.push(n);
            } else if (game.answer.indexOf(n) != -1) {
                newYellows.get(n)?.push(i);
            } else {
                newGrays.push(n);
            }
        }
        return {
            ...game,
            greens: newGreens,
            yellows: newYellows,
            grays: newGrays,
        };
    });
}

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
    const position: Var<{ x: number; y: number }> = wrap(
        useState({ x: 0, y: 0 })
    );
    const currentSelection: Var<number> = wrap(useState(0));
    const validSelections: Var<number[]> = wrap(useState([]));

    function updatePosition(key: string) {
        let pos = {...position.get};
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

    const events = new Map(
        Object.entries({
            ArrowDown: updatePosition,
            ArrowUp: updatePosition,
            ArrowLeft: updateSelection,
            ArrowRight: updateSelection,
        })
    );
    const handleKeyPress = (event: KeyboardEvent) => {
        event.preventDefault();
        const callback = events.get(event.key);
        if (callback) {
            callback(event.key);
        }
    };

    useEffect(() => {updateSelection(null)}, [validSelections.get]);

    useEffect(() => {
        window.addEventListener("keydown", handleKeyPress);
        return () => window.removeEventListener("keydown", handleKeyPress);
    }, [handleKeyPress]);

    useEffect(() => {
        updateSelections(game.get, position.get, validSelections);
    }, [currentSelection.get]);

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
            <Board guess={guess.get} game={game.get} position={position.get}></Board>
            <Selection
                validSelections={validSelections.get}
                currentSelectionIndex={currentSelection.get}
            ></Selection>
        </div>
    );
}

export default App;
