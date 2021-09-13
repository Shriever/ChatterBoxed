import { createAccessToken, createRefreshToken } from "./auth";
import { pool } from "./db";
import { ExpressFn } from "./types";

// TODO hash password

export const register: ExpressFn = async (req, res) => {
  const { username, password } = req.body;
  const SQL = "insert into users(username, pword) values ($1, $2) returning *";
  try {
    const data = await pool.query(SQL, [username, password]);
    const user = data.rows[0];
    console.log(user);

    res.cookie("lid", createRefreshToken({ username, id: user.id }));
    res.json({
      accessToken: createAccessToken({ id: user.id, username }),
    });
    console.log("user successfully created");
  } catch (error) {
    console.error("Error: ", error.message);
    res.status(202).json({});
  }
};

export const login: ExpressFn = async (req, res) => {
  const { username, password } = req.body;
  const SQL = "select * from users where username = $1 and pword = $2";

  try {
    const data = await pool.query(SQL, [username, password]);
    const user = data.rows[0];

    if (user) {
      res.cookie("lid", createRefreshToken({ username, id: user.id }), {
        httpOnly: true,
        path: "/refresh_token",
      });
      res.json({
        accessToken: createAccessToken({ id: user.id, username }),
      });
    } else {
      res.status(202).json(null);
    }
  } catch (error) {
    console.error("Error: ", error.message);
    res.status(202).json(null);
  }
};
