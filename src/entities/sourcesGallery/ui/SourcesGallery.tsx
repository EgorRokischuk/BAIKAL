import React from "react";
import * as s from "./SourcesGallery.module.scss";

const images = [
    {
        img: "https://baikal-project.icc.ru/wp-content/uploads/2022/03/forest.png",
        link: "https://example.com/",
        label: "Лес",
        className: s.wide, // Задаем класс через SCSS-модули
    },
    {
        img: "https://baikal-project.icc.ru/wp-content/themes/idstu/assets/img/index/space.png",
        link: "https://example.com/",
        label: "Космомониторинг",
        className: s.tall,
    },
    {
        img: "https://baikal-project.icc.ru/wp-content/uploads/2022/03/earth-shake.png",
        link: "https://example.com/",
        label: "Землетрясения",
        className: s.big,
    },
    {
        img: "https://cdn.pixabay.com/photo/2016/11/18/14/50/box-1837418_1280.jpg",
        link: "https://example.com/",
    },
    {
        img: "https://cdn.pixabay.com/photo/2015/09/18/20/20/africa-950920_1280.jpg",
        link: "https://example.com/",
    },
    {
        img: "https://cdn.pixabay.com/photo/2016/11/29/03/53/animal-1867127_1280.jpg",
        link: "https://example.com/",
    },
    {
        img: "https://cdn.pixabay.com/photo/2015/03/26/09/41/balloon-690129_1280.jpg",
        link: "https://example.com/",
    },
    {
        img: "https://cdn.pixabay.com/photo/2015/03/26/09/54/abstract-690112_1280.jpg",
        link: "https://example.com/",
    },
    {
        img: "https://cdn.pixabay.com/photo/2016/11/29/09/32/adult-1868750_1280.jpg",
        link: "https://example.com/",
    },
    {
        img: "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg",
        link: "https://example.com/",
    },
];

export const Gallery = () => {
    return (
        <div className={s.gallery}>
            {images.map((item, index) => (
                <a
                    href={item.link}
                    key={index}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={item.className || ""}
                >
                    <span className={s.label}>{item.label}</span> {/* Метка */}
                    <img src={item.img} alt={`Gallery item ${index + 1}`} loading="lazy" />
                </a>
            ))}
        </div>
    );
};
