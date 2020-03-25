/**
 * Generates random characters
 *
 * @param allowedTypes iterable of classes
 * @param maxLevel max character level
 * @returns Character type children (ex. Magician, Bowman, etc)
 */
import Team from './Team';
import PositionedCharacter from './PositionedCharacter';

export function* characterGenerator(allowedTypes, maxLevel) {
  // TODO: write logic here
  while (true) {
    const newUnitTypeNumb = Math.floor(Math.random() * allowedTypes.length);
    const unitLevel = Math.max(1, Math.round(Math.random() * maxLevel));

    const newUnit = new allowedTypes[newUnitTypeNumb](unitLevel, allowedTypes[newUnitTypeNumb]);
    yield newUnit;
  }
}


export function generateTeam(allowedTypes, maxLevel, characterCount) {
  // TODO: write logic here
  const newTeam = new Team();
  const untiGenerator = characterGenerator(allowedTypes, maxLevel);
  for (let i = 0; i < characterCount; i += 1) {
    const generatedUnit = untiGenerator.next().value;
    newTeam.add(generatedUnit);
  }

  return newTeam;
}

export function* positionNumberGenerator(arrayAllowedNumbers) {
  while (true) {
    const randomNumber = Math.floor(Math.random() * arrayAllowedNumbers.length);
    const spawnNumberPosition = arrayAllowedNumbers[randomNumber];
    yield spawnNumberPosition;
  }
}

export function generatePosition(arrayAllowedNumbers, teamCount, arrayWithCharacters, arrayWithPositions) {
  const numbersArrayForSpawn = [...arrayAllowedNumbers];
  const numberGenerator = positionNumberGenerator(numbersArrayForSpawn);

  for (let i = 0; i < teamCount; i += 1) {
    const generatedNumb = numberGenerator.next().value;
    const spawnNumb = numbersArrayForSpawn.indexOf(generatedNumb);
    const characterWithPosition = new PositionedCharacter(arrayWithCharacters[i], generatedNumb);
    arrayWithPositions.push(characterWithPosition);
    numbersArrayForSpawn.splice(spawnNumb, 1);
  }

  return arrayWithPositions;
}
