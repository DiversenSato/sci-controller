export default class Piece {
    public static readonly None = 0;
    public static readonly King = 1;
    public static readonly Pawn = 2;
    public static readonly Knight = 3;
    public static readonly Bishop = 4;
    public static readonly Rook = 5;
    public static readonly Queen = 6;

    public static readonly White = 8;
    public static readonly Black = 16;

    public static readonly WhiteKing = Piece.King | Piece.White;
    public static readonly WhitePawn = Piece.Pawn | Piece.White;
    public static readonly WhiteKnight = Piece.Knight | Piece.White;
    public static readonly WhiteBishop = Piece.Bishop | Piece.White;
    public static readonly WhiteRook = Piece.Rook | Piece.White;
    public static readonly WhiteQueen = Piece.Queen | Piece.White;

    public static readonly BlackKing = Piece.King | Piece.Black;
    public static readonly BlackPawn = Piece.Pawn | Piece.Black;
    public static readonly BlackKnight = Piece.Knight | Piece.Black;
    public static readonly BlackBishop = Piece.Bishop | Piece.Black;
    public static readonly BlackRook = Piece.Rook | Piece.Black;
    public static readonly BlackQueen = Piece.Queen | Piece.Black;

    public static type(piece: number): number {
        return piece & 7;
    }

    public static color(piece: number): number {
        return piece & 24;
    }

    public static toSymbol(piece: number): string {
        const symbol = (() => {
            switch (Piece.type(piece)) {
                case Piece.King: return 'K';
                case Piece.Pawn: return 'P';
                case Piece.Knight: return 'N';
                case Piece.Bishop: return 'B';
                case Piece.Rook: return 'R';
                case Piece.Queen: return 'Q';
                default: return '.';
            }
        })();

        return Piece.color(piece) === Piece.White ? symbol : symbol.toLowerCase();
    }

    public static toCSSClass(piece: number) {
        return (Piece.color(piece) === Piece.White ? 'w' : 'b') + Piece.toSymbol(piece).toLowerCase();
    }
}
