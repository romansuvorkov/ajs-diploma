export default function allowedMoves(characterType, position) {
  const forbiddenLeftMove = [0, 8, 16, 24, 32, 40, 48, 56];
  const forbiddenRightMove = [7, 15, 23, 31, 39, 47, 55, 63];
  const forbiddenTopMove = [0, 1, 2, 3, 4, 5, 6, 7];
  const forbiddenBottomMove = [56, 57, 58, 59, 60, 61, 62, 63];
  const allowedMovesCells = [];
  let i = 0;
  let radius = 0;


  if (characterType === 'bowman' || characterType === 'vampire') {
    radius = 3;
  }
  if (characterType === 'swordsman' || characterType === 'undead') {
    radius = 5;
  }
  if (characterType === 'magician' || characterType === 'daemon') {
    radius = 2;
  }
  // right move
  i = 1;
  while (i < radius) {
    if (forbiddenRightMove.includes(position)) {
      break;
    } else if (forbiddenRightMove.includes(position + i)) {
      allowedMovesCells.push(position + i);
      break;
    } else {
      allowedMovesCells.push(position + i);
      i += 1;
    }
  }

  // left move
  i = 1;
  while (i < radius) {
    if (forbiddenLeftMove.includes(position)) {
      break;
    } else if (forbiddenLeftMove.includes(position - i)) {
      allowedMovesCells.push(position - i);
      break;
    } else {
      allowedMovesCells.push(position - i);
      i += 1;
    }
  }

  // top move
  i = 1;
  while (i < radius) {
    if (forbiddenTopMove.includes(position)) {
      break;
    } else if (forbiddenTopMove.includes(position - i * 8)) {
      allowedMovesCells.push(position - i * 8);
      break;
    } else {
      allowedMovesCells.push(position - i * 8);
      i += 1;
    }
  }

  // bottom move
  i = 1;
  while (i < radius) {
    if (forbiddenBottomMove.includes(position)) {
      break;
    } else if (forbiddenBottomMove.includes(position + i * 8)) {
      allowedMovesCells.push(position + i * 8);
      break;
    } else {
      allowedMovesCells.push(position + i * 8);
      i += 1;
    }
  }

  // diagonal move / to bottom
  i = 1;
  while (i < radius) {
    if (forbiddenBottomMove.includes(position)) {
      break;
    } else if (forbiddenLeftMove.includes(position)) {
      break;
    } else if (forbiddenBottomMove.includes(position + i * 7)) {
      allowedMovesCells.push(position + i * 7);
      break;
    } else if (forbiddenLeftMove.includes(position + i * 7)) {
      allowedMovesCells.push(position + i * 7);
      break;
    } else {
      allowedMovesCells.push(position + i * 7);
      i += 1;
    }
  }

  // diagonal move / to top
  i = 1;
  while (i < radius) {
    if (forbiddenTopMove.includes(position)) {
      break;
    } else if (forbiddenRightMove.includes(position)) {
      break;
    } else if (forbiddenTopMove.includes(position - i * 7)) {
      allowedMovesCells.push(position - i * 7);
      break;
    } else if (forbiddenRightMove.includes(position - i * 7)) {
      allowedMovesCells.push(position - i * 7);
      break;
    } else {
      allowedMovesCells.push(position - i * 7);
      i += 1;
    }
  }

  // diagonal move \ to bottom
  i = 1;
  while (i < radius) {
    if (forbiddenBottomMove.includes(position)) {
      break;
    } else if (forbiddenRightMove.includes(position)) {
      break;
    } else if (forbiddenBottomMove.includes(position + i * 9)) {
      allowedMovesCells.push(position + i * 9);
      break;
    } else if (forbiddenRightMove.includes(position + i * 9)) {
      allowedMovesCells.push(position + i * 9);
      break;
    } else {
      allowedMovesCells.push(position + i * 9);
      i += 1;
    }
  }

  // diagonal move \ to top
  i = 1;
  while (i < radius) {
    if (forbiddenTopMove.includes(position)) {
      break;
    } else if (forbiddenLeftMove.includes(position)) {
      break;
    } else if (forbiddenTopMove.includes(position - i * 9)) {
      allowedMovesCells.push(position - i * 9);
      break;
    } else if (forbiddenLeftMove.includes(position - i * 9)) {
      allowedMovesCells.push(position - i * 9);
      break;
    } else {
      allowedMovesCells.push(position - i * 9);
      i += 1;
    }
  }

  return allowedMovesCells;
}
