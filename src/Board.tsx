import PlayingCard from "./PlayingCard.tsx";
import { Game, IDS, SUITS, State, Vec2, Var, wrap } from "./common.tsx";
import { useRef, useState, useEffect } from "react";

function numberToCard(card: number, color: string, border: boolean) {
    const suit = 1;
    const cardBorder = border ? "border" : "";
    return `./src/assets/cards/${color}/${cardBorder}/${IDS[card]}-of-${SUITS[suit]}.png`;
}

function numberToBack(back: string, border: boolean) {
    const cardBorder = border ? "border" : "";
    return `./src/assets/backs/${cardBorder}/${back}.png`;
}

function Board({
    guess,
    game,
    position,
}: {
    guess: (number | undefined)[];
    game: Game;
    position: Vec2;
}) {
    const matrix = structuredClone(game.board);
    const xPos = position.x;
    const columns = [];
    const refs = Array(10)
        .fill(0)
        .map((_) =>
            Array(4)
                .fill(0)
                .map((_) => useRef<HTMLImageElement>(null))
        );

    var mouse: Var<MouseEvent | undefined> = wrap(useState(undefined));

    useEffect(() => {
        addEventListener("mousemove", mouseMove);
        return () => removeEventListener("mousemove", mouseMove);
    }, [mouseMove]);
    function mouseMove(event: MouseEvent) {
        mouse.set(event);
    }

    // fill in guess
    if (!game.win) {
        for (let i = 0; i < guess.length; i++) {
            const card =
                guess[i] === undefined
                    ? {
                          state: State.Hidden,
                          n: 0,
                          color: null,
                      }
                    : {
                          state: State.Visible,
                          n: guess[i] || 0,
                          color: null,
                      };
            matrix[xPos][i] = card;
        }
    }

    for (let x = 0; x < xPos + 1; x++) {
        const cards = [];
        for (let y = 0; y < matrix[0].length; y++) {
            const card = matrix[x][y];
            const n = card.n;
            const isTarget = y == position.y && x == position.x;
            let style: React.CSSProperties = {};
            let image = "./src/assets/empty.png";

            style.position = "relative";
            style.zIndex = 0;
            style.transform = "";
            if (isTarget) {
                style.transform += "scale(110%) ";
                style.zIndex = 100;
            }

            switch (card.state) {
                case State.Visible:
                    image = numberToCard(n, card.color || "white", isTarget);
                    break;
                case State.Hidden:
                    image = numberToBack("back-2-3", isTarget);
                    break;
                default:
                    break;
            }

            cards.push(
                <PlayingCard
                    card={image}
                    style={style}
                    mouse={mouse.get}
                    position={position}
                    x={x}
                    y={y}
                    ref={refs[x][y]}
                ></PlayingCard>
            );
        }

        const style: React.CSSProperties = {};
        if (x == xPos) {
            style.animation = "column-pop 1000ms";
        }
        columns.push(
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "1fr",
                    gap: "5px",
                    ...style,
                }}
            >
                {cards}
            </div>
        );
    }

    return (
        <div
            style={{
                display: "grid",
                height: "70vh",
                gridTemplateColumns: `repeat(${xPos + 1}, 1fr)`,
                perspective: "1px",
                perspectiveOrigin: `50% 50%`,
                transformStyle: "preserve-3d",
                gap: "10px",
            }}
        >
            {columns}
        </div>
    );
}

export default Board;
