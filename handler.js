"use strict";

const uuid = require("uuid");
const AWS = require("aws-sdk");

// comment or remove when deploying
const dynamoDB = new AWS.DynamoDB.DocumentClient({
  // region: "localhost",
  // endpoint: "http://localhost:8000"
});

module.exports.create = (event, context, callback) => {
  // create a note and save it into dynamoDB
  const data = JSON.parse(event.body);
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Item: { id: uuid.v1(), content: data.content },
  };

  dynamoDB.put(params, error => {
    if (error) {
      return callback(null, {
        statusCode: error.statusCode || 500,
        headers: { "Content-Type": "text/plain" },
        body: `Couldn't create note. ${error.message}`
      });
    }
    callback(null, { statusCode: 200, body: JSON.stringify(params.Item) })
  });

  
};

module.exports.getOne = (event, context, callback) => {
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: { id: event.pathParameters.id }
  }

  dynamoDB.get(params, (error, result) => {
    if (error) {
      return callback(null, {
        statusCode: error.statusCode || 500,
        headers: { "Content-Type": "text/plain" },
        body: `Couldn't create note. ${error.message}`
      });
    }
    callback(null, { statusCode: 200, body: JSON.stringify(result.Item) })
  })
};

module.exports.getAll = (event, context, callback) => {
  const params = { TableName: process.env.DYNAMODB_TABLE, }
  dynamoDB.scan(params, (error, result) => {
    if (error) {
      return callback(null, {
        statusCode: error.statusCode || 500,
        headers: { "Content-Type": "text/plain" },
        body: `Couldn't create note. ${error.message}`
      });
    }
    callback(null, { statusCode: 200, body: JSON.stringify(result.Items) })
  })
};

module.exports.update = (event, context, callback) => {
  const data = JSON.parse(event.body)
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: { id: event.pathParameters.id },
    ExpressionAttributeValues: { ":content": data.content },
    UpdateExpression: "SET content = :content",
    ReturnValues: 'ALL_NEW'
  }
  dynamoDB.update(params, (error, result) => {
    if (error) {
      return callback(null, {
        statusCode: error.statusCode || 500,
        headers: { "Content-Type": "text/plain" },
        body: `Couldn't update note. ${error.message}`
      });
    }
    callback(null, { statusCode: 200, body: JSON.stringify(result.Attributes) })
  })
};

module.exports.delete = (event, context, callback) => {
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: { id: event.pathParameters.id }
  }

  dynamoDB.delete(params, error => {
    if (error) {
      return callback(null, {
        statusCode: error.statusCode || 500,
        headers: { "Content-Type": "text/plain" },
        body: `Couldn't delete note. ${error.message}`
      });
    }
    callback(null, { statusCode: 200, body: JSON.stringify(`Removed note with id ${event.pathParameters.id}`) })
  })
};
