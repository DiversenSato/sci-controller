export default class BoardHelper {
    public static squareIndexToAlgebraic(squareIndex: number): string {
        const file = BoardHelper.fileFromIndex(squareIndex);
        const rank = BoardHelper.rankFromIndex(squareIndex);

        return 'abcdefgh'.charAt(7 - file) + (rank + 1);
    }

    public static algebraicToSquareIndex(move: string): [number, number] {
        const match = /([a-h])([1-8])([a-h])([1-8])/.exec(move);
        if (!match) throw new Error('Move is not algebraic');

        const fromFile = 'abcdefgh'.indexOf(match[1]);
        const fromRank = parseInt(match[2]) - 1;
        const toFile = 'abcdefgh'.indexOf(match[3]);
        const toRank = parseInt(match[4]) - 1;

        return [
            BoardHelper.positionToSquareIndex(fromFile, fromRank),
            BoardHelper.positionToSquareIndex(toFile, toRank),
        ];
    }

    public static positionToSquareIndex(file: number, rank: number) {
        return rank * 8 + (7 - file);
    }

    public static fileFromIndex(squareIndex: number): number {
        return squareIndex % 8;
    }

    public static rankFromIndex(squareIndex: number): number {
        return Math.floor(squareIndex / 8);
    }
}
