import { generateTeam } from './generators';
import Bowman from './Bowman';
import Swordsman from './Swordsman';
import Daemon from './Daemon';
import Vampire from './Vampire';
import Undead from './Undead';
import Magician from './Magician';
import PositionedCharacter from './PositionedCharacter';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
  }

  init() {
    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
    this.gamePlay.drawUi('prairie');

    this.playerTeam = generateTeam([Swordsman, Bowman], 1, 2);
    this.playerTeam.teamMembers[0].level = 1;
    this.playerTeam.teamMembers[1].level = 1;
    this.computerTeam = generateTeam([Daemon, Vampire, Undead], 1, 2);
    this.computerTeam.teamMembers[0].level = 1;
    this.computerTeam.teamMembers[1].level = 1;
    console.log('playerTeam');
    console.log(this.playerTeam);
    console.log('computerTeam');
    console.log(this.computerTeam);
  }

  onCellClick(index) {
    // TODO: react to click
  }

  onCellEnter(index) {
    // TODO: react to mouse enter
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
  }
}
