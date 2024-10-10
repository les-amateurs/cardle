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
    greens: number[];
    yellows: Map<number, number[]>;
    grays: number[];
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

export function mod(n: number, m: number) {
    return ((n % m) + m) % m;
}

export function wrap<T>([val, setter]: [T, any]): Var<T> {
    return { get: val, set: setter };
}

export function numberToCard(card: number) {
    const suit = 0;
    return `./src/assets/cards/${IDS[card]}-of-${SUITS[suit]}.png`;
}