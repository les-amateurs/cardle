export enum State {
    Empty,
    Hidden,
    Visible,
}

export interface Card {
    state: State;
    n: number;
    color: string | null,
}

export interface Game {
    board: Card[][];
    answer: number[];
    greens: Map<number, number>;
    yellows: Map<number, number[]>;
    grays: number[];
    win: boolean,
}

export interface Vec2 {
    x: number,
    y: number,
}

export interface Var<T> {
    get: T;
    set: any;
}

export const IDS = [
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

export const SUITS = ["hearts", "clubs", "diamonds", "spades"];

export const SOUND_EFFECTS = Object.fromEntries(
    Object.entries({
        cardSelect: "cardSlide2",
        win: "win",
        cardFan: "cardFan2"
    }).map(([name, file]) => [
        name,
        () => new Audio(`./src/assets/sounds/effects/${file}.ogg`).play(),
    ])
);

export function mod(n: number, m: number) {
    const d = m == 0 ? 1 : m;
    return ((n % d) + m) % d;
}

export function wrap<T>([val, setter]: [T, any]): Var<T> {
    return { get: val, set: setter };
}

export function numberToCard(card: number) {
    const suit = 1;
    return `./src/assets/cards/${IDS[card]}-of-${SUITS[suit]}.png`;
}