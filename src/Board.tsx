import PlayingCard from "./PlayingCard.tsx";
import { Card, Game, numberToCard, State, Vec2 } from "./common.tsx";

function Board({
    guess,
    game,
    position,
}: {
    guess: number[],
    game: Game;
    position: Vec2;
}) {
    const columns = [];
    const matrix = [...game.board].map((row) => [...row])

    // fill in guess
    for (let i = 0; i < guess.length; i++) {
        if (matrix[i][0].state == State.Empty) {
            guess.map((n) => {
                return n == undefined ? undefined : {
                    state: State.Visible,
                    n: n,
                    color: null,
                };
            }).forEach((card, j) => {
                if (card == undefined) {
                    return;
                }
                matrix[i][j] = card;
            })
            break;
        }
    }

    for (let i = 0; i < matrix.length; i++) {
        const cards = matrix[i];
        const column = [];
        for (let j = 0; j < cards.length; j++) {
            const card = cards[j];
            const n = card.n;
            let style: React.CSSProperties = {};
            let image = numberToCard(n);

            if (i == position.x && j == position.y) {
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

            column.push(
                <PlayingCard card={image} style={style}></PlayingCard>
            );
        }
        columns.push(
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                }}
            >
                {column}
            </div>
        );
    }

    return (
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
            {columns.reverse()}
        </div>
    );
}

export default Board;
