import { Card, IDS, SUITS } from "./common.tsx";

function PlayingCard({ card, style }: { card: string; style: React.CSSProperties }) {
    return (
        <img
            src={card}
            style={{
                objectFit: "contain",
                imageRendering: "pixelated",
                borderColor: "gray",
                borderWidth: "1px",
                borderStyle: "solid",
                height: "100%",
                width: "100%",
                ...style,
            }}
        ></img>
    );
}

export default PlayingCard;