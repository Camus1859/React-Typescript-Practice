import express, { Request, Response, NextFunction } from "express";
import cors from "cors";

type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  inStock: boolean;
};

let products: Product[] = [
  {
    id: "1",
    name: "Laptop",
    category: "electronics",
    price: 999,
    inStock: true,
  },
  {
    id: "2",
    name: "Headphones",
    category: "electronics",
    price: 79,
    inStock: true,
  },
  {
    id: "3",
    name: "Desk Chair",
    category: "furniture",
    price: 249,
    inStock: false,
  },
  {
    id: "4",
    name: "Monitor",
    category: "electronics",
    price: 349,
    inStock: true,
  },
  {
    id: "5",
    name: "Bookshelf",
    category: "furniture",
    price: 129,
    inStock: true,
  },
  {
    id: "6",
    name: "Keyboard",
    category: "electronics",
    price: 49,
    inStock: false,
  },
  {
    id: "7",
    name: "Standing Desk",
    category: "furniture",
    price: 599,
    inStock: true,
  },
  { id: "8", name: "Mouse", category: "electronics", price: 29, inStock: true },
];

const app = express();

app.use(express.json());
app.use(cors());

const logger = (req: Request, res: Response, next: NextFunction) => {
  console.log(`${req.method} ${req.path}`);
  next();
};

app.use(logger);

app.get("/api/products", (req, res, next) => {
  try {
    const { category } = req.query;

    if (category) {
      const subsetProducts = products.filter((p) => p.category === category);
      return res.status(200).json({ subsetProducts });
    } else {
      return res.status(200).json({ products });
    }
  } catch (e) {
    next(e);
  }
});

app.get("/api/products/:id", (req, res, next) => {
  try {
    const product = products.find((p) => p.id === req.params.id);
    if (!product) return res.status(404).send("Product not found");

    return res.status(200).json({ product });
  } catch (e) {
    next(e);
  }
});

app.post("/api/products", (req, res, next) => {
  try {
    const body = req.body;
    const newProduct: Product = {
      id: Math.random().toString(),
      ...body,
    };

    products = [...products, newProduct];
    return res.status(201).json({ product: newProduct });
  } catch (e) {
    next(e);
  }
});

app.delete("/api/products/:id", (req, res, next) => {
  try {
    const id = req.params.id;
    const product = products.find((p) => p.id === id);
    if (!product) return res.status(404).send("Product not found");

    products = products.filter((p) => p.id !== id);
    return res.status(200).json({ id });
  } catch (e) {
    next(e);
  }
});

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  res.status(500).json({ error: "Internal server error" });
};

app.use(errorHandler);

app.listen(3003, () => {
  console.log("products api running on 3003");
});
