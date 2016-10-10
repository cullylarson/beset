import Task from 'data.task'
import {Brain, takeOwnership} from 'app/stuff'
import {Point} from 'app/draw'
import {PlayResult} from 'app/play'
import {clone} from 'ramda'

// HumanBrain : Dom -> Dom -> Player -> Function (Board -> Point -> HexPos) -> Object(play Function(Board))
export function HumanBrain(boardEl, turnOverEl, owner, getHexByPixel) {
    const play = (board) => {
        return new Task((rej, res) => {
            const cleanupEventListeners = () => {
                boardEl.removeEventListener('click', onBoardClick)
                turnOverEl.removeEventListener('click', onTurnOverClick)
            }

            const onBoardClick = e => {
                const rect = e.target.getBoundingClientRect()
                const pixelX = e.clientX - rect.left
                const pixelY = e.clientY - rect.top
                getHexByPixel(board, Point(pixelX, pixelY))
                    .map(hex => {
                        const newBoard = clone(board)
                        newBoard.places[hex.i][hex.j] = takeOwnership(newBoard.places[hex.i][hex.j], owner)
                        console.log('clicked in hex', hex)
                        cleanupEventListeners()
                        res(PlayResult.NotDone(newBoard))
                    })
            }

            const onTurnOverClick = _ => {
                cleanupEventListeners()
                res(PlayResult.Done(board))
            }

            boardEl.addEventListener('click', onBoardClick)
            turnOverEl.addEventListener('click', onTurnOverClick)
        })
    }

    return Brain(play)
}
