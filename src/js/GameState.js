
export default class GameState {

  constructor() {
    this.turnToMove = 0;

  }

  static nextMove() {
    this.turnToMove = this.turnToMove === 0 ? 1 : 0;
  }



  static from(object) {
    // TODO: create object
    return null;
  }
}
