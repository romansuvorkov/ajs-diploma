/**
 * Generates random characters
 *
 * @param allowedTypes iterable of classes
 * @param maxLevel max character level
 * @returns Character type children (ex. Magician, Bowman, etc)
 */
import Team from './Team';


export function* characterGenerator(allowedTypes, maxLevel) {
  // TODO: write logic here
  while (true) {
    const newUnitTypeNumb = Math.floor(Math.random() * allowedTypes.length);
    const unitLevel = Math.floor(Math.random() * (maxLevel + 1));

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
