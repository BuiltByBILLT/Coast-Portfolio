import React from 'react'
import { Link } from 'react-router-dom'
import { Image, } from 'react-bootstrap'
import "../styles/Cards.css"
import { envImage } from '../common'

const CategoryCard = ({ category }) => {
    return (
        <Link to={`/category/${category.sectionID}`} className="linkBox" >
            <div className="categoryCard">
                <Image
                    className="mx-auto px-2"
                    style={{ width: "100%", height: "200px", objectFit: "contain" }}
                    src={"/" + envImage(category.sectionImage)}
                />
                <h5 className="text-center text-danger py-2 px-1">
                    {category.sectionName}
                </h5>
            </div>
        </Link>
    )
}

export default CategoryCard
