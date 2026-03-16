import express, { Request, Response, NextFunction } from "express";
import cors from "cors";

const app = express();

const myLogger = (req: Request, res: Response, next: NextFunction) => {
  console.log(req.method);
  console.log(req.path);
  console.log(Date.now().toString());
  next();
};

const myErrorCatcher = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  res.status(500).json({ error: "Internal server error" });
};

app.use(express.json());
app.use(myLogger);
app.use(cors());

type UsersType = {
  name: string;
  email: string;
  id: string;
};

let users: UsersType[] = [
  { name: "Anderson", email: "anderson@test.com", id: "1" },
  { name: "Maria", email: "maria@test.com", id: "2" },
  { name: "James", email: "james@test.com", id: "3" },
];

app.get("/api/health", async (req, res, next) => {
  try {
    return res.status(200).json({ users });
  } catch (e) {
    next(e);
  }
});

app.get("/api/users/:id", async (req, res, next) => {
  try {
    const id = req.params.id;

    const user = users.find((u) => u.id === id);
    return res.status(200).json({ user });
  } catch (e) {
    next(e);
  }
});

app.get("/api/users", async (req, res, next) => {
  try {
    return res.status(200).json({ users });
  } catch (e) {
    next(e);
  }
});

app.post("/api/users", async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const id = Math.random().toString();
    users.push({ name, email, id });
    return res.status(201).json({ id });
  } catch (e) {
    next(e);
  }
});

app.put("/api/users/:id", async (req, res, next) => {
  try {
    const userId = req.params.id;
    const { name, email } = req.body;

    const hasUser = users.find((u) => u.id === userId);
    if (!hasUser) return res.status(404).send("User not found");

    const updatedUser = users.map((user) => {
      return user.id === userId ? { ...user, name, email } : user;
    });
    users = updatedUser;

    return res.status(201).json({ user: updatedUser });
  } catch (e) {
    next(e);
  }
});

app.delete("/api/users/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const hasUser = users.find((u) => u.id === id);
    if (!hasUser) return res.status(404).send("User not found");

    users = users.filter((u) => u.id !== id);
    return res.status(200).json({ id });
  } catch (e) {
    next(e);
  }
});

app.get("/api/posts", async (req, res, next) => {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    if (!response.ok) throw new Error("Unable to fetch data");

    const data = await response.json();

    return res.status(200).json(data.slice(0, 10));
  } catch (e) {
    next(e)
  }
});

app.use(myErrorCatcher);

app.listen(3001, () => {
  console.log("port running on 3001");
});
