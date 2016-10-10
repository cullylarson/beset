import {drawBoard, getHexByPixel, getCanvasSizeForBoard} from 'app/draw'
import {playGame} from 'app/play'
import {HumanBrain} from 'app/brains/human-brain'
import {Place, OwnedPlace, PlayablePlace, Player, Board} from 'app/stuff'

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

window.Beset = ({boardEl}) => {
    const boardPadding = 50
    const placeSize = 48

    // drawBoardToEl : Board -> [Side Effects]
    const drawBoardToEl = drawBoard(boardPadding, placeSize, '#555', boardEl)

    const canvasSize = getCanvasSizeForBoard(board, boardPadding, placeSize)

    boardEl.width = canvasSize.w
    boardEl.height = canvasSize.h

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
}
