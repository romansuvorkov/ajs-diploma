import GamePlay from '../GamePlay';
import GameController from '../GameController';
import GameStateService from '../GameStateService';

const gamePlay = new GamePlay();
const stateService = new GameStateService(localStorage);
const gameController = new GameController(gamePlay, stateService);

jest.mock('../GameStateService');
jest.mock('../GamePlay');
const save = {
  levelCount: 1,
  turnToMove: 0,
  playerTeam: [],
  computerTeam: [],
  stat: 123,
};

beforeEach(() => {
  jest.resetAllMocks();
});

test('Загрузка', () => {
  gameController.stateService.load.mockReturnValue(save);
  gameController.loadGame();
  const recieved = {};
  recieved.levelCount = gameController.levelCount;
  recieved.turnToMove = gameController.turnToMove;
  recieved.playerTeam = gameController.playerTeam;
  recieved.computerTeam = gameController.computerTeam;
  recieved.stat = gameController.statistic;
  expect(recieved).toEqual(save);
});


test('Ошибка', () => {
  const recieved = new Error('Invalid state');
  gameController.stateService.load.mockReturnValue(recieved);
  expect(() => {
    gameController.loadGame();
  }).toThrow();
});
