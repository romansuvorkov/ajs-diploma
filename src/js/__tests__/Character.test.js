import Character from '../Character';
import Daemon from '../Daemon';

test('Создание Daemon', () => {
  const expected = {
    level: 1,
    attack: 10,
    defence: 40,
    health: 50,
    type: 'daemon',
  };
  const received = new Daemon(1, Daemon);
  expect(received).toEqual(expected);
});

test('Ошибка при new Character', () => {
  expect(() => {
    new Character();
  }).toThrow();
});
