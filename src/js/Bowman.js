import Character from './Character';

class Bowman extends Character {
  constructor(level, type) {
    if (type !== Bowman) {
      throw new Error('Ошибка. Допускаются только персонажи типа: Bowman');
    }
    const unitType = 'bowman';
    super(level, unitType);
    this.attack = 25;
    this.defence = 25;
  }
}

export default Bowman;
