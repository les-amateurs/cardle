import { useState, useEffect } from "react";
import { Game, State, IDS, mod, Var, wrap, Vec2 } from "./common.tsx";
import "./App.css";
import Board from "./Board.tsx";
import Selection from "./Selection.tsx";

const MUSIC_TRACKS = [
    "music1.ogg",
    "music2.ogg",
    "music3.ogg",
    "music4.ogg",
    "music5.ogg",
].map((file) => `./src/assets/sounds/${file}`);

const SHORTCODES = new Map(
    Object.entries({
        Digit2: 0,
        Digit3: 1,
        Digit4: 2,
        Digit5: 3,
        Digit6: 4,
        Digit7: 5,
        Digit8: 6,
        Digit9: 7,
        Digit1: 8,
        KeyJ: 9,
        KeyQ: 10,
        KeyK: 11,
        KeyA: 12,
    })
);

const SOUND_EFFECTS = Object.fromEntries(
    Object.entries({
        cardSelect: "cardSlide2",
        win: "win",
    }).map(([name, file]) => [
        name,
        () => new Audio(`./src/assets/sounds/effects/${file}.ogg`).play(),
    ])
);

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

function randomSong() {
    return MUSIC_TRACKS[Math.floor(Math.random() * MUSIC_TRACKS.length)];
}

