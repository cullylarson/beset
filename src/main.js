import {curry} from 'ramda'
import Task from 'data.task'

const player1 = Player('Player 1', 10, 'goldenrod')
const player2 = Player('Player 2', 10, 'tomato')

const brains = [
    HumanBrain(player1),
    HumanBrain(player2),
]

const board = Board([player1, player2], [
    [PlayablePlace(player1, []), PlayablePlace(player1, []), Place(), Place(), Place(), PlayablePlace(player2, []), PlayablePlace(player2)],
    [PlayablePlace(player1, []), Place(), Place(), Place(), Place(), Place(), Place()],
    [Place(), Place(), Place(), Place(), Place(), Place(), Place()],
    [Place(), Place(), Place(), Place(), Place(), Place(), Place()],
    [Place(), Place(), Place(), Place(), Place(), Place(), Place()],
    [Place(), Place(), Place(), Place(), Place(), Place(), Place()],
    [Place(), Place(), Place(), Place(), Place(), Place(), Place()],
])

window.onload = () => setTimeout(() => {
    const boardEl = document.getElementById('board')
    const drawBoardToEl = drawBoard('#555', boardEl)

    // draw the initial board
    drawBoardToEl(board)

    // then start the game, redraw on every 'tick'
    playGame(brains, board, drawBoardToEl)
        .fork()
}, 1)

const drawBoard = curry((emptyColor, el, board) => {
    console.log('tick')
    const ctx = el.getContext('2d')

    // clear
    ctx.clearRect(0, 0, el.width, el.height)
})

function Board(players, places) {
    return {players, places}
}

function Place() {
    return {}
}

function PlayablePlace(owner, things) {
    return {
        ...Place(),
        owner,
        things,
    }
}

/*
function Blight(productivity) {
    return {productivity}
}

function Unit(strength, productivity) {
    return {strength, productivity}
}

function Soldier() {
    return Unit(10, -2)
}

function Farmer() {
    return Unit(1, 1)
}

function Building(strength, productivity) {
    return {strength, productivity}
}

function Town() {
    return Building(20, 0)
}
*/

function Player(name, gold, color) {
    return {name, gold, color}
}

function Brain(play) {
    return {play}
}

const PlayResult = {
    Done(board) {
        return {
            board,
            isDone() { return true },
        }
    },
    NotDone(board) {
        return {
            board,
            isDone() { return false },
        }
    },
}

function playGame(brains, board, tick) {
    // this is basically a 'while' loop
    return playTurn(brains, board, tick)
        .chain(board => {
            return gameOver(board)
                ? Task.of(board)
                : playGame(brains, board, tick)
        })
}

function gameOver(board) {
    return false // stub
}

function playTurn(brains, board, tick) {
    return brains
        .reduce(
            (accTask, brain) => accTask.chain(board => playBrain(brain, board, tick)),
            Task.of(board)
        )
}

function playBrain(brain, board, tick) {
    // this is basically a 'while' loop
    return brain.play(board)
        .chain(result => {
            tick(result.board)

            return result.isDone()
                ? Task.of(result.board)
                : playBrain(brain, board, tick)
        })
}

function HumanBrain(owner) {
    const play = (board) => {
        return new Task((rej, res) => {
            // start stub
            setTimeout(() => {
                res(PlayResult.Done(board))
            }, 2000)
            // end stub
        })
    }

    return Brain(play)
}
