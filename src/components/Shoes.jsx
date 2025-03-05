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

  const [selectedSize, setSelectedSize] = useState(null);

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

  useEffect(() => {
    if (shoe?.sizes?.length) {
      setSelectedSize(shoe.sizes[0]); // Устанавливаем первый размер после загрузки
    }
  }, [shoe]);

  if (loading) return <p className={styles.loading}>Загрузка...</p>;
  if (error) return <p className={styles.error}>{error}</p>;
  if (!shoe) return <p className={styles.notFound}>Данные не найдены</p>;

  return (
    <div className={styles.div}>
      <div className={styles.container}>
        <h1 className={styles.title}>{shoe.model}</h1>
        <div className={styles.block}>
          <div className={styles.block1}>
            <div className={styles.poster}>
              <img className={styles.img} src={shoe.image_url} alt={shoe.model}/>
            </div>
            <div className={styles.info}>
              <div className={styles.itemInfo}>
                <p className={styles.shoeInfo}>{shoe.material}</p>   
              </div>
              <div className={styles.itemInfo}>
                <p>{shoe.gender}</p>
              </div>
              <div className={styles.itemInfo}>
                <div className={styles.colorsContainer}>
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
              </div>
            </div>
          </div>
          <div className={styles.block2}>
            <p className={styles.shoeInfo}>{shoe.brand}</p>
            <p>
              {shoe.description}
            </p>
            <p className={styles.shoePrice}>{shoe.price}₸</p>  
            <div className={styles.sizesContainer}>
              {shoe.sizes.map((size, index) => (
              <div
                key={index}
                className={`${styles.sizeBox} ${selectedSize === size ? styles.selectedSize : ""}`}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Shoes;
