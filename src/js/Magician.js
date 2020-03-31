import Character from './Character';

class Magician extends Character {
  constructor(level, type) {
    if (type !== Magician) {
      throw new Error('Ошибка. Допускаются только персонажи типа: Magician');
    }
    const unitType = 'magician';
    super(level, unitType);
    this.attack = 10;
    this.defence = 40;
  }
}

export default Magician;
