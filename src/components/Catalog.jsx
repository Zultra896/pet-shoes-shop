import { useEffect, useState } from "react";
import axios from "axios";
import styles from '../css/catalog.module.css'

const Catalog = () => {
    const [shoes, setShoes] = useState([]);
    const [brands, setBrands] = useState([]);
    const [colors, setColors] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [sizes, setSizes] = useState([]);

    const [filters, setFilters] = useState({
        brand: [],
        color: [],
        material: [],
        size: [],
        search: "",
    });

    // Состояние для открытия/закрытия списков
    const [openFilters, setOpenFilters] = useState({
        brand: false,
        color: false,
        material: false,
        size: false,
    });
    
    const toggleFilter = (filter) => {
        setOpenFilters((prev) => ({
            ...prev,
            [filter]: !prev[filter], // Переключаем состояние
        }));
    };

    useEffect(() => {
        const fetchFilters = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/filters");
                setBrands(response.data.brands);
                setColors(response.data.colors);
                setMaterials(response.data.materials);
                setSizes(response.data.sizes);
            } catch (error) {
                console.error("Ошибка при загрузке фильтров:", error);
            }
        };
    
        fetchFilters();
    }, []);
    
    

    useEffect(() => {
        const queryParams = new URLSearchParams();

        Object.keys(filters).forEach((key) => {
            if (Array.isArray(filters[key]) && filters[key].length > 0) {
                queryParams.append(key, filters[key].join(","));
            } else if (typeof filters[key] === "string" && filters[key].trim() !== "") {
                queryParams.append(key, filters[key]);
            }
        });

        fetchShoes(queryParams);
    }, [filters]);

    const fetchShoes = async (queryParams) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/shoes?${queryParams.toString()}`);
            setShoes(response.data);
        } catch (error) {
            console.error("Ошибка при загрузке каталога:", error);
        }
    };

    const handleCheckboxChange = (e) => {
        const { name, value, checked } = e.target;
        setFilters((prev) => ({
            ...prev,
            [name]: checked ? [...prev[name], value] : prev[name].filter((v) => v !== value),
        }));
    };

    const handleSearchChange = (e) => {
        setFilters((prev) => ({ ...prev, search: e.target.value }));
    };

    return (
        <div>
            <h1>Каталог обуви</h1>
            <input type="text" name="search" placeholder="Поиск по названию" onChange={handleSearchChange} />

            <div className={styles.filters}>
                <div className={styles.filterGroup}>
                    <div className={styles.filterTitle} onClick={() => toggleFilter("brand")}>
                        Бренд
                    </div>
                    <ul className={`${styles.filterOptions} ${openFilters.brand ? styles.show : ""}`}>
                        {brands.map((brand) => (
                            <label key={brand}>
                                <input type="checkbox" name="brand" value={brand} onChange={handleCheckboxChange} />
                                {brand}
                            </label>
                        ))}
                    </ul>
                </div>

                <div className={styles.filterGroup}>
                    <div className={styles.filterTitle} onClick={() => toggleFilter("color")}>
                        Цвет
                    </div>
                    <ul className={`${styles.filterOptions} ${openFilters.color ? styles.show : ""}`}>
                        {colors.map((color) => (
                            <label key={color}>
                                <input type="checkbox" name="color" value={color} onChange={handleCheckboxChange} />
                                {color}
                            </label>
                        ))}
                    </ul>
                </div>

                <div className={styles.filterGroup}>
                    <div className={styles.filterTitle} onClick={() => toggleFilter("material")}>
                        Материал
                    </div>
                    <ul className={`${styles.filterOptions} ${openFilters.material ? styles.show : ""}`}>
                        {materials.map((material) => (
                            <label key={material}>
                                <input type="checkbox" name="material" value={material} onChange={handleCheckboxChange} />
                                {material}
                            </label>
                        ))}
                    </ul>
                </div>

                <div className={styles.filterGroup}>
                    <div className={styles.filterTitle} onClick={() => toggleFilter("size")}>
                        Размер
                    </div>
                    <ul className={`${styles.filterOptions} ${openFilters.size ? styles.show : ""}`}>
                        {sizes.map((size) => (
                            <label key={size}>
                                <input type="checkbox" name="size" value={size} onChange={handleCheckboxChange} />
                                {size}
                            </label>
                        ))}
                    </ul>
                </div>
            </div>


            {/* Вывод карточек обуви */}
            <div>
                {shoes.length > 0 ? (
                    shoes.map((shoe) => (
                        <div key={shoe.id}>
                            <img src={shoe.image_url} alt={shoe.model} width={150} />
                            <h3>{shoe.model}</h3>
                            <p>Бренд: {shoe.brand}</p>
                            <p>Цвет: {shoe.color}</p>
                            <p>Материал: {shoe.material}</p>
                            <p>Цена: {shoe.price} ₸</p>
                            <a href={`/shoes/${shoe.id}`}>Подробнее</a>
                        </div>
                    ))
                ) : (
                    <p>Ничего не найдено</p>
                )}
            </div>
        </div>
    );
};

export default Catalog;
