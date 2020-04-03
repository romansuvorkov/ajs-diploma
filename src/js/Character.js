export default class Character {
  constructor(level, type = 'generic') {
    this.level = level;
    this.attack = 0;
    this.defence = 0;
    this.health = 50;
    this.type = type;
    // TODO: throw error if user use "new Character()"
    if (new.target.name === 'Character') {
      throw new Error('You cannot create new Character');
    }
  }

  levelUp() {
    this.attack = Math.floor(Math.max(this.attack, this.attack * (1.8 - this.health / 100)));

    if (this.health < 20) {
      this.health += 80;
    } else {
      this.health = 100;
    }
    if (this.level !== 4) {
      this.level += 1;
    }
  }
}
