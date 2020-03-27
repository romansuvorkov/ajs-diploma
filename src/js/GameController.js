import { generateTeam, generatePosition } from './generators';
import GamePlay from './GamePlay';
import GameState from './GameState';
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
import { computerMoveCalc, computerCharacterChoose } from './computerLogic';

let PlayerTeam = [];
let ComputerTeam = [];
const spawnZonePlayer = [0, 1, 8, 9, 16, 17, 24, 25, 32, 33, 40, 41, 48, 49, 56, 57];
const spawnZoneComputer = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 62, 63];
let activeUnit = null;
let allowedMovesForActiveUnit;
let allowedAttackCellsForActiveUnit;

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.gameState = GameState;
    this.gameState.turnToMove = 0;
    this.playerTeam = [];
    this.computerTeam = [];
  }

  init() {
    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
    this.gamePlay.drawUi('prairie');

    const TeamHuman = generateTeam([Swordsman, Bowman], 1, 2);
    const TeamUndead = generateTeam([Daemon, Vampire, Undead], 1, 2);
    PlayerTeam = generatePosition(spawnZonePlayer, TeamHuman.teamCount, TeamHuman.teamMembers, []);
    ComputerTeam = generatePosition(spawnZoneComputer, TeamUndead.teamCount, TeamUndead.teamMembers, []);
    this.playerTeam = PlayerTeam;
    this.computerTeam = ComputerTeam;

    this.gamePlay.redrawPositions([...this.playerTeam, ...this.computerTeam]);

    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
  }

  computerMove() {
    console.log(this.gameState.turnToMove);
    if (this.gameState.turnToMove === 1) {
      this.gamePlay.deselectCell(activeUnit.position);
      activeUnit = null;
      const computerActiveUnit = computerCharacterChoose(this.computerTeam);
      const allowedMovesForActiveComputerUnit = allowedMoves(computerActiveUnit.character.type, computerActiveUnit.position);
      const allowedAttackCellsForActiveComputerUnit = allowedAttackCells(computerActiveUnit.character.type, computerActiveUnit.position);
      let availableForAttackUnit = null;
      this.playerTeam.forEach((element) => {
        if (allowedAttackCellsForActiveComputerUnit.includes(element.position)) {
          availableForAttackUnit = element;
          if (element.character.health === 0) {
            this.playerTeam.splice(this.playerTeam.indexOf(element), 1);
          }
        }
      });
      if (availableForAttackUnit === null) {
        const targetMove = computerMoveCalc(allowedMovesForActiveComputerUnit);
        computerActiveUnit.position = targetMove;
        console.log("move");
      } else {
        availableForAttackUnit.character.getDamage(computerActiveUnit.character.attack);
        this.gamePlay.showDamage(availableForAttackUnit.position, computerActiveUnit.character.attack).then(() => {
          console.log('Work');
          this.gamePlay.redrawPositions([...this.playerTeam, ...this.computerTeam]);
        });
      }
      this.gameState.nextMove();
    } else {
      GamePlay.showError('Очередь ходить другой команды');
    }
  }

  nextLevel() {
    
  }

  onCellClick(index) {
    // TODO: react to click
    for (let i = 0; i < this.playerTeam.length; i += 1) {
      if (this.playerTeam[i].position === index) {
        if (activeUnit !== null) {
          this.gamePlay.deselectCell(activeUnit.position);
        }
        activeUnit = this.playerTeam[i];
        allowedMovesForActiveUnit = allowedMoves(activeUnit.character.type, activeUnit.position);
        allowedAttackCellsForActiveUnit = allowedAttackCells(activeUnit.character.type, activeUnit.position);
        this.gamePlay.selectCell(index, 'yellow');
      }    
    } 

    if (activeUnit === null) {
      GamePlay.showError('Можно выбрать только Bowman, Magician or Swordsman');
    }

    if (activeUnit !== null) {
      if (allowedMovesForActiveUnit.includes(index)) {
        if (!this.gamePlay.cells[index].firstChild) {
          this.gamePlay.deselectCell(activeUnit.position);
          activeUnit.position = index;
          allowedMovesForActiveUnit = allowedMoves(activeUnit.character.type, activeUnit.position);
          allowedAttackCellsForActiveUnit = allowedAttackCells(activeUnit.character.type, activeUnit.position);
          this.gamePlay.redrawPositions([...this.playerTeam, ...this.computerTeam]);
          this.gameState.nextMove();
          this.computerMove();
        } else if (this.gamePlay.cells[index].firstChild && (this.gamePlay.cells[index].firstChild.classList.contains('vampire') || this.gamePlay.cells[index].firstChild.classList.contains('undead') || this.gamePlay.cells[index].firstChild.classList.contains('daemon'))) {
          if (allowedAttackCellsForActiveUnit.includes(index)) {
            let characterInCell;
            this.computerTeam.forEach((element) => {
              if (element.position === index) {
                characterInCell = element;
              }
            });
            characterInCell.character.getDamage(activeUnit.character.attack);
            if (characterInCell.character.health === 0) {
              this.computerTeam.splice(this.computerTeam.indexOf(characterInCell), 1);
              this.gamePlay.deselectCell(index);
            }
            this.gamePlay.showDamage(index, activeUnit.character.attack).then(() => {
              this.gamePlay.redrawPositions([...this.playerTeam, ...this.computerTeam]);
              this.gameState.nextMove();
              this.computerMove();
            });
          }
        }
      } else if (allowedAttackCellsForActiveUnit.includes(index)) {
        let characterInCell;
        this.computerTeam.forEach((element) => {
          if (element.position === index) {
            characterInCell = element;
          }
        });
        characterInCell.character.getDamage(activeUnit.character.attack);
        if (characterInCell.character.health === 0) {
          this.computerTeam.splice(this.computerTeam.indexOf(characterInCell), 1);
          this.gamePlay.deselectCell(index);
        }
        this.gamePlay.showDamage(index, activeUnit.character.attack).then(() => {
          this.gamePlay.redrawPositions([...this.playerTeam, ...this.computerTeam]);
          this.gameState.nextMove();
          this.computerMove();
        });

      } else if (!this.gamePlay.cells[index].firstChild) {
        GamePlay.showError('Недопустимое действие');
      }
    }

  }


  onCellEnter(index) {
    let characterInCell;
    [...this.playerTeam, ...this.computerTeam].forEach((element) => {
      if (element.position === index) {
        characterInCell = element;
      }
    });
    if (characterInCell !== undefined) {
      this.gamePlay.showCellTooltip(`${String.fromCodePoint(0x1F396)}:${characterInCell.character.level}${String.fromCodePoint(0x2694)}:${characterInCell.character.attack}${String.fromCodePoint(0x1F6E1)}:${characterInCell.character.defence}${String.fromCodePoint(0x2764)}:${characterInCell.character.health}`, index);
    }

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
    } else if (this.gamePlay.cells[index].firstChild) {
      if (this.gamePlay.cells[index].firstChild.classList.contains('magician') || this.gamePlay.cells[index].firstChild.classList.contains('swordsman') || this.gamePlay.cells[index].firstChild.classList.contains('bowman')) {
        this.gamePlay.setCursor(cursors.pointer);
      } else {
        this.gamePlay.setCursor(cursors.notallowed);
      }
    } else {
      this.gamePlay.setCursor(cursors.notallowed);
    }
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
