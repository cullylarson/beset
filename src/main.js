import {curry} from 'ramda'
import Task from 'data.task'

const player1 = Player('Player 1', 10, 'goldenrod')
const player2 = Player('Player 2', 10, 'tomato')

const brains = [
    HumanBrain(player1),
    HumanBrain(player2),
]

const board = Board([player1, player2], [
    [OwnedPlace(player1, []), OwnedPlace(player1, []), PlayablePlace([]), PlayablePlace([]), PlayablePlace([]), OwnedPlace(player2, []), OwnedPlace(player2, [])],
    [OwnedPlace(player1, []), PlayablePlace([]), PlayablePlace([]), PlayablePlace([]), PlayablePlace([]), PlayablePlace([]), PlayablePlace([])],
    [PlayablePlace([]), PlayablePlace([]), PlayablePlace([]), PlayablePlace([]), PlayablePlace([]), PlayablePlace([]), PlayablePlace([])],
    [PlayablePlace([]), Place(), PlayablePlace([]), PlayablePlace([]), Place(), Place(), PlayablePlace([])],
    [PlayablePlace([]), Place(), Place(), Place(), Place(), Place(), PlayablePlace([])],
    [PlayablePlace([]), PlayablePlace([]), PlayablePlace([]), Place(), PlayablePlace([]), PlayablePlace([]), PlayablePlace([])],
    [PlayablePlace([]), PlayablePlace([]), PlayablePlace([]), PlayablePlace([]), PlayablePlace([]), PlayablePlace([]), PlayablePlace([])],
])

window.onload = () => setTimeout(() => {
    const boardEl = document.getElementById('board')
    const drawBoardToEl = drawBoard(50, 48, '#555', boardEl)

    boardEl.width = window.innerWidth
    boardEl.height = window.innerHeight

    // draw the initial board
    drawBoardToEl(board)

    // then start the game, redraw on every 'tick'
    playGame(brains, board, drawBoardToEl)
        .fork()
}, 1)

const drawBoard = curry((boardPadding, placeSize, emptyColor, el, board) => {
    const ctx = el.getContext('2d')

    // clear
    ctx.clearRect(0, 0, el.width, el.height)

    for(let i = 0; i < board.places.length; i++) {
        for(let j = 0; j < board.places[i].length; j++) {
            drawPlace(ctx, boardPadding, placeSize, emptyColor, i, j, board.places[i][j])
        }
    }
})

function drawPlace(ctx, boardPadding, placeSize, emptyColor, i, j, place) {
    // not playable
    if(!place.things) return

    // no owner
    if(!place.owner) drawHex(ctx, boardPadding, placeSize, i, j, emptyColor)

    // owner
    if(place.owner) drawHex(ctx, boardPadding, placeSize, i, j, place.owner.color)
}

/*
 *      p1 +---+ p2
 *        /     \
 *    p6 +       + p3
 *        \     /
 *      p5 +---+ p4
 *
 * It's a good idea for placeSize to be evenly divisible by 2 and 4
 */
function drawHex(ctx, boardPadding, placeSize, i, j, color) {
    const placeSizeDiv4 = placeSize / 4
    const placeSizeDiv2 = placeSize / 2
    const placeSizeThreeQuarters = placeSizeDiv2 + placeSizeDiv4

    const staggeredOffsetX = i % 2 === 0
            ? 0
            : placeSizeThreeQuarters

    const origin = [
        boardPadding + (placeSize * j) + (placeSizeDiv2 * j) + staggeredOffsetX,
        boardPadding + (placeSize * i) - (placeSizeDiv2 * i),
    ]

    const p1 = [
        origin[0] + placeSizeDiv4,
        origin[1],
    ]

    const p2 = [
        origin[0] + placeSizeThreeQuarters,
        origin[1],
    ]

    const p3 = [
        origin[0] + placeSize,
        origin[1] + placeSizeDiv2,
    ]

    const p4 = [
        p2[0],
        origin[1] + placeSize,
    ]

    const p5 = [
        p1[0],
        p4[1],
    ]

    const p6 = [
        origin[0],
        p3[1],
    ]

    const moveTo = p => ctx.moveTo(p[0], p[1])
    const lineTo = p => ctx.lineTo(p[0], p[1])

    ctx.fillStyle = color
    ctx.beginPath()
    moveTo(p1)
    lineTo(p2)
    lineTo(p3)
    lineTo(p4)
    lineTo(p5)
    lineTo(p6)
    ctx.closePath()
    ctx.fill()
}

function Board(players, places) {
    return {players, places}
}

function Place() {
    return {}
}

function PlayablePlace(things) {
    return {
        ...Place(),
        things,
    }
}

function OwnedPlace(owner, things) {
    return {
        ...PlayablePlace(things),
        owner,
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
