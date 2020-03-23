import { generateTeam, generatePosition } from './generators';
import GamePlay from './GamePlay';
import Bowman from './Bowman';
import Swordsman from './Swordsman';
import Daemon from './Daemon';
import Vampire from './Vampire';
import Undead from './Undead';
import Magician from './Magician';
import PositionedCharacter from './PositionedCharacter';
import allowedMoves from './allowedMoves';
import allowedAttackCells from './allowedAttackCells';
import cursors from './cursors';


let PlayerTeam = [];
let ComputerTeam = [];
let charatersPositions = [];
const spawnZonePlayer = [0, 1, 8, 9, 16, 17, 24, 25, 32, 33, 40, 41, 48, 49, 56, 57];
const spawnZoneComputer = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 62, 63];
let activeUnit = null;
let allowedMovesForActiveUnit;
let allowedAttackCellsForActiveUnit;

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
    for (let i = 0; i < charatersPositions.length; i++) {
      if (charatersPositions[i].position === index && (charatersPositions[i].character.type ==='magician' || charatersPositions[i].character.type === 'swordsman' || charatersPositions[i].character.type === 'bowman')) {
        if (activeUnit !== null) {
          this.gamePlay.deselectCell(activeUnit.position);
        }
        activeUnit = charatersPositions[i];
        allowedMovesForActiveUnit = allowedMoves(activeUnit.character.type, activeUnit.position);
        allowedAttackCellsForActiveUnit = allowedAttackCells(activeUnit.character.type, activeUnit.position);
        this.gamePlay.selectCell(index, 'yellow');
      } 
    }

  if (activeUnit === null) {
    if (this.gamePlay.cells[index].firstChild) {
      if (this.gamePlay.cells[index].firstChild.classList.contains('magician') ||
          this.gamePlay.cells[index].firstChild.classList.contains('swordsman') ||
          this.gamePlay.cells[index].firstChild.classList.contains('bowman')
      ) {
      } else {
        GamePlay.showError('Можно выбирать только персонажей Bowman, Magician, Swordsman');
      }
    } else {
      GamePlay.showError('Можно выбирать только персонажей Bowman, Magician, Swordsman');
    }
  }

    if (activeUnit !== null) {
      if (allowedMovesForActiveUnit.includes(index)) {
          if (!this.gamePlay.cells[index].firstChild) {
          this.gamePlay.deselectCell(activeUnit.position);
          activeUnit.position = index;
          allowedMovesForActiveUnit = allowedMoves(activeUnit.character.type, activeUnit.position);
          allowedAttackCellsForActiveUnit = allowedAttackCells(activeUnit.character.type, activeUnit.position);
          this.gamePlay.redrawPositions(charatersPositions);
          this.gamePlay.selectCell(index, 'yellow');
          }
      }
    }


  }


  onCellEnter(index) {
    let characterInCell = undefined;
    charatersPositions.forEach(element => {
      if (element.position === index) {
            characterInCell = element;
          }
    });
    if (characterInCell !== undefined) {
      this.gamePlay.showCellTooltip(`${String.fromCodePoint(0x1F396)}:${characterInCell.character.level}${String.fromCodePoint(0x2694)}:${characterInCell.character.attack}${String.fromCodePoint(0x1F6E1)}:${characterInCell.character.defence}${String.fromCodePoint(0x2764)}:${characterInCell.character.health}`, index);
    }

    // if ((activeUnit !== null) && allowedMovesForActiveUnit.includes(index)) {
    //   if (!this.gamePlay.cells[index].firstChild) {
    //     this.gamePlay.setCursor(cursors.pointer);
    //     this.gamePlay.selectCell(index, 'green');
    //   } else if (this.gamePlay.cells[index].firstChild.classList.contains('magician') ||
    //             this.gamePlay.cells[index].firstChild.classList.contains('swordsman') ||
    //             this.gamePlay.cells[index].firstChild.classList.contains('bowman')) { 
    //     this.gamePlay.setCursor(cursors.pointer);
    //   } else if (allowedAttackCellsForActiveUnit.includes(index)) { 
    //       this.gamePlay.setCursor(cursors.crosshair);
    //       this.gamePlay.selectCell(index, 'red');
    //   }
    // } else { 
    //   this.gamePlay.setCursor(cursors.notallowed);
    // }

    if (activeUnit !== null) {
      if (allowedMovesForActiveUnit.includes(index)) {
        if (!this.gamePlay.cells[index].firstChild) {
          this.gamePlay.setCursor(cursors.pointer);
          this.gamePlay.selectCell(index, 'green');
        } else if (this.gamePlay.cells[index].firstChild.classList.contains('magician') || this.gamePlay.cells[index].firstChild.classList.contains('swordsman') || this.gamePlay.cells[index].firstChild.classList.contains('bowman')) { 
          this.gamePlay.setCursor(cursors.pointer);
        } else if (allowedAttackCellsForActiveUnit.includes(index)) {
          this.gamePlay.setCursor(cursors.crosshair);
          this.gamePlay.selectCell(index, 'red');
        }
      } else if (allowedAttackCellsForActiveUnit.includes(index)) {
        if (this.gamePlay.cells[index].firstChild) {
          if (this.gamePlay.cells[index].firstChild.classList.contains('vampire') || this.gamePlay.cells[index].firstChild.classList.contains('undead') || this.gamePlay.cells[index].firstChild.classList.contains('daemon')) {
            this.gamePlay.setCursor(cursors.crosshair);
            this.gamePlay.selectCell(index, 'red');
          }
        }
      } else if (!allowedMovesForActiveUnit.includes(index)) {
          if (!this.gamePlay.cells[index].firstChild) {
            this.gamePlay.setCursor(cursors.notallowed);
          } else if (this.gamePlay.cells[index].firstChild) {
            if (this.gamePlay.cells[index].firstChild.classList.contains('magician') || this.gamePlay.cells[index].firstChild.classList.contains('swordsman') || this.gamePlay.cells[index].firstChild.classList.contains('bowman')) {
              this.gamePlay.setCursor(cursors.pointer);
            }
            if (this.gamePlay.cells[index].firstChild.classList.contains('vampire') || this.gamePlay.cells[index].firstChild.classList.contains('undead') || this.gamePlay.cells[index].firstChild.classList.contains('daemon')) {
              if (allowedAttackCellsForActiveUnit.includes(index)) {
                this.gamePlay.setCursor(cursors.crosshair);
                this.gamePlay.selectCell(index, 'red');
              } else {
                this.gamePlay.setCursor(cursors.notallowed);
              }
            }
          }
      }
    } else {
      if (this.gamePlay.cells[index].firstChild) {
        if (this.gamePlay.cells[index].firstChild.classList.contains('magician') || this.gamePlay.cells[index].firstChild.classList.contains('swordsman') || this.gamePlay.cells[index].firstChild.classList.contains('bowman')) {
          this.gamePlay.setCursor(cursors.pointer);
        } else {
          this.gamePlay.setCursor(cursors.notallowed);
        }
      } else {
        this.gamePlay.setCursor(cursors.notallowed);
      }
    }



    // if (characterInCell !== undefined) {
    //   if (characterInCell.character.type === 'undead' || characterInCell.character.type === 'vampire' || characterInCell.character.type === 'daemon') {
    //     this.gamePlay.setCursor(cursors.pointer);
    //   } else {
    //     this.gamePlay.setCursor(cursors.pointer);
    //   }
    // }

    // if (characterInCell.character.type === 'undead' || characterInCell.character.type === 'vampire' || characterInCell.character.type === 'daemon') {
    //   if (allowedAttackCellsForActiveUnit.includes(index)) {
    //     this.gamePlay.setCursor(cursors.crosshair);
    //     this.gamePlay.selectCell(index, 'red');
    //   } else {
    //     this.gamePlay.setCursor(cursors.notallowed);
    //   }
    // }


  }



  onCellLeave(index) {
    // TODO: react to mouse leave
    this.gamePlay.hideCellTooltip(index);
    this.gamePlay.deselectCell(index);
    this.gamePlay.setCursor(cursors.auto);
    if (activeUnit !== null) {
      this.gamePlay.selectCell(activeUnit.position, 'yellow');  
    }
    
  }
}
