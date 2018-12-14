let pieces = {
    pawn: {
        black: '♟',
        white: '♙'
    },
    rook: {
        black: '♜',
        white: '♖'
    },
    knight: {
        black: '♞',
        white: '♘'
    },
    bishop: {
        black: '♝',
        white: '♗'
    },
    queen: {
        black: '♛',
        white: '♕'
    },
    king: {
        black: '♚',
        white: '♔'
    }
},
    table = fenToPosition('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR'),
    //table = fenToPosition('8/3pk3/8/2Q1n3/4b3/3PR3/8/8'),
    selected = {
        from: -1,
        to: -1
    },
    moves = [];

function fenToPosition(fen) {
    let arr = [];
    fen = fen.replace(/\//g, '').split('');
    for (let i = 0; i < fen.length; i++) {
        if (fen[i] > 0) {
            for (let j = 0; j < fen[i]; j++) {
                arr.push({});
            }
        } else {
            let pairs = {
                p: 'pawn',
                r: 'rook',
                n: 'knight',
                b: 'bishop',
                q: 'queen',
                k: 'king'
            };
            let color = /[A-Z]/.test(fen[i]) ? 'white' : 'black';
            let piece = '';
            for (let p in pairs) {
                if (fen[i].toLowerCase() == p) {
                    piece = fen[i].replace(fen[i], pairs[p]);
                }
            }
            arr.push({ color, piece })
        }
    }
    return arr;
}
