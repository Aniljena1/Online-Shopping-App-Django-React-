import React, { useEffect, useState } from 'react'
import { Row, Col, Image, ListGroup, Button, Card, Form } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { listProductDetails, createProductReview } from '../actions/productActions'
import Loader from '../components/Loader'
import Message from '../components/Message'
import Rating from '../components/Rating'
import { PRODUCT_CREATE_REVIEW_RESET } from '../constants/productConstants'

const ProductScreen = ({ match, history }) => {

    const [qty, setQty] = useState(1)
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState('')
    // const [product, setProduct] = useState([])

    // useEffect(() => {
    //     const fetchproduct = async() => {
    //         const {data} = await axios.get(`http://127.0.0.1:8000/api/product/${match.params.id}/`)
    //         console.log(data)
    //         setProduct(data)
    //     }
    //     fetchproduct()
    // }, [])

    const dispatch = useDispatch()

    const productDetails = useSelector(state => state.productDetailsReducer)
    const { product, loading, error } = productDetails

    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin

    const productReview = useSelector(state => state.productReview);
    const { loading: loadingReview, error: errorReview, success } = productReview

    useEffect(() => {
        if(success){
            setRating(0)
            setComment('')
            dispatch({ type: ' PRODUCT_CREATE_REVIEW_RESET '})
        }
        dispatch(listProductDetails(match.params.id))
    }, [dispatch, match, success])

    const addToCart = () => {
        history.push(`/cart/${match.params.id}?qty=${qty}`)
    }

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch( createProductReview(
            match.params.id,{
                rating,
                comment
            }

        ))
    }

    // const products = product.find((p)=> p._id === match.params.id)
    return (
        <div>
            <Link to='/' className="btn btn-light my-3">Go back</Link>
            {
                loading ?
                    <Loader />
                    : error
                        ? <Message variant='danger'>{error}</Message>
                        : (
                            <div>
                                <Row>
                                    <Col md={6}>
                                        <Image src={product.image} alt={product.name} fluid />
                                    </Col>
                                    <Col md={3}>
                                        <ListGroup variant="flush">
                                            <ListGroup.Item>
                                                <h3>{product.name}</h3>
                                            </ListGroup.Item>
                                            <ListGroup.Item>
                                                <h5>&#8377;{product.price}</h5>
                                            </ListGroup.Item>

                                            <ListGroup.Item>
                                                <Rating value={product.rating} text={`${product.numReviews} reviews `} color={'#f8e825'} />
                                            </ListGroup.Item>

                                            <ListGroup.Item>
                                                <h6>{product.description}</h6>
                                            </ListGroup.Item>
                                        </ListGroup>
                                    </Col>
                                    <Col md={3}>
                                        <Card>
                                            <ListGroup variant='flush'>
                                                <ListGroup.Item>
                                                    <Row>
                                                        <Col>
                                                            <strong>Ruppes {product.price}</strong>
                                                        </Col>
                                                    </Row>
                                                </ListGroup.Item>
                                                <ListGroup.Item>
                                                    <Row>
                                                        <Col>Status: </Col>
                                                        <Col>{product.countInStock > 0 ? 'In Stock' : 'Out Of Stock'}</Col>
                                                    </Row>
                                                </ListGroup.Item>
                                                {product.countInStock > 0 && (
                                                    <ListGroup.Item>
                                                        <Row>
                                                            <Col>Qty</Col>
                                                            <Col xs='auto' className='my-1'>
                                                                <Form.Control as="select" value={qty} onChange={(e) => setQty(e.target.value)}>
                                                                    {
                                                                        [...Array(product.countInStock).keys()].map((x) => (
                                                                            <option key={x + 1} value={x + 1}>
                                                                                {x + 1}
                                                                            </option>
                                                                        ))
                                                                    }
                                                                </Form.Control>
                                                            </Col>
                                                        </Row>
                                                    </ListGroup.Item>
                                                )}
                                            </ListGroup>
                                            <ListGroup.Item>
                                                <Button className="btn-block" disabled={product.countInStock === 0} type="button" onClick={addToCart}>
                                                    Add to Cart
                                                </Button>
                                            </ListGroup.Item>
                                        </Card>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col md={6}>
                                        <h6>Reviews</h6>
                                        {product.reviews.length === 0 && <Message variant='info'>No Reviews</Message>}
                                        <ListGroup variant='flush'>
                                            {product.reviews.map((review) => (
                                                <ListGroup.Item key={review._id}>
                                                    <strong>{review.name}</strong>
                                                    <Rating value={review.rating} color='#f8e825' />
                                                    <p>{review.createdAt.substring(0, 10)}</p>
                                                    <p>{review.comment}</p>
                                                </ListGroup.Item>
                                            )
                                            )}
                                            <ListGroup.Item>
                                                <h4> Write a review</h4>
                                                {loadingReview && <Loader />}
                                                { success && <Message variant='success'>Review Submitted</Message>}
                                                { errorReview && <Message variant='danger'>{errorReview}</Message>}
                                                {userInfo ? (
                                                    <Form onSubmit={submitHandler}>
                                                        <Form.Group controlId='rating'>
                                                            <Form.Label>Rating</Form.Label>
                                                            <Form.Control
                                                                as='select'
                                                                value={rating}
                                                                onChange={(e) => setRating(e.target.value)}
                                                            >
                                                                <option value="">Select... </option>
                                                                <option value="1">1 - Poor </option>
                                                                <option value="2">2 - Fair </option>
                                                                <option value="3">3 - Good </option>
                                                                <option value="4">4 - Very Good </option>
                                                                <option value="5">5 - Excellent </option>
                                                            </Form.Control>
                                                        </Form.Group>
                                                        <Form.Group controlId='comment'>
                                                            <Form.Label>Review</Form.Label>
                                                            <Form.Control
                                                                as='textarea'
                                                                row='5'
                                                                value={comment}
                                                                onChange={(e) => setComment(e.target.value)}
                                                            ></Form.Control>
                                                        </Form.Group>
                                                        <Button disabled={loadingReview} type='submit' variant='primary'> Submit</Button>
                                                    </Form>
                                                ) : (
                                                    <Message variant='info'>Please <Link to='/login'>Login</Link> </Message>
                                                )}
                                            </ListGroup.Item>
                                        </ListGroup>
                                    </Col>
                                </Row>
                            </div>

                        )

            }

        </div>
    )
}

export default ProductScreen
