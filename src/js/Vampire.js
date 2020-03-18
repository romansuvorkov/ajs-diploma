import Character from './Character';

class Vampire extends Character {
  constructor(level, type) {
    if (type !== Vampire) {
      throw new Error('Ошибка. Допускаются только персонажи типа: Vampire ');
    }
    const unitType = 'vampire';
    super(level, unitType);
    this.attack = 40;
    this.defence = 10;
  }
}

export default Vampire;
