import { fileURLToPath } from "url";
import path from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";

// Получение пути и имени директории
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
    mode: "development", // Режим разработки
    entry: "./src/index.js", // Точка входа
    output: {
        path: path.resolve(__dirname, "dist"), // Путь к выходной директории
        filename: "main.[contenthash].js", // Уникальное имя для main.js
        clean: true, // Очищает dist перед каждой сборкой
        publicPath: "/", // Убедитесь, что publicPath указан
    },
    module: {
        rules: [
            // Настройка для JavaScript-файлов
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader",
            },
            // Настройка для CSS-файлов
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"],
            },
            // Настройка для изображений (asset/resource)
            {
                test: /\.(png|jpe?g|gif|svg)$/i,
                type: "asset/resource", // Используем asset modules для обработки изображений
                generator: {
                    filename: "images/[name].[contenthash][ext]", // Уникальное имя для изображений
                },
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "src", "index.html"), // Шаблон HTML
        }),
    ],
    devServer: {
        static: {
            directory: path.join(__dirname, "dist"), // Указываем директорию для статических файлов
        },
        historyApiFallback: true, // Включаем поддержку клиентской маршрутизации
        open: true, // Автоматически открывать браузер
    },
};