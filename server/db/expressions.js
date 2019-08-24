const db = require('./db');
const logger = require('../util/logger');

function getSingleExpression(req, res, next) {
  logger.winston.info('expression.getSingleExpression');

  db.get('select * from expressions where expression_id = ?', req.params.expression_id, function(err, data) {
    if (err) {
      logger.winston.info(err);
    } else {
      res.status(200).json(data);
    }
  });
}

function getIntentExpressions(req, res, next) {
  logger.winston.info('expression.getIntentExpressions');
  db.all('select * from expressions where intent_id = ?', req.params.intent_id, function(err, data) {
    if (err) {
      logger.winston.info(err);
    } else {
      res.status(200).json(data);
    }
  });
}

function getIntentExpressionQuery(req, res, next) {
  logger.winston.info('expression.getIntentExpressionQuery');
  db.all('select * from expressions where intent_id in (?)', req.query.intent_ids, function(err, data) {
    if (err) {
      logger.winston.info(err);
    } else {
      res.status(200).json(data);
    }
  });
}

function createIntentExpression(req, res, next) {
  logger.winston.info('expressions.createIntentExpression');
  db.run('insert into expressions(intent_id, expression_text)' + 'values (?,?)', [req.body.intent_id, req.body.expression_text], function(err) {
    if (err) {
      logger.winston.info("Error inserting a new record");
    } else {
      res.status(200).json({ status: 'success', message: 'Inserted' });
    }
  });
}

function removeExpression(req, res, next) {
  logger.winston.info('expressions.removeExpression');
  db.run('delete from expressions where expression_id = ?', req.params.expression_id, function(err) {
    if (err) {
      logger.winston.info("Error removing the record");
    } else {
      res.status(200).json({ status: 'success', message: 'Removed' });
    }
  });
}

function updateExpression(req, res, next) {
  logger.winston.info('expressions.updateExpressionEndpoint');
  db.run('update expressions set expression_text = ? where expression_id = ?', [req.body.expression_text, req.body.expression_id], function(err) {
    if (err) {
      logger.winston.info("Error updating the record");
    } else {
      res.status(200).json({ status: 'success', message: 'Updated' });
    }
  });
}

module.exports = {
  getSingleExpression,
  getIntentExpressions,
  createIntentExpression,
  removeExpression,
  getIntentExpressionQuery,
  updateExpression};
