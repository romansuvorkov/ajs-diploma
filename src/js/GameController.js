import { generateTeam, generatePosition } from './generators';
import Bowman from './Bowman';
import Swordsman from './Swordsman';
import Daemon from './Daemon';
import Vampire from './Vampire';
import Undead from './Undead';
import Magician from './Magician';
import PositionedCharacter from './PositionedCharacter';

let PlayerTeam = [];
let ComputerTeam = [];
let charatersPositions = [];
const spawnZonePlayer = [0, 1, 8, 9, 16, 17, 24, 25, 32, 33, 40, 41, 48, 49, 56, 57];
const spawnZoneComputer = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 62, 63];

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
    PlayerTeam = generatePosition(spawnZonePlayer, this.playerTeam.teamCount, this.playerTeam.teamMembers, []);
    ComputerTeam = generatePosition(spawnZoneComputer,  this.computerTeam.teamCount, this.computerTeam.teamMembers, []);
    charatersPositions = [...PlayerTeam, ...ComputerTeam];
    this.gamePlay.redrawPositions(charatersPositions);

    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
  }

  onCellClick(index) {
    // TODO: react to click

  }

  showCharacterInfo(index, unit) {
    console.log(`index ${index}`);
    console.log(`unit ${unit}`);
  }

  onCellEnter(index) {
    let characterInCell = undefined;
    charatersPositions.forEach(element => {
      if (element.position === index) {
            characterInCell = element.character;
          }
      return characterInCell;
    });
    if (characterInCell !== undefined) {
      this.gamePlay.showCellTooltip(`${String.fromCodePoint(0x1F396)}:${characterInCell.level}${String.fromCodePoint(0x2694)}:${characterInCell.attack}${String.fromCodePoint(0x1F6E1)}:${characterInCell.defence}${String.fromCodePoint(0x2764)}:${characterInCell.health}`, index)
    }

  }



  onCellLeave(index) {
    // TODO: react to mouse leave
    this.gamePlay.hideCellTooltip(index);
  }
}
