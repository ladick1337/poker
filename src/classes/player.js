var sqlite3 = require('sqlite3');

var db = new sqlite3.Database('./database.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) return console.error(err,nessage);

    console.log('con suc');
});


db.run(
  `CREATE TABLE IF NOT EXISTS players(id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT, matches INTEGER, wins INTEGER)`
);
const Player = function (playerName, socket, debug) {
  this.username = playerName;
  this.pmatches = 0;
  this.pwins = 0;

  let sql = `SELECT * FROM players WHERE name='${this.username}'`;

  db.all(sql, [], (err,rows) => {
    let RowData = [];
    if(err) {
      sql = `INSERT INTO players (name, matches, wins)
              VALUES(?,?,?)
      `;
      db.run(
        sql,
        [this.username,0,0],
        (err) => {
          if(err) return console.error(err.message);
    
          console.log('A new player has added');
        }
      );
      return console.error(err.message);
    } 

    console.log('RowDataL: '+RowData.length);

    rows.forEach((row)=>{
      RowData.push(row);
    });
    
    console.log('RowDataL: '+RowData.length);

    if(RowData.length == 0){
      sql = `INSERT INTO players (name, matches, wins)
      VALUES(?,?,?)
      `;
      db.run(
      sql,
      [this.username,0,0],
      (err) => {
        if(err) return console.error(err.message);

        console.log('A new player has added');
      }
      );
    }




    
    rows.forEach((row)=>{
      this.pmatches = row.matches;
      this.pwins = row.wins;
    });

    sql = `UPDATE players SET matches = ? WHERE name='${this.username}'`
    db.run(
      sql,
      [this.pmatches+1],
      (err) => {
        if(err) return console.error(err.message);
  
        console.log(this.username + ' matchess++');

        sql = `SELECT * FROM players`;

        db.all(sql, [], (err,rows) => {
          if(err) return console.error(err.message);

          rows.forEach((row)=>{
            console.log(row);
          });
        })
      }
    );
    
  })

  

  // sql = `SELECT * FROM players`;

  // db.all(sql, [], (err,rows) => {
  //   if(err) return console.error(err.message);

  //   rows.forEach((row)=>{
  //     console.log(row);
  //   });
  // })

  

  
  this.cards = [];
  this.socket = socket;
  this.currentCard = null;
  this.money = 100;
  this.buyIns = 0;
  this.status = '';
  this.blindValue = '';
  this.dealer = false;
  this.allIn = false;
  this.goAgainStatus = false;
  this.debug = debug || false;

  this.addCard = (card) => {
    this.cards.push(card);
  };

  this.log = () => {
    if (this.debug) {
      console.log(...arguments);
    }
  };

  this.setStatus = (data) => (this.status = data);
  this.setBlind = (data) => (this.blindValue = data);
  this.setDealer = (data) => (this.dealer = data);
  this.getUsername = () => {
    return this.username;
  };
  this.getBuyIns = () => {
    return this.buyIns;
  };
  this.getMoney = () => {
    return this.money;
  };
  this.getStatus = () => {
    return this.status;
  };
  this.getBlind = () => {
    return this.blindValue;
  };
  this.getDealer = () => {
    return this.dealer;
  };
  this.getPmatches = () => {
    return this.pmatches;
  };
  this.getPwins = () => {
    return this.pwins;
  };

  this.emit = (eventName, payload) => {
    this.socket.emit(eventName, payload);
  };
};

module.exports = Player;
