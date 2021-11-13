const { Pool } = require('pg');
const { config } = require('./commons');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || config.connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});

module.exports = class BClicker {
  static init() {
    return pool.query(
      `
        DROP TABLE IF EXISTS player;
        CREATE TABLE player (
          id SERIAL NOT NULL,
          userId VARCHAR(10) NOT NULL,
          point INT NOT NULL,
          PRIMARY KEY (id, userId)
        );
      `,
    );
  }

  static createUser(userId, point) {
    return pool.query(
      `
          INSERT INTO player
            (userId, point)
          VALUES
            ($1, $2)
        `,
      [userId, point],
    );
  }

  static extractInfo(result) {
    const rows = result.rows[0];
    return [rows.userid, rows.point];
  }

  static getUserInfo(userId) {
    return pool.query(
      `
      SELECT * FROM player WHERE userId = $1  
      `,
      [userId],
    )
      .then(BClicker.extractInfo);
  }

  static updateUserPoint(point, userId) {
    return pool.query(
      `
      UPDATE player SET point = $1 WHERE userId = $2 RETURNING *
      `,
      [point, userId],
    )
    .then(BClicker.extractInfo);
  }
}