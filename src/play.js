import Task from 'data.task'

export const PlayResult = {
    // Done : board -> PlayResult
    Done(board) {
        return {
            board,
            isDone() { return true },
        }
    },
    // NotDone : board -> PlayResult
    NotDone(board) {
        return {
            board,
            isDone() { return false },
        }
    },
}

// playGame : Array Brain -> Board -> Function(Board) -> Task(_, Board)
//
// Play an entire game. Resolves when game is over.
//
// The tick function will probably be used to re-draw the board, after a move.  It will be called
// whenever that needs to happen.
export function playGame(brains, board, tick) {
    // this is basically a 'while' loop
    return playTurn(brains, board, tick)
        .chain(board => {
            return gameOver(board)
                ? Task.of(board)
                : playGame(brains, board, tick)
        })
}

// gameOver : Board -> Boolean
function gameOver(board) {
    return false // stub
}

// playTurn : Array Brain -> Board -> Function(Board) -> Task(_, Board)
function playTurn(brains, board, tick) {
    return brains
        .reduce(
            (accTask, brain) => accTask.chain(board => playBrain(brain, board, tick)),
            Task.of(board)
        )
}

// playBrain : Brain -> Board -> Function(Board) -> Task(_, Board)
//
// Plays one brain's turn.
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
