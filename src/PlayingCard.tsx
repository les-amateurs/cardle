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
                minHeight: "100%",
                ...style,
            }}
        ></img>
    );
}

export default PlayingCard;