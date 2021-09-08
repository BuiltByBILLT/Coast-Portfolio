import React from 'react'
import { Link } from 'react-router-dom'
import { Image, } from 'react-bootstrap'
import "../styles/Cards.css"

const CategoryCard = ({ category }) => {
    return (
        <Link to={`/category/${category.sectionID}`} className="linkBox" >
            <div className="categoryCard">
                <Image
                    className="mx-auto px-2"
                    style={{ width: "100%", height: "200px", objectFit: "contain" }}
                    src={category.sectionImage === ""
                        ? "/images/sample.jpg"
                        : category.sectionImage[0] === "p"
                            ? "https://www.coastairbrush.com/" + category.sectionImage
                            : category.sectionImage[0] === "/"
                                ? category.sectionImage
                                : "/images/sample.jpg"}
                />
                <h5 className="text-center text-danger py-2 px-1">
                    {category.sectionName}
                </h5>
            </div>
        </Link>
    )
}

export default CategoryCard
