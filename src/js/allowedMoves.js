export default function allowedMoves(characterType, position) {
    const forbiddenLeftMove = [0, 8, 16 ,24 ,32, 40, 48, 56];
    const forbiddenRightMove = [7, 15, 23, 31, 39, 47, 55, 63];
    const forbiddenTopMove = [0, 1, 2, 3, 4, 5, 6, 7];
    const forbiddenBottomMove = [56, 57, 58, 59, 60, 61, 62, 63];
    const allowedMoves = [];
    let i = 0;


    if (characterType === 'swordsman' || characterType === 'undead') {
        //right move
        i = 1;
        while (i < 5) {
            if (forbiddenRightMove.includes(position)) {
                break;
            } else if (forbiddenRightMove.includes(position + i)) {
                allowedMoves.push(position + i);
                console.log(allowedMoves);
                break;
            } else {
                allowedMoves.push(position + i);
                console.log(allowedMoves);
                i++;
            }
        }

        //left move
        i = 1;
        while (i < 5) {
            if (forbiddenLeftMove.includes(position)) {
                break;
            } else if (forbiddenLeftMove.includes(position - i)) {
                allowedMoves.push(position - i);
                console.log(allowedMoves);
                break;
            } else {
                allowedMoves.push(position - i);
                console.log(allowedMoves);
                i++;
            }
        }

        //top move
        i = 1;
        while (i < 5) {
            if (forbiddenTopMove.includes(position)) {
                break;
            } else if (forbiddenTopMove.includes(position - i * 8)) {
                allowedMoves.push(position - i * 8);
                console.log(allowedMoves);
                break;
            } else {
                allowedMoves.push(position - i * 8);
                console.log(allowedMoves);
                i++;
            }
        }

        //bottom move
        i = 1;
        while (i < 5) {
            if (forbiddenBottomMove.includes(position)) {
                break;
            } else if (forbiddenBottomMove.includes(position + i * 8)) {
                allowedMoves.push(position + i * 8);
                console.log(allowedMoves);
                break;
            } else {
                allowedMoves.push(position + i * 8);
                console.log(allowedMoves);
                i++;
            }
        }

        //diagonal move / to bottom
        i = 1;
        while (i < 5) {
            if (forbiddenBottomMove.includes(position)) {
                break;
            } else if (forbiddenLeftMove.includes(position)) {
                break; 
            } else if (forbiddenBottomMove.includes(position + i * 7)) {
                allowedMoves.push(position + i * 7);
                console.log(allowedMoves);
                break;
            } else if (forbiddenLeftMove.includes(position + i * 7)) {
                allowedMoves.push(position + i * 7);
                console.log(allowedMoves);
                break;
            } else {
                allowedMoves.push(position + i * 7);
                console.log(allowedMoves);
                i++;
            }
        }

        //diagonal move / to top
        i = 1;
        while (i < 5) {
            if (forbiddenTopMove.includes(position)) {
                break;
            } else if (forbiddenRightMove.includes(position)) {
                break; 
            } else if (forbiddenTopMove.includes(position - i * 7)) {
                allowedMoves.push(position - i * 7);
                console.log(allowedMoves);
                break;
            } else if (forbiddenRightMove.includes(position - i * 7)) {
                allowedMoves.push(position - i * 7);
                console.log(allowedMoves);
                break;
            } else {
                allowedMoves.push(position - i * 7);
                console.log(allowedMoves);
                i++;
            }
        }

        //diagonal move \ to bottom
        i = 1;
        while (i < 5) {
            if (forbiddenBottomMove.includes(position)) {
                break;
            } else if (forbiddenRightMove.includes(position)) {
                break; 
            } else if (forbiddenBottomMove.includes(position + i * 9)) {
                allowedMoves.push(position + i * 9);
                console.log(allowedMoves);
                break;
            } else if (forbiddenRightMove.includes(position + i * 9)) {
                allowedMoves.push(position + i * 9);
                console.log(allowedMoves);
                break;
            } else {
                allowedMoves.push(position + i * 9);
                console.log(allowedMoves);
                i++;
            }
        }

        //diagonal move \ to top
        i = 1;
        while (i < 5) {
            if (forbiddenTopMove.includes(position)) {
                break;
            } else if (forbiddenLeftMove.includes(position)) {
                break; 
            } else if (forbiddenTopMove.includes(position - i * 9)) {
                allowedMoves.push(position - i * 9);
                console.log(allowedMoves);
                break;
            } else if (forbiddenLeftMove.includes(position - i * 9)) {
                allowedMoves.push(position - i * 9);
                console.log(allowedMoves);
                break;
            } else {
                allowedMoves.push(position - i * 9);
                console.log(allowedMoves);
                i++;
            }
        }




    }

    return allowedMoves;

}

      