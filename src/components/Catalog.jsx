import { useEffect, useState } from "react";
import axios from "axios";
import styles from "../css/catalog.module.css";

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

    const [openFilters, setOpenFilters] = useState({
        brand: false,
        color: false,
        material: false,
        size: false,
    });

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
        <div className={styles.catalog}>
            <h1 className={styles.catalog__title}>Каталог обуви</h1>

            <div className={styles.filters}>

            <input className={styles.catalog__search} type="text" name="search" placeholder="Поиск по названию" onChange={handleSearchChange} />

                <div className={styles.filterBlock}>
                {[
                    { name: "brand", label: "Бренд", items: brands },
                    { name: "color", label: "Цвет", items: colors },
                    { name: "material", label: "Материал", items: materials },
                    { name: "size", label: "Размер", items: sizes },
                ].map(({ name, label, items }) => (
                    <div
                        key={name}
                        className={styles.filterGroup}
                        onMouseEnter={() => setOpenFilters((prev) => ({ ...prev, [name]: true }))}
                        onMouseLeave={() => setOpenFilters((prev) => ({ ...prev, [name]: false }))}
                    >
                        
                        <div className={styles.filterTitle}>{label}</div>
                        <ul
                            className={styles.filterOptions}
                            style={{
                                opacity: openFilters[name] ? 1 : 0,
                                pointerEvents: openFilters[name] ? "auto" : "none",
                                transform: openFilters[name] ? "translateY(0)" : "translateY(15px)",
                            }}
                        >
                            {items.map((item) => (
                                <label key={item}>
                                    <input type="checkbox" name={name} value={item} onChange={handleCheckboxChange} />
                                    {item}
                                </label>
                            ))}
                        </ul>
                    </div>
                ))}
                </div>
            </div>

            {/* Вывод карточек обуви */}
            <div className={styles.blockCard}>
                {shoes.length > 0 ? (
                    shoes.map((shoe) => (
                        <div className={styles.card} key={shoe.id}>
                            <img className={styles.cardImg} src={shoe.image_url} alt={shoe.model} width={150} />
                            <h3 className={styles.cardTitle}>{shoe.model}</h3>
                            <p className={styles.cardDescription}>Бренд: {shoe.brand}</p>
                            <p className={styles.cardDescription}>Цвет: {shoe.color}</p>
                            <p className={styles.cardDescription}>Материал: {shoe.material}</p>
                            <p className={styles.cardDescription}>Цена: {shoe.price} ₸</p>
                            <a className={styles.cardMore} href={`/shoes/${shoe.id}`}>Подробнее</a>
                        </div>
                    ))
                ) : (
                    <p className={styles.cardMore}>Ничего не найдено</p>
                )}
            </div>
        </div>
    );
};

export default Catalog;
