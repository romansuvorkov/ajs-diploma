export default function allowedAttackCells(character, position) {
  const forbiddenLeftBorder = [0, 8, 16, 24, 32, 40, 48, 56];
  const forbiddenRightBorder = [7, 15, 23, 31, 39, 47, 55, 63];
  let i = 1;
  let y = 1;
  const allowedAttackField = [];
  let radius = 0;

  if (character === 'bowman' || character === 'vampire') {
    radius = 3;
  }
  if (character === 'swordsman' || character === 'undead') {
    radius = 2;
  }
  if (character === 'magician' || character === 'daemon') {
    radius = 5;
  }

  // right attack
  i = 1;
  while (i < radius) {
    if (forbiddenRightBorder.includes(position)) {
      break;
    } else if (forbiddenRightBorder.includes(position + i)) {
      allowedAttackField.push(position + i);
      break;
    } else {
      allowedAttackField.push(position + i);
      i += 1;
    }
  }

  // left attack
  i = 1;
  while (i < radius) {
    if (forbiddenLeftBorder.includes(position)) {
      break;
    } else if (forbiddenLeftBorder.includes(position - i)) {
      allowedAttackField.push(position - i);
      break;
    } else {
      allowedAttackField.push(position - i);
      i += 1;
    }
  }

  // top left attack
  i = 1;
  y = 1;
  while (i < radius) {
    if ((position - 8 * i) < 0) {
      break;
    } else {
      while (y < radius) {
        if (forbiddenLeftBorder.includes(position - 8 * i)) {
          break;
        } else if (forbiddenLeftBorder.includes((position - 8 * i) - y)) {
          allowedAttackField.push((position - 8 * i) - y);
          break;
        } else {
          allowedAttackField.push((position - 8 * i) - y);
          y += 1;
        }
      }
    }
    y = 1;
    i += 1;
  }

  // top right attack
  i = 1;
  y = 1;
  while (i < radius) {
    if ((position - 8 * i) < 0) {
      break;
    } else {
      while (y < radius) {
        if (forbiddenRightBorder.includes(position - 8 * i)) {
          break;
        } else if (forbiddenRightBorder.includes((position - 8 * i) + y)) {
          allowedAttackField.push((position - 8 * i) + y);
          break;
        } else {
          allowedAttackField.push((position - 8 * i) + y);
          y += 1;
        }
      }
    }
    y = 1;
    i += 1;
  }


  // bottom right attack
  i = 1;
  y = 1;
  while (i < radius) {
    if ((position + 8 * i) > 63) {
      break;
    } else {
      while (y < radius) {
        if (forbiddenRightBorder.includes(position + 8 * i)) {
          break;
        } else if (forbiddenRightBorder.includes((position + 8 * i) + y)) {
          allowedAttackField.push((position + 8 * i) + y);
          break;
        } else {
          allowedAttackField.push((position + 8 * i) + y);
          y += 1;
        }
      }
    }
    y = 1;
    i += 1;
  }

  // bottom left attack
  i = 1;
  y = 1;
  while (i < radius) {
    if ((position + 8 * i) > 63) {
      break;
    } else {
      while (y < radius) {
        if (forbiddenLeftBorder.includes(position + 8 * i)) {
          break;
        } else if (forbiddenLeftBorder.includes((position + 8 * i) - y)) {
          allowedAttackField.push((position + 8 * i) - y);
          break;
        } else {
          allowedAttackField.push((position + 8 * i) - y);
          y += 1;
        }
      }
    }
    y = 1;
    i += 1;
  }

  // bottom attack
  i = 1;
  while (i < radius) {
    if ((position + 8 * i) > 63) {
      break;
    } else {
      allowedAttackField.push(position + 8 * i);
      i += 1;
    }
  }

  // top attack
  i = 1;
  while (i < radius) {
    if ((position - 8 * i) < 0) {
      break;
    } else {
      allowedAttackField.push(position - 8 * i);
      i += 1;
    }
  }


  return allowedAttackField;
}
