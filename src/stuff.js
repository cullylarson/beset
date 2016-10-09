export function Board(players, places) {
    return {players, places}
}

export function Place() {
    return {}
}

export function PlayablePlace(things) {
    return {
        ...Place(),
        things,
    }
}

export function OwnedPlace(owner, things) {
    return {
        ...PlayablePlace(things),
        owner,
    }
}

export function takeOwnership(place, owner) {
    return {
        ...place,
        owner,
    }
}

export function Blight(productivity) {
    return {productivity}
}

export function Unit(strength, productivity) {
    return {strength, productivity}
}

export function Soldier() {
    return Unit(10, -2)
}

export function Farmer() {
    return Unit(1, 1)
}

export function Building(strength, productivity) {
    return {strength, productivity}
}

export function Town() {
    return Building(20, 0)
}

export function Player(name, gold, color) {
    return {name, gold, color}
}

// Brain : Function (Board -> Board) -> Object(play Function (Board -> Board))
export function Brain(play) {
    return {play}
}