function App() {
    const game: Var<Game> = wrap(
        useState({
            board: Array(10)
                .fill(0)
                .map((_) =>
                    Array(4).fill({
                        state: State.Empty,
                        n: 0,
                        color: undefined,
                    })
                ),
            answer: [0, 11, 10, 12], // randomAnswer(),
            greens: new Map<number, number>(),
            yellows: new Map(),
            grays: [],
            win: false,
        })
    );
    const guess: Var<(number | undefined)[]> = wrap(
        useState(Array(4).fill(undefined))
    );
    const position: Var<Vec2> = wrap(useState({ x: 0, y: 0 }));
    const currentSelection: Var<number> = wrap(useState(0));
    const validSelections: Var<number[]> = wrap(useState([]));
    const validRows: Var<number[]> = wrap(useState([0, 1, 2, 3]));
    const currentSong: Var<string> = wrap(useState(randomSong()));

    function updatePosition(key: string) {
        let pos = { ...position.get };
        console.log(game.get);
        switch (key) {
            case "ArrowDown":
                for (let i = 0; i < 4; i++) {
                    pos.y = mod(pos.y + 1, 4);
                    if (validRows.get[pos.y]) break;
                }
                break;
            case "ArrowUp":
                for (let i = 0; i < 4; i++) {
                    pos.y = mod(pos.y - 1, 4);
                    if (validRows.get[pos.y]) break;
                }
                break;
        }
        position.set({ ...position.get, y: pos.y });
    }

    function setCurrentSelection(sel: number) {
        if (sel != currentSelection.get) {
            SOUND_EFFECTS.cardSelect();
        }
        currentSelection.set(mod(sel, validSelections.get.length));
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
                    console.log(card);
                    if (card !== undefined) {
                        const idx = validSelections.get.indexOf(card);
                        if (idx != -1) {
                            sel = idx;
                        }
                    }
                    break;
            }
        }
        setCurrentSelection(sel);
    }

    function updateSelections() {
        let valid = [];

        for (let i = 0; i < IDS.length; i++) {
            const isInvalid =
                game.get.greens.has(i) ||
                game.get.grays.indexOf(i) != -1 ||
                guess.get.indexOf(i) != -1;
            if (!isInvalid) {
                valid.push(i);
            }
        }

        validSelections.set(valid);
    }

    function updateValidRows() {
        const values = Array.from(game.get.greens.values());
        const rows = [0, 1, 2, 3].map((n) => values.indexOf(n) == -1);
        validRows.set(rows);
    }

    function newRowPosition(newGuess: (number | undefined)[]) {
        const pos = { ...position.get };
        const closest = [];
        for (let i = 0; i < 4; i++) {
            if (newGuess[i] === undefined) {
                closest.push(i);
            }
        }
        closest.sort(
            (a, b) =>
                Math.abs(a - position.get.y) - Math.abs(b - position.get.y)
        );
        if (closest.length != 0) {
            pos.y = closest[0];
        }
        return pos;
    }

    function select() {
        const lastGuess = guess.get;
        const yPos = position.get.y;

        const newGuess = [...lastGuess];
        newGuess[yPos] = validSelections.get[currentSelection.get];

        position.set(newRowPosition(newGuess));
        guess.set(newGuess);
    }

    function deselect() {
        const yPos = position.get.y;
        const newGuess = [...guess.get];
        newGuess[yPos] = undefined;
        guess.set(newGuess);
    }

    function submit() {
        const oldGuess = structuredClone(guess.get);
        if (oldGuess.indexOf(undefined) == -1) {
            let valid = true;
            for (let i = 0; i < 4; i++) {
                const g = oldGuess[i];
                if (g !== undefined) {
                    const y = game.get.yellows.get(g);
                    if (y !== undefined && y.indexOf(i) != -1) {
                        valid = false;
                    }
                }
            }
            for (const y of Array.from(game.get.yellows.keys())) {
                if (oldGuess.indexOf(y) == -1) {
                    valid = false;
                }
            }

            if (valid) {
                const newBoard = structuredClone(game.get.board);
                const newGreens = new Map(game.get.greens);
                const newGrays = structuredClone(game.get.grays);
                const newYellows = new Map(game.get.yellows);
                const newGuess = Array(4).fill(undefined);

                const xPos = position.get.x;
                for (let i = 0; i < 4; i++) {
                    const card = { ...newBoard[xPos][i] };
                    const g = oldGuess[i];
                    if (g === undefined) {
                        card.state = State.Empty;
                    } else {
                        card.n = g;
                        card.state = State.Visible;
                        if (g == game.get.answer[i]) {
                            newYellows.delete(g);
                            newGreens.set(g, i);
                            newGuess[i] = g;
                            card.color = "green";
                        } else if (game.get.answer.indexOf(g) != -1) {
                            if (!newYellows.has(g)) {
                                newYellows.set(g, []);
                            }
                            newYellows.get(g)?.push(i);
                            card.color = "yellow";
                        } else {
                            newGrays.push(g);
                            // card.color = "gray";
                        }
                    }
                    newBoard[xPos][i] = card;
                }

                const final = JSON.stringify(Array.from(newGreens.keys()).toSorted());
                const answer = JSON.stringify(game.get.answer.toSorted());
                const win = final === answer;
                if (win) {
                    SOUND_EFFECTS.win();
                } else {
                    const pos = newRowPosition(newGuess);
                    pos.x += 1;
                    position.set(pos);
                }
                game.set({
                    ...game.get,
                    board: newBoard,
                    greens: newGreens,
                    yellows: newYellows,
                    grays: newGrays,
                    win,
                });
                guess.set(newGuess);
            }
        }
    }

    const events = new Map(
        Object.entries({
            ArrowDown: updatePosition,
            ArrowUp: updatePosition,
            ArrowLeft: updateSelection,
            ArrowRight: updateSelection,
            Space: select,
            Backspace: deselect,
            Enter: submit,
            Digit2: updateSelection,
            Digit3: updateSelection,
            Digit4: updateSelection,
            Digit5: updateSelection,
            Digit6: updateSelection,
            Digit7: updateSelection,
            Digit8: updateSelection,
            Digit9: updateSelection,
            Digit1: updateSelection,
            KeyJ: updateSelection,
            KeyQ: updateSelection,
            KeyK: updateSelection,
            KeyA: updateSelection,
        })
    );
    const handleKeyPress = (event: KeyboardEvent) => {
        // console.log(game.get);
        const callback = events.get(event.code);
        // console.log(event);
        if (callback) {
            event.preventDefault(); // i want to reload the page :skull: (L)
            callback(event.code);
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
    }, [guess.get, currentSelection.get, position.get]);

    useEffect(() => {
        updateValidRows();
    }, [game.get]);

    useEffect(() => {
        const music = new Audio(currentSong.get);
        music.addEventListener("ended", (_: Event) => {
            currentSong.set(randomSong());
        });
        music.play();
        return () => {
            music.pause();
            music.currentTime = 0;
        };
    }, [currentSong.get]);

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                height: "100vh",
                width: "100%",
                margin: "auto",
                paddingTop: "2vh",
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
                currentSelectionIndexSet={setCurrentSelection}
                select={select}
            ></Selection>
        </div>
    );
}

export default App;
