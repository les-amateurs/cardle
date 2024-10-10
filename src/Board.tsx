import PlayingCard from "./PlayingCard.tsx";
import { Card, Game, numberToCard, State, Vec2 } from "./common.tsx";

function Board({
    guess,
    game,
    position,
}: {
    guess: number[];
    game: Game;
    position: Vec2;
}) {
    let cards = [];
    const matrix = structuredClone(game.board);
    const xPos = position.x;

    // fill in guess
    for (let i = 0; i < guess.length; i++) {
        if (matrix[i][0].state == State.Empty) {
            guess
                .map((n) => {
                    return n == undefined
                        ? undefined
                        : {
                              state: State.Visible,
                              n: n,
                              color: null,
                          };
                })
                .forEach((card, j) => {
                    if (card == undefined) {
                        return;
                    }
                    matrix[xPos][j] = card;
                });
            break;
        }
    }

    for (let i = 0; i < matrix[0].length; i++) {
        for (let j = 0; j < matrix.length; j++) {
            const card = matrix[j][i];
            const n = card.n;
            let style: React.CSSProperties = {};
            let image = numberToCard(n);

            if (i == position.y && j == position.x) {
                style.backgroundColor = "gray";
            } else {
                style.backgroundColor = "inherit";
            }

            switch (card.state) {
                case State.Empty:
                    image = "./src/assets/empty.png";
                    break;
                case State.Visible:
                    if (card.color) {
                        style.backgroundColor = card.color;
                    }
                    break;
                default:
                    break;
            }

            cards.push(
                <PlayingCard card={image} style={style}></PlayingCard>
            );
        }
    }

    return (
        <div
            style={{
                borderColor: "gray",
                borderWidth: "1px",
                borderStyle: "solid",
                display: "grid",
                height: "70vh",
                gridTemplateColumns: "repeat(10, 1fr)",
            }}
        >
            {cards}
        </div>
    );
}

export default Board;
