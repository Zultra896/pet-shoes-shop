import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import styles from "../css/shoes.module.css";

const colorMap = {
  "Черный": "#000000",
  "Белый": "#FFFFFF",
  "Красный": "#FF0000",
  "Синий": "#0000FF",
  "Зеленый": "#008000",
  "Желтый": "#FFFF00",
  "Оранжевый": "#FFA500",
  "Фиолетовый": "#800080",
  "Серый": "#808080",
};

function Shoes() {
  const { id } = useParams();
  const [shoe, setShoe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/shoes/${id}`)
      .then(({ data }) => {
        // Проверяем, что colors приходит в правильном формате (массив)
        if (typeof data.colors === "string") {
          data.colors = JSON.parse(data.colors);
        }
        if (typeof data.sizes === "string") {
          data.sizes = JSON.parse(data.sizes);
        }
        setShoe(data);
      })
      .catch(() => setError("Ошибка загрузки данных"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className={styles.loading}>Загрузка...</p>;
  if (error) return <p className={styles.error}>{error}</p>;
  if (!shoe) return <p className={styles.notFound}>Данные не найдены</p>;

  return (
    <div className={styles.shoeCard}>
      <img src={shoe.image_url} alt={shoe.model} className={styles.shoeImage} />
      <h2 className={styles.shoeTitle}>{shoe.model}</h2>
      <p className={styles.shoeInfo}><strong>Бренд:</strong> {shoe.brand}</p>
      <p className={styles.shoeInfo}><strong>Материал:</strong> {shoe.material}</p>
      <p className={styles.shoePrice}><strong>Цена:</strong> {shoe.price}₸</p>

      {/* Отображение цветов */}
      <div className={styles.colorsContainer}>
        <p>Доступные цвета:</p>
        <div className={styles.colorCircles}>
          {shoe.colors?.length ? shoe.colors.map((color, index) => {
            const bgColor = colorMap[color] || "#ccc";
            return (
              <div
                key={index}
                className={styles.colorCircle}
                style={{ backgroundColor: bgColor }}
                aria-label={color}
                title={colorMap[color] ? color : `${color} (неизвестный цвет)`}
              />
            );
          }) : <p>Цвет не указан</p>}
        </div>
      </div>

      <p className={styles.sizes}>
        <strong>Размеры:</strong> {shoe.sizes?.length ? shoe.sizes.join(", ") : "Нет в наличии"}
      </p>
    </div>
  );
}

export default Shoes;
