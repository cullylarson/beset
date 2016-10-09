import Task from 'data.task'
import {Brain} from '../stuff'
import {Point} from '../draw'
import {PlayResult} from '../play'

export function HumanBrain(boardEl, owner, getHexByPixel) {
    const play = (board) => {
        return new Task((rej, res) => {
            const onClick = e => {
                const rect = e.target.getBoundingClientRect()
                const pixelX = e.clientX - rect.left
                const pixelY = e.clientY - rect.top
                getHexByPixel(board, Point(pixelX, pixelY))
                    .map(hex => {
                        console.log('clicked in hex', hex)
                        boardEl.removeEventListener('click', onClick)
                        res(PlayResult.NotDone(board))
                    })
            }

            boardEl.addEventListener('click', onClick)
        })
    }

    return Brain(play)
}
