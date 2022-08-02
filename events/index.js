const difference = require('lodash/difference');

const EVENTS = {
  COMMAND_BILLING_CREATE: 'billing.create',
  COMMAND_BILLING_ADD_SEAT: 'billing.add-seat',
  COMMAND_BILLING_REMOVE_SEAT: 'billing.remove-seat',

  COMMAND_EMAIL_SEND: 'email.send',

  CHAT_CREATED: 'chat.created',
  CHAT_UPDATED: 'chat.updated',

  CLIENT_CREATED: 'client.created',
  CLIENT_UPDATED: 'client.updated',

  PARTICIPANT_JOINED: 'chat-participant.joined',
  PARTICIPANT_UPDATED: 'chat-participant.updated',
  PARTICIPANT_TYPING_END: 'chat-participant.typing-end',
  PARTICIPANT_TYPING: 'chat-participant.typing',

  MESSAGE_CREATED: 'chat-message.created',
  MESSAGE_COMPOSED: 'chat-message.composed',

  SUGGESTION_CREATED: 'suggestion.created',
  SUGGESTION_CHOSEN: 'suggestion.chosen',
  SUGGESTION_DELETED: 'suggestion.deleted',

  STATUS_UPDATED: 'status.updated',
  /**
   * Used to emit all current statuses to clients when they connect over the websocket
   */
  STATUS_ALL: 'status.all',

  NOTIFICATION_DELETED: 'notification.deleted',

  INTEGRATION_ACTIVATED: 'integration.activated',
  INTEGRATION_REVOKED: 'integration.revoked',
};

const blacklist = [
  EVENTS.COMMAND_BILLING_CREATE,
  EVENTS.COMMAND_BILLING_ADD_SEAT,
  EVENTS.COMMAND_BILLING_REMOVE_SEAT,
  EVENTS.COMMAND_EMAIL_SEND,
  EVENTS.INTEGRATION_ACTIVATED,
  EVENTS.INTEGRATION_REVOKED,
  EVENTS.SUGGESTION_CREATED,
  EVENTS.MESSAGE_COMPOSED,
];

module.exports = JSON.parse(JSON.stringify(EVENTS));
module.exports.getPublicEvents = () => {
  return difference(Object.values(EVENTS), blacklist);
};
