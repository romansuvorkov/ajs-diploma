import allowedMoves from '../allowedMoves';

test('Допустимые ходы для bowman', () => {
  const expected = [20, 21, 18, 17, 11, 3, 27, 35, 26, 33, 12, 5, 28, 37, 10, 1];
  const recieved = allowedMoves('bowman', 19);
  expect(recieved).toEqual(expected);
});
