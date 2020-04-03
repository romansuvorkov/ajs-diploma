import allowedAttackCells from '../allowedAttackCells';

test('Допустимая атака для swordsman', () => {
  const expected = [19, 17, 9, 11, 27, 25, 26, 10];
  const recieved = allowedAttackCells('swordsman', 18);
  expect(recieved).toEqual(expected);
});
