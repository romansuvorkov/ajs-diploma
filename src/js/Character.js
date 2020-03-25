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

  getDamage(points) {
    const damagePoints = Math.floor(Math.max(points - this.defence, points * 0.1));
    if (this.health > damagePoints) {
      this.health -= damagePoints;
    } else {
      this.health = 0;
    }
  }

  set attack(value) {
    this.newattack = value;
    return this.newattack;
  }

  get attack() {
    const attack = this.newattack;

    return attack;
  }
}
