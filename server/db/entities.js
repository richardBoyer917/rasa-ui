const db = require('./db');
const logger = require('../util/logger');

function getAllEntities(req, res, next) {
  logger.winston.info('Entities.getAllEntities');
  db.all('select * from entities', function(err, data) {
    if (err) {
      logger.winston.info(err);
    } else {
      res.status(200).json(data);
    }
  });
}

function getAllEntitiesForAgent(req, res, next) {
  logger.winston.info('Entities.getAllEntitiesForAgent');
  db.all('select * from entities where agent_id = ?', req.params.agent_id, function(err, data) {
    if (err) {
      logger.winston.info(err);
    } else {
      res.status(200).json(data);
    }
  });
}

function getSingleEntity(req, res, next) {
  logger.winston.info('Entities.getSingleEntity');
  db.get('select * from entities where entity_id = ?', req.params.entity_id, function(err, data) {
    if (err) {
      logger.winston.info(err);
    } else {
      res.status(200).json(data);
    }
  });
}

function createEntity(req, res, next) {
  logger.winston.info('Entities.createEntity');
  
  db.run('insert into entities(agent_id, entity_name, slot_data_type)' + 'values (?,?,?)', [req.body.agent_id, req.body.entity_name, req.body.slot_data_type], function(err) {
    if (err) {
      logger.winston.info("Error inserting a new record");
    } else {
      res.status(200).json({ status: 'success', message: 'Inserted' });
    }
  });
}

function updateEntity(req, res, next) {
  logger.winston.info('entities.updateEntity');

  db.run('update entities set entity_name = ?, slot_data_type = ? where entity_id = ?', [req.body.entity_name, req.body.slot_data_type, req.params.entity_id], function(err) {
    if (err) {
      logger.winston.info("Error updating the record");
    } else {
      res.status(200).json({ status: 'success', message: 'Updated' });
    }
  });
}

function removeEntity(req, res, next) {
  logger.winston.info('entities.updateEntity');
  db.run('delete from entities where entity_id = ?', req.params.entity_id, function(err) {
    if (err) {
      logger.winston.info("Error removing the record");
    } else {
      res.status(200).json({ status: 'success', message: 'Removed' });
    }
  });
}

module.exports = {
  getAllEntities,
  getAllEntitiesForAgent,
  getSingleEntity,
  createEntity,
  updateEntity,
  removeEntity
};
