const logger = require('../util/_logger');

/** Class representing a game */
module.exports = class Game {
  /**
   * constructor - Creates a new Game
   *
   * @param  {String} { name } The name of the game
   * @return {undefined}
   */
  constructor({ name }) {
    this.name = name;
    this.clients = [];
    this.users = [];
    this.votes = {};
  }
  /**
   * addUser - Adds a user to the game
   *
   * @return {undefined}
   */
  addUser(user) {
    this.clients.push(user);
    this.users.push(user);
  }
  /**
   * broadcast - Sends the provided message to all matching clients
   *
   * @param  {String}    data    The message to send
   * @return {undefined}
   */
  broadcast(data) {
    this.clients.forEach(client => client.sendMessage(data));
  }
  /**
   * revokeVote - Revokes a vote
   *
   * @param  {String} { nickname } The nickname of the User whose vote is being revoked
   * @return {undefined}
   */
  revokeVote({ nickname }) {
    delete this.votes[nickname];
    this.broadcast(JSON.stringify({
      type: 'clientRevoke',
      data: { votes: this.votes },
    }));
  }
  /**
   * hasUser - Checks if a nickname is present on a User in this Game
   *
   * @param  {type}  { nickname } The nickname of the User to check for existence of
   * @return {Boolean}            Whether the nickname is already in use
   */
  hasUser({ nickname }) {
    return this.users.map(user => user.nickname).includes(nickname);
  }

  /**
   * disconnectUser - Disconnects a given user.
   *
   * @return {undefined}
   */
  disconnectUser(nickname) {
    // Filter out the user that disconnected from the user list.
    this.users = this.users
      .filter(user => user.nickname !== nickname);
    // Filter out the client reference for the user that disconnected from the user list.
    this.clients = this.clients
      .filter(user => user.nickname !== nickname);
    // Remove any votes cast by disconnected user.
    this.revokeVote({ nickname });

    this.broadcast(JSON.stringify({
      type: 'clientDisconnect',
      data: { users: this.users },
    }));
    logger.info(`${nickname} disconnected`);
  }
};
