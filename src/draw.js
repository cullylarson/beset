import {curry} from 'ramda'
import Maybe from 'data.maybe'

// drawBoard : Integer -> Integer -> String -> Dom -> Board -> [Side Effects]
export const drawBoard = curry((boardPadding, placeSize, emptyColor, el, board) => {
    console.log('drawing board')
    const ctx = el.getContext('2d')

    // clear
    ctx.clearRect(0, 0, el.width, el.height)

    for(let i = 0; i < board.places.length; i++) {
        for(let j = 0; j < board.places[i].length; j++) {
            drawPlace(ctx, boardPadding, placeSize, emptyColor, HexPos(i, j), board.places[i][j])
        }
    }
})

// drawPlace : RenderingContext -> Integer -> Integer -> String -> HexPos -> Place -> [Side Effects]
function drawPlace(ctx, boardPadding, placeSize, emptyColor, hexPos, place) {
    // not playable
    if(!place.things) return

    // no owner
    if(!place.owner) drawHex(ctx, boardPadding, placeSize, hexPos, emptyColor)

    // owner
    if(place.owner) drawHex(ctx, boardPadding, placeSize, hexPos, place.owner.color)
}

// drawHex : RenderingContext -> Integer -> Integer -> HexPos -> String -> [Side Effects]
function drawHex(ctx, boardPadding, placeSize, hexPos, color) {
    const coords = getCoordsForHex(boardPadding, placeSize, hexPos)

    const moveTo = p => ctx.moveTo(p.x, p.y)
    const lineTo = p => ctx.lineTo(p.x, p.y)

    ctx.fillStyle = color
    ctx.beginPath()
    moveTo(coords.p1)
    lineTo(coords.p2)
    lineTo(coords.p3)
    lineTo(coords.p4)
    lineTo(coords.p5)
    lineTo(coords.p6)
    ctx.closePath()
    ctx.fill()
}

/*
 * getCoordsForHex : Integer -> Integer -> HexPos -> Object(p1 Point, p2 Point, p3 Point, p4 Point, p5 Point, p6 Point)
 *
 *      p1 +---+ p2
 *        /     \
 *    p6 +       + p3
 *        \     /
 *      p5 +---+ p4
 *
 */
function getCoordsForHex(boardPadding, placeSize, hexPos) {
    const placeSizeDiv4 = placeSize / 4
    const placeSizeDiv2 = placeSize / 2
    const placeSizeThreeQuarters = placeSizeDiv2 + placeSizeDiv4

    const staggeredOffsetX = hexPos.i % 2 === 0
            ? 0
            : placeSizeThreeQuarters

    const origin = Point(
        boardPadding + (placeSize * hexPos.j) + (placeSizeDiv2 * hexPos.j) + staggeredOffsetX,
        boardPadding + (placeSize * hexPos.i) - (placeSizeDiv2 * hexPos.i)
    )

    const p1 = Point(
        origin.x + placeSizeDiv4,
        origin.y
    )

    const p2 = Point(
        origin.x + placeSizeThreeQuarters,
        origin.y
    )

    const p3 = Point(
        origin.x + placeSize,
        origin.y + placeSizeDiv2
    )

    const p4 = Point(
        p2.x,
        origin.y + placeSize
    )

    const p5 = Point(p1.x, p4.y)

    const p6 = Point(origin.x, p3.y)

    return {p1, p2, p3, p4, p5, p6}
}

/*
 * pixelIsInHex : Integer -> Integer -> HexPos -> Point -> Boolean
 *
 *          p1 +----+ p2
 *            /|    |\
 *           / |    | \
 *          /  |    |  \
 *         /   |    |   \
 *        / r1 |    | r3 \
 *    p6 +-----+ r2 +---- + p3
 *        \ r4 |    | r5 /
 *         \   |    |   /
 *          \  |    |  /
 *           \ |    | /
 *            \|    |/
 *          p5 +----+ p4
 *
 */
function pixelIsInHex(boardPadding, placeSize, hexPos, pixel) {
    const coords = getCoordsForHex(boardPadding, placeSize, hexPos)

    // outside the entire box of the hex
    if(
        pixel.x < coords.p6.x
        || pixel.x > coords.p3.x
        || pixel.y < coords.p1.y
        || pixel.y > coords.p5.y
    ) {
        return false
    }

    // r2
    if(
        pixel.x >= coords.p1.x
        && pixel.x <= coords.p2.x
        && pixel.y >= coords.p1.y
        && pixel.y <= coords.p5.y
    ) {
        return true
    }

    // r1
    if(
        pixel.x >= coords.p6.x
        && pixel.y <= coords.p6.y
        && pixel.x <= coords.p1.x
        && pixel.y >= coords.p1.y
    ) {
        // the pixel has to be under the line p1 <-> p6 (under means a greater y)
        const slope = (coords.p6.y - coords.p1.y) / (coords.p6.x - coords.p1.x)
        const minY = coords.p6.y - slope * (coords.p6.x - pixel.x)

        if(pixel.y >= minY) return true
    }

    // r3
    if(
        pixel.x >= coords.p2.x
        && pixel.y >= coords.p2.y
        && pixel.x <= coords.p3.x
        && pixel.y <= coords.p3.y
    ) {
        // the pixel has to be under the line p2 <-> p3 (under means a greater y)
        const slope = (coords.p3.y - coords.p2.y) / (coords.p3.x - coords.p2.x)
        const minY = coords.p3.y - slope * (coords.p3.x - pixel.x)

        if(pixel.y >= minY) return true
    }

    // r4
    if(
        pixel.x >= coords.p6.x
        && pixel.y >= coords.p6.y
        && pixel.x <= coords.p5.x
        && pixel.y <= coords.p5.y
    ) {
        // the pixel has to be above the line p6 <-> p5 (above means a lesser y)
        const slope = (coords.p6.y - coords.p5.y) / (coords.p6.x - coords.p5.x)
        const maxY = coords.p6.y - slope * (coords.p6.x - pixel.x)

        if(pixel.y <= maxY) return true
    }

    // r5
    if(
        pixel.x >= coords.p4.x
        && pixel.y <= coords.p4.y
        && pixel.x <= coords.p3.x
        && pixel.y >= coords.p3.y
    ) {
        // the pixel has to be above the line p4 <-> p3 (above means a lesser y)
        const slope = (coords.p4.y - coords.p3.y) / (coords.p4.x - coords.p3.x)
        const maxY = coords.p4.y - slope * (coords.p4.x - pixel.x)

        if(pixel.y <= maxY) return true
    }

    // otherwise, it's outside
    return false
}

// getHexByPixel : Integer -> Interger -> Board -> Point -> Maybe(HexPos)
export const getHexByPixel = curry((boardPadding, placeSize, board, pixel) => {
    for(let i = 0; i < board.places.length; i++) {
        for(let j = 0; j < board.places[i].length; j++) {
            const hexPos = HexPos(i, j)
            if(pixelIsInHex(boardPadding, placeSize, hexPos, pixel)) return Maybe.Just(hexPos)
        }
    }

    return Maybe.Nothing()
})

// Point : Integer -> Integer -> Object(x Integer, y Integer)
export function Point(x, y) {
    return {x, y}
}

// HexPos : Integer, Integer, Object(i Integer, j Integer)
function HexPos(i, j) {
    return {i, j}
}
