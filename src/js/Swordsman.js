import Character from './Character';

class Swordsman extends Character {
  constructor(level, type) {
    if (type !== Swordsman) {
      throw new Error('Ошибка. Допускаются только персонажи типа: Swordsman');
    }
    super(level, type);
    this.attack = 40;
    this.defence = 10;
  }
}

export default Swordsman;
