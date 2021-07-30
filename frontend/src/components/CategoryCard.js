import React from 'react'
import { Link } from 'react-router-dom'
import { Image, } from 'react-bootstrap'
import "../styles/Cards.css"

const CategoryCard = ({ category }) => {
    return (
        <Link to={`/category/${category.sectionID}`} className="linkBox" >
            <div className="mb-5 categoryCard">
                <Image
                    className="mx-auto px-2"
                    style={{ width: "100%", height: "200px", objectFit: "contain" }}
                    src={category.sectionImage ? "https://www.coastairbrush.com/" + category.sectionImage
                        : "/images/sample.jpg"}
                />
                <p className="text-center text-danger py-2">
                    {category.sectionName}
                </p>
            </div>
        </Link>
    )
}

export default CategoryCard
