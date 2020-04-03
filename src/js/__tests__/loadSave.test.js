import GamePlay from '../GamePlay';
import GameController from '../GameController';
import GameStateService from '../GameStateService';

const gamePlay = new GamePlay();
const stateService = new GameStateService(localStorage);
const gameController = new GameController(gamePlay, stateService);

jest.mock('../GameController');
const save = {
  levelCount: 0,
  turnToMove: 0,
  playerTeam: [],
  computerTeam: [],
  stat: 0,
};

beforeEach(() => {
  jest.resetAllMocks();
});

test('load data', () => {
  gameController.loadGame().mockReturnValue(save);
});
