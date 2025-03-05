const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
const port = 5000;

app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "123123",
    database: "base1",
});

db.connect((err) => {
    if (err) {
        console.error("Ошибка подключения к базе данных:", err);
    } else {
        console.log("Подключено к базе данных!");
    }
});

// Каталог с фильтрацией и поиском
app.get("/api/shoes", (req, res) => {
    let { brand, color, material, size, search } = req.query;

    let query = `
        SELECT DISTINCT s.id, s.model, s.price, s.image_url,
               b.name AS brand, c.name AS color, m.name AS material
        FROM shoes s
        JOIN brands b ON s.brand_id = b.id
        JOIN colors c ON s.color_id = c.id
        JOIN materials m ON s.material_id = m.id
        LEFT JOIN shoes_sizes ss ON s.id = ss.shoe_id
        LEFT JOIN sizes sz ON ss.size_id = sz.id
        WHERE 1=1
    `;

    let params = [];

    // ✅ Фильтр для бренда
    if (brand) {
        let brandList = brand.split(","); // Разделяем в массив (если приходит "Nike,Adidas")
        query += ` AND b.name IN (${brandList.map(() => "?").join(",")})`;
        params.push(...brandList);
    }

    // ✅ Фильтр для цвета
    if (color) {
        let colorList = color.split(",");
        query += ` AND c.name IN (${colorList.map(() => "?").join(",")})`;
        params.push(...colorList);
    }

    // ✅ Фильтр для материала
    if (material) {
        let materialList = material.split(",");
        query += ` AND m.name IN (${materialList.map(() => "?").join(",")})`;
        params.push(...materialList);
    }

    // ✅ Фильтр для размера (по связанной таблице)
    if (size) {
        let sizeList = size.split(",");
        query += ` AND sz.size IN (${sizeList.map(() => "?").join(",")})`;
        params.push(...sizeList);
    }

    // ✅ Поиск по названию модели
    if (search) {
        query += " AND s.model LIKE ?";
        params.push(`%${search}%`);
    }

    console.log("SQL Query:", query);
    console.log("Params:", params);

    db.execute(query, params, (err, results) => {
        if (err) {
            console.error("Ошибка SQL:", err);
            return res.status(500).json({ message: "Ошибка сервера", error: err });
        }
        res.json(results);
    });
});


app.get("/api/shoes/:id", (req, res) => {
    const { id } = req.params;

    const query = `
       SELECT 
            s.id, 
            s.model, 
            s.price, 
            s.image_url, 
            s.description,
            s.gender,
            b.name AS brand, 
            CONCAT('[', GROUP_CONCAT(DISTINCT CONCAT('"', c.name, '"') SEPARATOR ','), ']') AS colors,  
            m.name AS material, 
            CONCAT('[', GROUP_CONCAT(DISTINCT sz.size SEPARATOR ','), ']') AS sizes   
        FROM shoes s
        JOIN brands b ON s.brand_id = b.id
        JOIN materials m ON s.material_id = m.id
        LEFT JOIN shoes_colors sc ON s.id = sc.shoe_id
        LEFT JOIN colors c ON sc.color_id = c.id
        LEFT JOIN shoes_sizes ss ON s.id = ss.shoe_id
        LEFT JOIN sizes sz ON ss.size_id = sz.id
        WHERE s.id = ?
        GROUP BY s.id, s.gender, b.name, m.name;
    `;

    db.execute(query, [id], (err, results) => {
        if (err) {
            console.error("Ошибка SQL:", err);
            return res.status(500).json({ message: "Ошибка сервера", error: err });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "Обувь не найдена" });
        }

        res.json(results[0]);
    });
});




// Получение списка брендов
app.get("/api/brands", (req, res) => {
    db.execute("SELECT name FROM brands", (err, results) => {
        if (err) {
            res.status(500).json({ message: "Ошибка сервера", error: err });
        } else {
            res.json(results.map(row => row.name));
        }
    });
});

// Получение списка цветов
app.get("/api/colors", (req, res) => {
    db.execute("SELECT name FROM colors", (err, results) => {
        if (err) {
            res.status(500).json({ message: "Ошибка сервера", error: err });
        } else {
            res.json(results.map(row => row.name));
        }
    });
});

// Получение списка материалов
app.get("/api/materials", (req, res) => {
    db.execute("SELECT name FROM materials", (err, results) => {
        if (err) {
            res.status(500).json({ message: "Ошибка сервера", error: err });
        } else {
            res.json(results.map(row => row.name));
        }
    });
});

// Получение списка размеров
app.get("/api/sizes", (req, res) => {
    db.execute("SELECT size FROM sizes", (err, results) => {
        if (err) {
            res.status(500).json({ message: "Ошибка сервера", error: err });
        } else {
            res.json(results.map(row => row.size));
        }
    });
});

app.get("/api/filters", (req, res) => {
    const queries = {
        brands: "SELECT DISTINCT name FROM brands",
        colors: "SELECT DISTINCT name FROM colors",
        materials: "SELECT DISTINCT name FROM materials",
        sizes: "SELECT DISTINCT size FROM sizes",
    };

    const results = {};

    const executeQuery = (key, query) =>
        new Promise((resolve, reject) => {
            db.execute(query, [], (err, rows) => {
                if (err) reject(err);
                results[key] = rows.map((row) => Object.values(row)[0]);
                resolve();
            });
        });

    Promise.all(Object.entries(queries).map(([key, query]) => executeQuery(key, query)))
        .then(() => res.json(results))
        .catch((err) => res.status(500).json({ message: "Ошибка при загрузке фильтров", error: err }));
});


app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`);
});