import { mod, IDS, State, numberToCard } from "./common.tsx";
import PlayingCard from "./PlayingCard.tsx";

function Selection({
    validSelections,
    currentSelectionIndex,
}: {
    validSelections: number[];
    currentSelectionIndex: number;
}) {
    const selections = [];
    for (let i = 0; i < IDS.length; i++) {
        let style: React.CSSProperties = {};
        if (validSelections.indexOf(i) == -1) {
            style.filter = "brightness(30%)";
        }
        if (i == validSelections[currentSelectionIndex]) {
            style.backgroundColor = "black";
        }
        selections.push(
            <div style={{
                height: "100%",
            }}>
                <PlayingCard card={numberToCard(i)} style={style}></PlayingCard>
            </div>
        );
    }

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "row",
                boxSizing: "border-box",
                width: "100%",
                height: "20vh",
                justifyContent: "center",
            }}
        >
            {selections}
        </div>
    );
}

export default Selection;
