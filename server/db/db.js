const sqlite3 = require('sqlite3').verbose();
const logger = require('../util/logger');

let db = new sqlite3.Database("server/data/db.sqlite3", (err) => { 
  if (err) { 
    logger.winston.info('Error when connecting to the Database.', err) 
  } else { 
    logger.winston.info('Database connected!');
    checkDBSchema();
  } 
})

function checkDBSchema() {
  //Get version of DB Schema from version table, if != to version, suggest upgrade
  db.all("SELECT version from version", function(err, rows) {
    if (err && err.errno == 1) {
      createDBSchema();
    } else {
      if (rows[0].version == global.db_schema) {
        logger.winston.info("Schema version (" + rows[0].version + ") matches package.json schema version (" + global.db_schema + ")"); 
      } else {
        logger.winston.info("Schema version (" + rows[0].version + ") DOES NOT match package.json schema version (" + global.db_schema + ")");
        logger.winston.info("Please upgrade your schema");
      }
    }
  });
  //
}

function createDBSchema() {
  try {
    logger.winston.info("------------------------- Starting to create DB schema -------------------------");
    db.run("CREATE TABLE IF NOT EXISTS version(version)", setDBSchemaVersion); 
    db.run("CREATE TABLE IF NOT EXISTS bots (bot_id INTEGER PRIMARY KEY AUTOINCREMENT, bot_name TEXT, bot_config TEXT, output_folder TEXT)");
    db.run("CREATE TABLE IF NOT EXISTS intents (intent_id INTEGER PRIMARY KEY AUTOINCREMENT, intent_name TEXT, bot_id INTEGER)");
    db.run("CREATE TABLE IF NOT EXISTS synonyms (synonym_id INTEGER PRIMARY KEY AUTOINCREMENT, synonym_reference TEXT, regex_pattern TEXT, bot_id INTEGER)");
    db.run("CREATE TABLE IF NOT EXISTS entities (entity_id INTEGER PRIMARY KEY AUTOINCREMENT, entity_name TEXT, slot_data_type TEXT, bot_id INTEGER)");
    db.run("CREATE TABLE IF NOT EXISTS expressions (expression_id INTEGER PRIMARY KEY AUTOINCREMENT, expression_text TEXT, intent_id INTEGER)");
    db.run("CREATE TABLE IF NOT EXISTS expression_parameters (parameter_id INTEGER PRIMARY KEY AUTOINCREMENT, parameter_start INTEGER, parameter_end INTEGER, parameter_value TEXT, expression_id INTEGER, intent_id INTEGER, entity_id INTEGER)");
    db.run("CREATE TABLE IF NOT EXISTS regex (regex_id INTEGER PRIMARY KEY AUTOINCREMENT, regex_name TEXT, regex_pattern TEXT, bot_id INTEGER)");
    db.run("CREATE TABLE IF NOT EXISTS responses (response_id INTEGER PRIMARY KEY AUTOINCREMENT, response_text TEXT, response_type TEXT, action_id INTEGER)");
    db.run("CREATE TABLE IF NOT EXISTS synonym_variants (synonym_variant_id INTEGER PRIMARY KEY AUTOINCREMENT, synonym_value TEXT, synonym_id INTEGER)");
    db.run("CREATE TABLE IF NOT EXISTS nlu_log (log_id INTEGER PRIMARY KEY AUTOINCREMENT, ip_address TEXT, query TEXT, event_type TEXT, event_data TEXT, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP)");
    db.run("CREATE TABLE IF NOT EXISTS models (model_id INTEGER PRIMARY KEY AUTOINCREMENT, model_name TEXT, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP, comment TEXT, bot_id INTEGER, local_path TEXT, server_path TEXT, server_response TEXT)");
    db.run("CREATE TABLE IF NOT EXISTS actions (action_id INTEGER PRIMARY KEY AUTOINCREMENT, action_name TEXT, bot_id INTEGER)");
    db.run("CREATE TABLE IF NOT EXISTS stories (story_id INTEGER PRIMARY KEY AUTOINCREMENT, story_name TEXT, story TEXT, bot_id INTEGER, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP)");
    
    db.run("CREATE TABLE IF NOT EXISTS settings (setting_name TEXT, setting_value TEXT)", function() {
      db.run("INSERT into settings (setting_name, setting_value) values ('refresh_time', '60000')"); 
    });
  } catch (err) {
    console.log(err); 
  }
}

function setDBSchemaVersion() {
  db.run("INSERT into version (version) values (?)", global.db_schema);
  logger.winston.info("Database Schema v" + global.db_schema + " created"); 
}

module.exports = db; 