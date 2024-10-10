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
    currentSelectionIndex = mod(currentSelectionIndex, validSelections.length);
    for (let i = 0; i < IDS.length; i++) {
        let style: React.CSSProperties = {};
        if (validSelections.indexOf(i) == -1) {
            style.filter = "brightness(30%)";
        }
        if (i == validSelections[currentSelectionIndex]) {
            style.backgroundColor = "black";
        }
        selections.push(
            <PlayingCard
                card={numberToCard(i)}
                style={style}
            ></PlayingCard>
        );
    }

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "row",
                height: "20vh",
            }}
        >
            {selections}
        </div>
    );
}

export default Selection;
