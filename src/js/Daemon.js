import Character from './Character';

class Daemon extends Character {
  constructor(level, type) {
    if (type !== Daemon) {
      throw new Error('Ошибка. Допускаются только персонажи типа: Daemon');
    }
    const unitType = 'daemon';
    super(level, unitType);
    this.attack = 10;
    this.defence = 40;
  }
}

export default Daemon;
