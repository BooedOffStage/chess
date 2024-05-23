"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameManager = void 0;
const game_1 = require("./game");
const messages_1 = require("./messages");
class GameManager {
    constructor() {
        this.games = [];
        this.pendingUser = null;
        this.users = [];
    }
    addUser(socket) {
        this.users.push(socket);
        this.handleInit(socket);
    }
    removeUser(socket) {
        //logic to remove user;
        this.users.filter((user) => user !== socket);
    }
    handleInit(socket) {
        try {
            socket.on("message", (data) => {
                const msg = JSON.parse(data.toString());
                console.log(msg);
                if (msg.t === messages_1.INIT_GAME && this.pendingUser !== null) {
                    console.log("init game" + msg.t);
                    const game = new game_1.Game(this.pendingUser, socket);
                    this.games.push(game);
                    this.pendingUser = null;
                }
                else if (msg.t === messages_1.INIT_GAME) {
                    console.log("user added to pending user");
                    this.pendingUser = socket;
                }
                else if (msg.t === messages_1.MOVE) {
                    console.log("move1" + msg.d.m);
                    const game = this.games.find((game) => game.player1 === socket || game.player2 === socket);
                    if (game) {
                        game.makeMove(socket, msg.d.m);
                    }
                    else {
                        socket.send(JSON.stringify({
                            t: "error",
                            d: {
                                message: "Game not found",
                            },
                        }));
                    }
                }
            });
        }
        catch (e) {
            console.log(e.message);
        }
    }
}
exports.GameManager = GameManager;
