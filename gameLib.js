function GameServer() {
    this._connections = {};
    this.id = "";
    this.pjs = {
         peer: {}
    };
    
    this.handleData = (id, data) => {
        console.error("\"handleData\" not handled")
    };


    this.create = (id) => {
        console.log("Creating gameServer with id " + id);
        this.id = id;
        this.pjs.peer = new Peer("dirk-gameserver-" + id);

        this.pjs.peer.on('open', (id) => {
            console.log('My peer ID is: ' + id);
        });

        this.pjs.peer.on('connection', (conn) => {
            conn.on('open', () => {
                this._connections[conn.peer] = conn;
            });

            conn.on('close', () => {
                delete this._connections[conn.peer]
            });
            
            conn.on('data', (data) => {
                this.handleData(conn.peer, data);
                console.log(data);
            });
        });
    };

    this.send = (id, data) => {
        if(!(id in this._connections)) {
            return false
        }
        this._connections[id].send(data);
    };

    this.sendToAll = (data) => {
        for (let connId in this._connections) {
            this._connections[connId].send(data);
        }
    };
}

function GameClient() {
    this.id = "";
    this._connection = {};
    this._peer = new Peer();

    this.handleData = (data) => {
        console.error("\"handleData\" not handled")
    };

    this.connect = (id) => {

        this._connection = this._peer.connect("dirk-gameserver-" + id);

        return new Promise((resolve, reject) => {
            this._connection.on('open', (id) => { resolve(id) });
            this._peer.on('error', (error) => { reject(error)});
        });
    };

    this.send = (data) => {
        this._connection.send(data);
    };

    this._peer.on('open', (id) => {
        this.id = id;
        console.log('My peer ID is: ' + id);

        this._connection.on('open', () => {
            // Receive messages
            this._connection.on('data', (data) => {
                //console.log('Received', data);
                this.handleData(data);
            });
         });
    });    


}