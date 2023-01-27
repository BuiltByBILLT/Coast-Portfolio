import { LinkContainer } from 'react-router-bootstrap'
import { Breadcrumb } from 'react-bootstrap'
import useCategories from '../hooks/useCatergories'
import { useEffect, useState } from 'react'

const ProductCrumbs = ({ product }) => {

    const categories = useCategories()
    const [category, setCategory] = useState({})

    useEffect(() => {
        if (product.pSection && categories?.length) {

            let category = categories?.find(cat => cat.sectionID == product.pSection)
            if (!category) return
            let breadcrumbs = []
            // let topSection = product.pSection // First is Self
            let topSection = category.topSection // Skip Self

            //BreadCrumbs
            for (let index = 0; index < 10; index++) {
                let next = categories.find(cat => cat.sectionID == topSection)
                if (topSection == 0) { // Add All Categories at top
                    breadcrumbs.push({ sectionID: 0, sectionName: "All Categories" })
                    break
                }
                else if (next) { // Find Next Parent
                    breadcrumbs.push(next)
                    topSection = next.topSection
                } else { }
            }
            category.breadcrumbs = breadcrumbs
            setCategory(category)
        }
        else setCategory({})
    }, [product, categories])


    if (!category.sectionID) return (
        <Breadcrumb className="mb-0">
            <LinkContainer to="/">
                <Breadcrumb.Item>Home</Breadcrumb.Item>
            </LinkContainer>
        </Breadcrumb>
    )
    return (
        <Breadcrumb className="mb-0">
            <LinkContainer to="/">
                <Breadcrumb.Item>Home</Breadcrumb.Item>
            </LinkContainer>
            {category.breadcrumbs.slice().reverse().map(crumb => (
                <LinkContainer key={crumb.sectionID} to={`/category/${crumb.sectionID}`}>
                    <Breadcrumb.Item>{crumb.sectionName}</Breadcrumb.Item>
                </LinkContainer>
            ))}
            {/* {
                <Breadcrumb.Item active className="text-danger">
                    {product.pName}
                </Breadcrumb.Item>
            } */}
        </Breadcrumb>

    )
}

export default ProductCrumbs
