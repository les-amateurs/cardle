import { IDS, SUITS } from "./common.tsx";
import PlayingCard from "./PlayingCard.tsx";

const HIGHEST = 200;

function numberToCard(card: number, border: boolean) {
    const suit = 1;
    const borderPath = border ? "border" : "";
    return `./src/assets/cards/white/${borderPath}/${IDS[card]}-of-${SUITS[suit]}.png`;
}

function Selection({
    validSelections,
    currentSelectionIndex,
    currentSelectionIndexSet,
    select,
}: {
    validSelections: number[];
    currentSelectionIndex: number;
    currentSelectionIndexSet: any,
    select: any,
}) {
    const selections = [];
    const center = validSelections.length / 2;
    for (let i = 0; i < validSelections.length; i++) {
        const card = validSelections[i];
        let style: React.CSSProperties = {
            transition: "100ms"
        };
        // if (validSelections.indexOf(i) == -1) {
        //     style.filter = "brightness(30%)";
        // }
        style.border = undefined;
        const dist = Math.abs(center - i);
        if (i < center) {
            style.transform = `rotate(-${dist*0.005}turn) `;
        } else {
            style.transform = `rotate(${dist*0.005}turn) `;
        }
        style.zIndex = HIGHEST-1-dist;

        const current = card == validSelections[currentSelectionIndex];
        if (current) {
            // style.backgroundColor = "black";
            style.transform += `scale(130%) `;
            style.zIndex = HIGHEST;
            style.position = "relative";
            style.animation = "card-pop 100ms"
        }

        selections.push(
            <div style={{
                height: "100%",
            }}>
                <PlayingCard card={numberToCard(card, current)} style={style} mouseOver={() => {
                    currentSelectionIndexSet(i);
                }} click={select}></PlayingCard>
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
