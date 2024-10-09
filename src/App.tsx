import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";

const IDS = [
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
    "ten",
    "jack",
    "queen",
    "king",
    "ace",
];
const SUITS = ["hearts", "clubs", "diamonds", "spades"];

interface Card {
    state: string;
    n: number;
}

interface Game {
    board: Card[][];
    greens: number[];
    yellows: Map<number, number[]>;
    grays: number[];
}

function numberToCard(card: Card) {
    const suit = 0;
    if (card.state === "U") {
        return "./src/assets/backs/back-0-0.png";
    }
    return `./src/assets/cards/${IDS[card.n]}-of-${SUITS[suit]}.png`;
}

function renderCard(card: Card, style: React.CSSProperties) {
    return (
        <img
            src={numberToCard(card)}
            style={{
                objectFit: "contain",
                imageRendering: "-moz-crisp-edges",
                borderColor: "gray",
                borderWidth: "1px",
                borderStyle: "solid",
                height: "100%",
                ...style,
            }}
        ></img>
    );
}

function renderColumn(cards: Card[], currentRow: number) {
    const r = [];
    for (let i = 0; i < cards.length; i++) {
        if (i == currentRow) {
            r.push(renderCard(cards[i], { backgroundColor: "gray" }));
        } else {
            r.push(renderCard(cards[i], { backgroundColor: "inherit" }));
        }
    }
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
            }}
        >
            {r}
        </div>
    );
}

function renderBoard(game: Game, currentGuess: number, currentRow: number) {
    const r = [];
    for (let i = 0; i < game.board.length; i++) {
        const col = game.board[i];
        if (i == currentGuess) {
            r.push(renderColumn(col, currentRow));
        } else {
            r.push(renderColumn(col, -1));
        }
    }
    return r.reverse();
}

function renderOptions(game: Game) {
    const options = [];
    for (let i = 0; i < IDS.length; i++) {
        const style: React.CSSProperties = {};
        if (game.greens.indexOf(i) != -1 || game.grays.indexOf(i) != -1 || game.yellows.has(i)) {
            style.filter = "brightness(30%)";
        }
        const card = renderCard(
            {
                state: "S",
                n: i,
            },
            style,
        );
        options.push(card);
    }

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "row",
                height: "20vh"
            }}
        >
            {options}
        </div>
    );
}

function updateOptions(
    board: object[][],
    selectedIndex: number,
    setOptions: any
) {
    const options = [];
}

function randomAnswer() {
    const answer = [];
    for (let i = 0; i < 4; i++) {
        answer.push({
            state: "H",
            n: Math.floor(Math.random() * 13),
        });
    }
    return answer;
}

function App() {
    const [answer, setAnswer] = useState(randomAnswer());
    const [game, setGame] = useState({
        board: Array(10)
            .fill(0)
            .map((u) =>
                Array(4).fill({
                    state: "U",
                    number: undefined,
                })
            ),
        greens: [0],
        yellows: new Map(),
        grays: [],
    });
    const [currentGuess, setCurrentGuess] = useState(0);
    const [currentRow, setCurrentRow] = useState(0);
    const [lastPressedKey, setLastPressedKey] = useState(null);
    const [currentOptions, setCurrentOptions] = useState({});

    const handleKeyPress = (event: KeyboardEvent) => {
        let row = currentRow;
        switch (event.key) {
            case "ArrowDown":
                row = currentRow + 1;
                break;
            case "ArrowUp":
                row = currentRow - 1;
                break;
        }
        if (row < 0) {
            row += 4;
        }
        setCurrentRow(row % 4);
    };
    useEffect(() => {
        window.addEventListener("keydown", handleKeyPress);

        return () => window.removeEventListener("keydown", handleKeyPress);
    }, [currentRow]);

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
            <div
                style={{
                    borderColor: "gray",
                    borderWidth: "1px",
                    borderStyle: "solid",
                    display: "flex",
                    flexDirection: "row",
                    height: "70vh",
                    width: "100%",
                }}
            >
                {renderColumn(answer, -1)}
                {renderBoard(game, currentGuess, currentRow)}
            </div>

            {renderOptions(game)}
        </div>
    );
}

export default App;
