import { generateTeam, generatePosition } from './generators';
import GamePlay from './GamePlay';
import GameState from './GameState';
import Bowman from './Bowman';
import Swordsman from './Swordsman';
import Daemon from './Daemon';
import Vampire from './Vampire';
import Undead from './Undead';
import Magician from './Magician';
import allowedMoves from './allowedMoves';
import allowedAttackCells from './allowedAttackCells';
import cursors from './cursors';
import themes from './themes';
import { computerMoveCalc, computerCharacterChoose } from './computerLogic';


const spawnZonePlayer = [0, 1, 8, 9, 16, 17, 24, 25, 32, 33, 40, 41, 48, 49, 56, 57];
const spawnZoneComputer = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 62, 63];
let activeUnit = null;
let allowedMovesForActiveUnit;
let allowedAttackCellsForActiveUnit;

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.playerTeam = [];
    this.computerTeam = [];
    this.levelCount = 0;
    this.turnToMove = 0;
    this.statistic = 0;
  }

  getStat() {
    let unitsHealth = 0;
    this.playerTeam.forEach((unit) => {
      unitsHealth += unit.character.health;
    });
    this.statistic += unitsHealth;
  }

  init() {
    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
    this.gamePlay.drawUi(themes[0]);

    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
    this.gamePlay.addNewGameListener(this.newGame.bind(this));
    this.gamePlay.addLoadGameListener(this.loadGame.bind(this));
    this.gamePlay.addSaveGameListener(this.saveGame.bind(this));
  }

  newGame() {
    activeUnit = null;
    allowedMovesForActiveUnit = null;
    allowedAttackCellsForActiveUnit = null;
    const TeamHuman = generateTeam([Swordsman, Bowman], 1, 2);
    const TeamUndead = generateTeam([Daemon, Vampire, Undead], 1, 2);
    const PlayerTeam = generatePosition(spawnZonePlayer,
      TeamHuman.teamCount,
      TeamHuman.teamMembers,
      []);
    const ComputerTeam = generatePosition(spawnZoneComputer,
      TeamUndead.teamCount,
      TeamUndead.teamMembers,
      []);
    this.playerTeam = PlayerTeam;
    this.computerTeam = ComputerTeam;

    this.gamePlay.redrawPositions([...this.playerTeam, ...this.computerTeam]);
  }

  loadGame() {
    const load = this.stateService.load();
    if (typeof (load) === 'object') {
      this.levelCount = load.levelCount;
      this.turnToMove = load.turnToMove;
      this.playerTeam = load.playerTeam;
      this.computerTeam = load.computerTeam;
      this.gamePlay.drawUi(themes[this.levelCount]);
      this.gamePlay.redrawPositions([...this.playerTeam, ...this.computerTeam]);
      this.statistic = load.stat;
      if (this.turnToMove === 1) {
        this.computerMove();
      }
    } else {
      GamePlay.showError('Ошибка загрузки сохранения');
    }
  }

  saveGame() {
    const save = {
      levelCount: this.levelCount,
      turnToMove: this.turnToMove,
      playerTeam: this.playerTeam,
      computerTeam: this.computerTeam,
      stat: this.statistic,
    };
    this.stateService.save(GameState.from(save));
  }

  nextMove() {
    this.turnToMove = this.turnToMove === 0 ? 1 : 0;
  }

  computerMove() {
    if (this.turnToMove === 1) {
      this.gamePlay.deselectCell(activeUnit.position);
      activeUnit = null;
      const computerActiveUnit = computerCharacterChoose(this.computerTeam);
      const allowedMovesForActiveComputerUnit = allowedMoves(computerActiveUnit.character.type, computerActiveUnit.position);
      const allowedAttackCellsForActiveComputerUnit = allowedAttackCells(computerActiveUnit.character.type, computerActiveUnit.position);
      let availableForAttackUnit = null;
      this.playerTeam.forEach((element) => {
        if (allowedMovesForActiveComputerUnit.includes(element.position)) {
          allowedMovesForActiveComputerUnit.splice(allowedMovesForActiveComputerUnit.indexOf((element.position), 1));
        }
      });
      this.computerTeam.forEach((element) => {
        if (allowedMovesForActiveComputerUnit.includes(element.position)) {
          allowedMovesForActiveComputerUnit.splice(allowedMovesForActiveComputerUnit.indexOf((element.position), 1));
        }
      });
      this.playerTeam.forEach((element) => {
        if (allowedAttackCellsForActiveComputerUnit.includes(element.position)) {
          availableForAttackUnit = element;
        }
      });
      if (availableForAttackUnit === null) {
        const targetMove = computerMoveCalc(allowedMovesForActiveComputerUnit);
        computerActiveUnit.position = targetMove;
        this.gamePlay.redrawPositions([...this.playerTeam, ...this.computerTeam]);
      } else {
        this.getDamage(availableForAttackUnit.character, computerActiveUnit.character.attack);
        if (availableForAttackUnit.character.health === 0) {
          this.playerTeam.splice(this.playerTeam.indexOf(availableForAttackUnit), 1);
        }
        this.gamePlay.showDamage(availableForAttackUnit.position, computerActiveUnit.character.attack).then(() => {
          this.gamePlay.redrawPositions([...this.playerTeam, ...this.computerTeam]);
        });
        if (this.playerTeam.length === 0) {
          this.looseGame();
        }
      }
      this.nextMove();
    } else {
      GamePlay.showError('Очередь ходить другой команды');
    }
  }

  nextLevel() {
    this.getStat();
    this.turnToMove = 0;
    this.levelCount += 1;
    if (this.levelCount >= themes.length) {
      this.endGame();
    } else {
      this.gamePlay.drawUi(themes[this.levelCount]);
      let newUnitQuantity = null;
      if (this.levelCount > 2) {
        newUnitQuantity = 2;
      } else {
        newUnitQuantity = this.levelCount;
      }
      const TeamHuman = generateTeam([Swordsman, Bowman, Magician], this.levelCount, newUnitQuantity);
      this.playerTeam.forEach((element) => {
        element.character.levelUp();
        TeamHuman.teamMembers.push(element.character);
        TeamHuman.teamCount += 1;
      });
      const TeamUndead = generateTeam([Daemon, Vampire, Undead], (this.levelCount + 1), TeamHuman.teamCount);
      const PlayerTeam = generatePosition(spawnZonePlayer, TeamHuman.teamCount, TeamHuman.teamMembers, []);
      const ComputerTeam = generatePosition(spawnZoneComputer, TeamUndead.teamCount, TeamUndead.teamMembers, []);
      this.playerTeam = PlayerTeam;
      this.computerTeam = ComputerTeam;
      this.gamePlay.redrawPositions([...this.playerTeam, ...this.computerTeam]);
    }
  }

  endGame() {
    alert(`Вы победили, Ваш счет ${this.statistic}`);
  }

  looseGame() {
    alert('Вы проиграли');
  }

  getDamage(character, points) {
    const damagePoints = Math.floor(Math.max(points - character.defence, points * 0.1));
    if (character.health > damagePoints) {
      character.health -= damagePoints;
    } else {
      character.health = 0;
    }
  }

  onCellClick(index) {
    // TODO: react to click
    if (this.turnToMove === 0) {
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
            this.nextMove();
            this.computerMove();
          } else if (this.gamePlay.cells[index].firstChild && (this.gamePlay.cells[index].firstChild.classList.contains('vampire')
                                                               || this.gamePlay.cells[index].firstChild.classList.contains('undead')
                                                               || this.gamePlay.cells[index].firstChild.classList.contains('daemon'))) {
            if (allowedAttackCellsForActiveUnit.includes(index)) {
              let characterInCell;
              this.computerTeam.forEach((element) => {
                if (element.position === index) {
                  characterInCell = element;
                }
              });
              this.getDamage(characterInCell.character, activeUnit.character.attack);
              if (characterInCell.character.health === 0) {
                this.computerTeam.splice(this.computerTeam.indexOf(characterInCell), 1);
                this.gamePlay.deselectCell(index);
                if (this.computerTeam.length === 0) {
                  this.nextLevel();
                }
              }
              this.gamePlay.showDamage(index, activeUnit.character.attack).then(() => {
                this.gamePlay.redrawPositions([...this.playerTeam, ...this.computerTeam]);
                this.nextMove();
                this.computerMove();
              });
            }
          }
        } else if (allowedAttackCellsForActiveUnit.includes(index)) {
          if (this.gamePlay.cells[index].firstChild && (this.gamePlay.cells[index].firstChild.classList.contains('vampire') || this.gamePlay.cells[index].firstChild.classList.contains('undead') || this.gamePlay.cells[index].firstChild.classList.contains('daemon'))) {
            let characterInCell;
            this.computerTeam.forEach((element) => {
              if (element.position === index) {
                characterInCell = element;
              }
            });

            this.getDamage(characterInCell.character, activeUnit.character.attack);
            if (characterInCell.character.health === 0) {
              this.computerTeam.splice(this.computerTeam.indexOf(characterInCell), 1);
              this.gamePlay.deselectCell(index);
              if (this.computerTeam.length === 0) {
                this.nextLevel();
              }
            }
            this.gamePlay.showDamage(index, activeUnit.character.attack).then(() => {
              this.gamePlay.redrawPositions([...this.playerTeam, ...this.computerTeam]);
              this.nextMove();
              this.computerMove();
            });
          }
        } else if (!this.gamePlay.cells[index].firstChild) {
          GamePlay.showError('Недопустимое действие');
        }
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
    if (this.turnToMove === 0) {
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
