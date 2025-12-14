export default class Coordinate {
    public readonly x: number;
    public readonly y: number;

    public get squareIndex() {
        return this.y * 8 + (7 - this.x);
    }

    public constructor(x: number, y?: number) {
        if (y === undefined) {
            this.x = 7 - (x % 8);
            this.y = Math.floor(x / 8);
        } else {
            this.x = x;
            this.y = y;
        }
    }

    public add(coord: Coordinate): Coordinate {
        return new Coordinate(this.x + coord.x, this.y + coord.y);
    }

    public sub(coord: Coordinate): Coordinate {
        return new Coordinate(this.x - coord.x, this.y - coord.y);
    }

    public mult(scalar: number): Coordinate {
        return new Coordinate(this.x * scalar, this.y * scalar);
    }

    public isValidSquare(): boolean {
        return this.x >= 0 && this.x < 8 && this.y >= 0 && this.y < 8;
    }
}
