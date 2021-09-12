import { sign } from "jsonwebtoken";
import { pool } from "./db";
import { ExpressFn } from "./types";

// TODO hash password

export const register: ExpressFn = async (req, res) => {
  const { username, password } = req.body;
  const SQL = "insert into users(username, pword) values ($1, $2)";
  try {
    await pool.query(SQL, [username, password]);
    console.log("user successfully created");
  } catch (error) {
    console.error("Error: ", error.message);
  }
  res.status(202).json({});
};

export const login: ExpressFn = async (req, res) => {
  const { username, password } = req.body;
  const SQL = "select * from users where username = $1 and pword = $2";

  try {
    const data = await pool.query(SQL, [username, password]);
    const user = data.rows[0];

    if (user) {
      res.cookie(
        "lid",
        sign({ userId: user.id }, "hello kitty", {
          expiresIn: "7d",
        })
      );
      res.status(202).json({
        success: true,
        accessToken: sign({ userId: user.id }, "hello kitty", {
          expiresIn: "45m",
        }),
      });
    } else {
      res.status(202).json({ success: false });
    }
  } catch (error) {
    console.error("Error: ", error.message);
    res.status(202).json({ success: false });
  }
};
