CREATE DATABASE base1;

USE base1;

-- Таблица брендов
CREATE TABLE brands (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) UNIQUE NOT NULL -- Nike, Adidas и т. д.
);

-- Таблица цветов
CREATE TABLE colors (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(30) UNIQUE NOT NULL -- Черный, Белый, Красный и т. д.
);

-- Таблица материалов
CREATE TABLE materials (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) UNIQUE NOT NULL -- Кожа, Текстиль, Синтетика и т. д.
);

-- Таблица размеров
CREATE TABLE sizes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    size DECIMAL(4,1) UNIQUE NOT NULL -- 40.5, 41, 42 и т. д.
);

-- Таблица обуви (основная)
CREATE TABLE shoes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    brand_id INT NOT NULL, -- Связь с таблицей брендов
    model VARCHAR(100) NOT NULL, -- Название модели (Air Max, Superstar и т. д.)
    color_id INT NOT NULL, -- Связь с таблицей цветов
    material_id INT NOT NULL, -- Связь с таблицей материалов
    gender ENUM('men', 'women', 'unisex') NOT NULL, -- Категория обуви
    price DECIMAL(10,2) NOT NULL, -- Цена
    description TEXT, -- Описание обуви
    image_url VARCHAR(500), -- Ссылка на изображение обуви
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Дата добавления
    FOREIGN KEY (brand_id) REFERENCES brands(id),
    FOREIGN KEY (color_id) REFERENCES colors(id),
    FOREIGN KEY (material_id) REFERENCES materials(id)
);

-- Таблица связки обуви с размерами и количеством на складе
CREATE TABLE shoes_sizes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    shoe_id INT NOT NULL, -- ID обуви
    size_id INT NOT NULL, -- ID размера
    stock INT DEFAULT 0, -- Количество на складе
    FOREIGN KEY (shoe_id) REFERENCES shoes(id) ON DELETE CASCADE,
    FOREIGN KEY (size_id) REFERENCES sizes(id) ON DELETE CASCADE
);

CREATE TABLE shoes_colors (
    id INT PRIMARY KEY AUTO_INCREMENT,
    shoe_id INT NOT NULL, -- ID обуви
    color_id INT NOT NULL, -- ID цвета
    FOREIGN KEY (shoe_id) REFERENCES shoes(id) ON DELETE CASCADE,
    FOREIGN KEY (color_id) REFERENCES colors(id) ON DELETE CASCADE
);


# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
