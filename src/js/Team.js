export default class Team {
  constructor() {
    this.teamCount = 0;
    this.teamMembers = [];
  }

  add(character) {
    this.teamMembers.push(character);
    this.teamCount += 1;
  }

  * [Symbol.iterator]() {
    let current = 0;
    while (current < this.teamCount) {
      yield this.teamMembers[current];
      current += 1;
    }
  }
}
