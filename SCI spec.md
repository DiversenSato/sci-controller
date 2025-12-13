# SCI specification

## Proposal #1
All communication MUST be using HTTP POST requests. Engines MUST respond with plain text in the response body.

Moves are denoted using a modified version of long algebraic notation.
Moves are case insensitive, but SHOULD use lowercase.<br>

Here is a regex to match legal notations:

`[a-h][1-8]x?[a-h][1-8][nbrq]?[+#]?`

Example moves:<br>
`e2e4`<br>
`e1g1` white queenside castle<br>
`b2xd4+`<br>
`a7a8q` pawn promotion to queen<br>

### Commands
#### `sciokay` The engine MUST respond with "sciokay".

#### `newGame` This command signals to the engine that it MUST reset its state. The engine SHOULD respond with "ok".

#### `bestMove` Requests the engine to return the best move it can find for the current board position.

#### `makeMove <move>` Tells the engine to make the supplied move.