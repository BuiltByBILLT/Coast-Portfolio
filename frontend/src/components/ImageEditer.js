import axios from 'axios'
import React, { useState, useEffect, useContext } from 'react'
import { Form, Button, Row, Col, Modal } from 'react-bootstrap'
import { useMutation, useQuery } from 'react-query'
import { UserContext } from '../contexts/UserContext'


const ImageEditer = ({ pID }) => {

    const [thumb1, setThumb1] = useState("")
    const [full1, setFull1] = useState("")
    const [thumb2, setThumb2] = useState("")
    const [full2, setFull2] = useState("")
    const [thumb3, setThumb3] = useState("")
    const [full3, setFull3] = useState("")
    const [thumb4, setThumb4] = useState("")
    const [full4, setFull4] = useState("")
    const [thumb5, setThumb5] = useState("")
    const [full5, setFull5] = useState("")
    const [thumb6, setThumb6] = useState("")
    const [full6, setFull6] = useState("")
    const [thumb7, setThumb7] = useState("")
    const [full7, setFull7] = useState("")
    const [thumb8, setThumb8] = useState("")
    const [full8, setFull8] = useState("")
    const [thumb9, setThumb9] = useState("")
    const [full9, setFull9] = useState("")
    const [thumb10, setThumb10] = useState("")
    const [full10, setFull10] = useState("")

    const [images, setImages] = useState("")
    const [success, setSuccess] = useState("")
    const [error, setError] = useState("")
    const user = useContext(UserContext)

    // const { loading, error, } = useSelector(state => state.productUpdateImages)
    // const dispatch = useDispatch()

    // Query: Product Details  
    const { isLoading: queryLoading, refetch } = useQuery(["productEdit", encodeURIComponent(pID)], () => {
        return axios.get(`/api/products/edit/${encodeURIComponent(pID)}`, {
            headers: { Authorization: `Bearer ${user.token}` }
        })
    }, {
        onSuccess: (data) => {
            setImages(data.data.images)
            console.log(images)
        },
        onError: (error) => {
            setError(error.response && error.response.data.message
                ? error.response.data.message : error.message)
        }
    })



    // Mutation: Update Product
    const { mutate, isLoading, reset } = useMutation(data => {
        return axios.put(`/api/products/images/${encodeURIComponent(pID)}`, data, {
            headers: { Authorization: `Bearer ${user.token}` }
        })
    }, {
        onSuccess: (data) => {
            console.log(data.data)
            setSuccess("Product Update Success!")
            setError("")
            reset()
            refetch()
        },
        onError: (error) => {
            setError(error.response && error.response.data.message
                ? error.response.data.message : error.message)
        }
    })



    useEffect(() => {
        console.log("images:", images)
        images && images.forEach((image) => {
            if (image.imageType === 0) {
                if (image.imageNumber === 0) setThumb1(image.imageSrc)
                if (image.imageNumber === 1) setThumb2(image.imageSrc)
                if (image.imageNumber === 2) setThumb3(image.imageSrc)
                if (image.imageNumber === 3) setThumb4(image.imageSrc)
                if (image.imageNumber === 4) setThumb5(image.imageSrc)
                if (image.imageNumber === 5) setThumb6(image.imageSrc)
                if (image.imageNumber === 6) setThumb7(image.imageSrc)
                if (image.imageNumber === 7) setThumb8(image.imageSrc)
                if (image.imageNumber === 8) setThumb9(image.imageSrc)
                if (image.imageNumber === 9) setThumb10(image.imageSrc)
            }
            if (image.imageType === 1) {
                if (image.imageNumber === 0) setFull1(image.imageSrc)
                if (image.imageNumber === 1) setFull2(image.imageSrc)
                if (image.imageNumber === 2) setFull3(image.imageSrc)
                if (image.imageNumber === 3) setFull4(image.imageSrc)
                if (image.imageNumber === 4) setFull5(image.imageSrc)
                if (image.imageNumber === 5) setFull6(image.imageSrc)
                if (image.imageNumber === 6) setFull7(image.imageSrc)
                if (image.imageNumber === 7) setFull8(image.imageSrc)
                if (image.imageNumber === 8) setFull9(image.imageSrc)
                if (image.imageNumber === 9) setFull10(image.imageSrc)
            }
        })
        return () => {

        }
    }, [images])


    function saveHandler() {
        var arr = [];
        [thumb1, thumb2, thumb3, thumb4, thumb5, thumb6, thumb7, thumb8, thumb9, thumb10].forEach((thumb, index) => {
            if (thumb != "") arr.push({
                "imageProduct": pID,
                "imageSrc": thumb,
                "imageType": 0,
                "imageNumber": index
            })
        });
        [full1, full2, full3, full4, full5, full6, full7, full8, full9, full10].forEach((full, index) => {
            if (full != "") arr.push({
                "imageProduct": pID,
                "imageSrc": full,
                "imageType": 1,
                "imageNumber": index
            })
        })

        console.log(arr)
        // dispatch(updateImages(arr, pID))
        mutate(arr)
    }

    return (
        <Form>
            <Row className="mb-3 mr-4">
                <Col xs={1} className="text-right">
                    #
                </Col>
                <Col>
                    Thumbnail
                </Col>
                <Col>
                    Full Size
                </Col>
            </Row>
            {images &&
                [{ thumb: thumb1, full: full1, setThumb: setThumb1, setFull: setFull1 },
                { thumb: thumb2, full: full2, setThumb: setThumb2, setFull: setFull2 },
                { thumb: thumb3, full: full3, setThumb: setThumb3, setFull: setFull3 },
                { thumb: thumb4, full: full4, setThumb: setThumb4, setFull: setFull4 },
                { thumb: thumb5, full: full5, setThumb: setThumb5, setFull: setFull5 },
                { thumb: thumb6, full: full6, setThumb: setThumb6, setFull: setFull6 },
                { thumb: thumb7, full: full7, setThumb: setThumb7, setFull: setFull7 },
                { thumb: thumb8, full: full8, setThumb: setThumb8, setFull: setFull8 },
                { thumb: thumb9, full: full9, setThumb: setThumb9, setFull: setFull9 },
                { thumb: thumb10, full: full10, setThumb: setThumb10, setFull: setFull10 },
                ].map((row, index) =>
                (<Row key={index} className="mr-4">
                    <Col xs={1} className="text-right my-3" >
                        {index + 1}
                    </Col>
                    <Col>
                        <Form.Group controlId={`thumb_${index + 1}`}>

                            <Form.Control type='text' placeholder='prodimages/example.png' value={row.thumb}
                                onChange={(e) => row.setThumb(e.target.value)}>
                            </Form.Control>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId={`full_${index + 1}`}>

                            <Form.Control type='text' placeholder='prodimages/example.png' value={row.full}
                                onChange={(e) => row.setFull(e.target.value)}>
                            </Form.Control>
                        </Form.Group>
                    </Col>
                </Row>)
                )
            }
            <Row className="justify-content-end mr-4 pr-3">
                {success && <h6 className="text-success mr-3 my-auto">{success}</h6>}
                {error && <h6 className="text-danger mr-3 my-auto">{error}</h6>}
                <Button disabled={isLoading || success}
                    onClick={saveHandler}>
                    Save
                </Button>
            </Row>
        </Form>
    )
}

export default ImageEditer
