import {drawBoard, getHexByPixel} from './draw'
import {playGame} from './play'
import {HumanBrain} from './brains/human-brain'
import {Place, OwnedPlace, PlayablePlace, Player, Board} from './stuff'

const player1 = Player('Player 1', 10, 'goldenrod')
const player2 = Player('Player 2', 10, 'tomato')

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
    const boardPadding = 50
    const placeSize = 48
    const boardEl = document.getElementById('board')

    // drawBoardToEl : Board -> [Side Effects]
    const drawBoardToEl = drawBoard(boardPadding, placeSize, '#555', boardEl)

    boardEl.width = window.innerWidth
    boardEl.height = window.innerHeight

    // draw the initial board
    drawBoardToEl(board)

    // getHexByPixelForHumanBrain : Board -> Point -> HexPos
    const getHexByPixelForHumanBrain = getHexByPixel(boardPadding, placeSize)

    const brains = [
        HumanBrain(boardEl, player1, getHexByPixelForHumanBrain),
        HumanBrain(boardEl, player2, getHexByPixelForHumanBrain),
    ]

    // start the game, redraw on every 'tick'
    playGame(brains, board, drawBoardToEl)
        .fork()
}, 1)
