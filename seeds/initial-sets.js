/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  return knex.raw(
      'insert into sets ( setName, fullName, releaseDate )' +
      'values ' +
      '( "RTR", "Return to Ravnica", 1336780800 ),' +
      '( "GTC", "Gatecrash", 1359676800 ),' +
      '( "THS", "Theros", 1380240000 ),' +
      '( "BNG", "Born of the Gods", 1404259200 )' +
      'as new_data ' +
      'on duplicate key update ' +
      'setName = new_data.setName,' +
      'fullName = new_data.fullName,' +
      'releaseDate = new_data.releaseDate'
  )
};
