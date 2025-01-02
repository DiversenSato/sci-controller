import EngineInterface from './EngineInterface';
import Piece from './Piece';

export default class Player {
    public constructor(
        /**
         * Either {@link Piece.White} or {@link Piece.Black}
         */
        public readonly side: number,
        public readonly engineInterface: EngineInterface,
    ) {}
}
