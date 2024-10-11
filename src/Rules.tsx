export function Rules() {
    return <>
        <p>Welcome to Cardle!</p>
        <ol>
            <li>4 cards will be selected as the winning cards.</li>
            <li>You have 10 attempts to guess these 4 cards. Correct guesses will be labeled "green," guessed cards that are in the wrong position but are present in the solution will be labeled "yellow," and all incorrect guesses will be labeled "gray."</li>
            <li>Cardle is played in "hard mode." Any green cards MUST be used in subsequent guesses in their correct position; any yellow cards MUST be used in subsequent guesses in a position different from the positions deemed incorrect. Any incorrectly guessed cards can no longer be used.</li>
            <li>Good luck!</li>
        </ol>
    </>
}