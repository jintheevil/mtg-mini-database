/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  return knex.raw(
      'insert into cards ( cardName, cardType, creatureType, set_id, rarity, imgURL ) ' +
      'values ' +
      '( "Angel of Serenity", "Creature", "Angel", 1, "M", "https://c1.scryfall.com/file/scryfall-cards/large/front/f/1/f10d82f7-7759-457e-a9bb-f9a5bd968f82.jpg?1562795279"),' +
      '( "Armory Guard", "Creature", "Giant Soldier", 1, "C", "https://c1.scryfall.com/file/scryfall-cards/large/front/c/0/c03498c1-b7f7-41fb-8e2a-1c087d4e9990.jpg?1562792563"),' +
      '( "Rest in Peace", "Enchantment", null, 1, "R" , "https://c1.scryfall.com/file/scryfall-cards/large/front/3/7/37c2b1d1-faa0-40fd-82f4-216604ce7635.jpg?1562784882"),' +
      '( "Cyclonic Rift", "Instant", null, 1, "R", "https://c1.scryfall.com/file/scryfall-cards/large/front/2/0/205c4689-8b02-4d40-9274-3c1fcafa8b82.jpg?1562783580"),' +
      '( "Guttersnipe", "Creature", "Goblin Shaman", 1, "U", "https://c1.scryfall.com/file/scryfall-cards/large/front/9/d/9d8590ea-512c-4e09-97cc-7f07d0706f2b.jpg?1562790659"),' +
      '( "Diluvian Primordian", "Creature", "Avatar", 2, "R", "https://c1.scryfall.com/file/scryfall-cards/large/front/0/b/0b7c34af-91de-44c6-a3e2-f48dbb0ce9fd.jpg?1561815273"),' +
      '( "Rapid Hybridization", "Instant", null, 2, "U", "https://c1.scryfall.com/file/scryfall-cards/large/front/8/3/83557f55-f1ab-4995-9cc1-37be895a59db.jpg?1561834181"),' +
      '( "Simic Manipulator", "Creature", "Mutant Wizard", 2, "R", "https://c1.scryfall.com/file/scryfall-cards/large/front/e/3/e3dff9e6-5e0c-4e5b-8184-f0ae9cf347b3.jpg?1561849835"),' +
      '( "Totally Lost", "Instant", null, 2, "C", "https://c1.scryfall.com/file/scryfall-cards/large/front/e/c/ec8e4142-7c46-4d2f-aaa6-6410f323d9f0.jpg?1561851198"),' +
      '( "Lord of the Void", "Creature", "Demon", 2, "M", "https://c1.scryfall.com/file/scryfall-cards/large/front/7/5/75b83fe5-fd00-4532-bc67-07836abfc99c.jpg?1561831853"),' +
      '( "Chained to the Rocks", "Enchantment ", null, 3, "R", "https://c1.scryfall.com/file/scryfall-cards/large/front/a/5/a5af083f-5820-4185-ac04-4c4368f7703c.jpg?1562823699"),' +
      '( "Elspeth, Sun\'s Champion", "Legendary Planeswalker", null, 3, "M", "https://c1.scryfall.com/file/scryfall-cards/large/front/f/d/fd5b1633-c41d-42b1-af1b-4a872077ffbd.jpg?1562839369"),' +
      '( "Heliod, God of the Sun", "Legendary Enchantment Creature", "God", 3, "M", "https://c1.scryfall.com/file/scryfall-cards/large/front/e/9/e90d01c9-e76e-42ff-b0fa-8b6786242aae.jpg?1562836166"),' +
      '( "Dissolve", "Instant", null, 3, "U", "https://c1.scryfall.com/file/scryfall-cards/large/front/9/9/992e8119-f933-4e54-bb04-e1cc78f7e87b.jpg?1562821811"),' +
      '( "Master of Waves", "Creature", "Merfolk Wizard", 3, "M", "https://c1.scryfall.com/file/scryfall-cards/large/front/1/9/19242db3-660d-4d66-800c-d6cee636bcaf.jpg?1562815192"),' +
      '( "Akroan Phalanx", "Creature", "Human Soldier", 4, "U", "https://c1.scryfall.com/file/scryfall-cards/large/front/f/e/fe23019a-e432-4a27-8acb-b17728a1e8b0.jpg?1593091348"),' +
      '( "Dawn to Dusk", "Sorcery", null, 4, "U", "https://c1.scryfall.com/file/scryfall-cards/large/front/0/2/026ee3ff-bfd3-42d7-a4fa-2a6372599aef.jpg?1593091380"),' +
      '( "Hold at Bay", "Instant", null, 4, "C", "https://c1.scryfall.com/file/scryfall-cards/large/front/f/f/ffeb407d-6a42-488a-9869-83da3047e45d.jpg?1593091497"),' +
      '( "Spirit of the Labyrinth", "Enchantment Creature", "Spirit", 4, "R", "https://c1.scryfall.com/file/scryfall-cards/large/front/f/4/f44e5128-e146-4e46-b313-a40d82719d1d.jpg?1593091571"),' +
      '( "Archetype of Imagination", "Enchantment Creature", "Human Wizard", 4, "U", "https://c1.scryfall.com/file/scryfall-cards/large/front/3/d/3de0f770-b62b-4a9d-bea7-6bb7bc2020ad.jpg?1593091610")' +
      'as new_data ' +
      'on duplicate key update ' +
      'cardName = new_data.cardName,' +
      'cardType = new_data.cardType,' +
      'creatureType = new_data.creatureType,' +
      'set_id = new_data.set_id,' +
      'rarity = new_data.rarity,' +
      'imgURL = new_data.imgURL'
  )
};
