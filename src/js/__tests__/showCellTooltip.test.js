import GamePlay from '../GamePlay';
import GameController from '../GameController';
import GameStateService from '../GameStateService';

test('Создание Daemon', () => {
  const gamePlay = new GamePlay();
  const stateService = new GameStateService(localStorage);
  const gameController = new GameController(gamePlay, stateService);
  gameController.gamePlay.cells[1] = document.createElement('div');

  const character = {
    level: 1,
    attack: 10,
    defence: 40,
    health: 50,
    type: 'daemon',
  };
  gameController.gamePlay.showCellTooltip(`${String.fromCodePoint(0x1F396)}:${character.level}${String.fromCodePoint(0x2694)}:${character.attack}${String.fromCodePoint(0x1F6E1)}:${character.defence}${String.fromCodePoint(0x2764)}:${character.health}`, 1);

  const expected = '🎖:1⚔:10🛡:40❤:50';

  expect(gameController.gamePlay.cells[1].title).toBe(expected);
});
