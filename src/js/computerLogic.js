export function computerMoveCalc(allowedMoves) {
  const targetCell = Math.floor(Math.random() * allowedMoves.length);
  return allowedMoves[targetCell];
}

export function computerCharacterChoose(allowedCharacter) {
  const targetUnit = Math.floor(Math.random() * allowedCharacter.length);
  return allowedCharacter[targetUnit];
}
