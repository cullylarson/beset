import Task from 'data.task'

export const PlayResult = {
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

export function playGame(brains, board, tick) {
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
