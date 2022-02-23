import React, { useEffect } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import Loader from '../components/Loader'
import Message from '../components/Message'
import Paginate from '../components/Paginate';
import { useDispatch, useSelector } from 'react-redux';
import { listProducts, createProduct, deleteProduct } from '../actions/productActions';
import { Table, Button, Row, Col } from 'react-bootstrap';
import { HiTrash, HiPlusSm } from "react-icons/hi";
import { MdEdit } from "react-icons/md";
import { PRODUCT_CREATE_RESET } from '../constants/productConstants';

const ProductListScreen = ({ history, match }) => {
    const dispatch = useDispatch()

    const productListReducer = useSelector(state => state.productListReducer)
    const { Loading, error, products, page, pages } = productListReducer

    const productCreate = useSelector(state => state.productCreate)
    const { Loading: loadingCreate, error: errorCreate, success: successCreate, product } = productCreate

    const productDelete = useSelector(state => state.productDelete)
    const { Loading: loadingDelete, error: errorDelete, success: successDelete } = productDelete


    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin

    let keyword = history.location.search

    useEffect(() => {
        dispatch({ type: PRODUCT_CREATE_RESET })

        if (userInfo && userInfo.isAdmin) {
            dispatch(listProducts())
        } else {
            history.push('/login')
        }

        if (successCreate) {
            history.push(`/admin/product/${product._id}/edit`)
        } else {
            dispatch(listProducts(keyword))
        }

    }, [dispatch, history, userInfo, successDelete, successCreate, product, keyword])

    const deleteHandler = (_id) => {
        if (window.confirm('Are you Sure you want to delete this User?')) {
            //delete products
            dispatch(deleteProduct(_id))
        }

    }

    const createProductHandler = (product) => {
        //create product
        dispatch(createProduct())
    }


    return (
        <div>
            <Row className='align-items-center'>
                <Col>
                    <h1> Products </h1>
                </Col>
                <Col className='text-right'>
                    <Button className='my-3' onClick={createProductHandler}>
                        <HiPlusSm />Create Product
                    </Button>
                </Col>
            </Row>

            {loadingDelete && <Loader />}
            {errorDelete && <Message variant='danger'>{errorDelete}</Message>}

            {loadingCreate && <Loader />}
            {errorCreate && <Message variant='danger'>{errorCreate}</Message>}
            {
                Loading ? <Loader />
                    : error
                        ? <Message variant='danger'>{error}</Message>
                        : (
                            <>
                                <Table striped bordered hover responsive className='table-sm'>
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>NAME</th>
                                            <th>PRICE</th>
                                            <th>CATEGORY</th>
                                            <th>bRAND</th>
                                            <th></th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {
                                            products.map((product) => (
                                                <tr key={product._id}>
                                                    <td>{product._id}</td>
                                                    <td>{product.name}</td>
                                                    <td>&#8377;{product.price}</td>
                                                    <td>{product.category}</td>
                                                    <td>{product.brand}</td>
                                                    <td>
                                                        <LinkContainer to={`/admin/product/${product._id}/edit`}>
                                                            <Button variant='light' className='btn-sm'>
                                                                <MdEdit />
                                                            </Button>
                                                        </LinkContainer>

                                                        <Button variant='danger' className='btn-sm' onClick={() => deleteHandler(product._id)}>
                                                            <HiTrash />
                                                        </Button>

                                                    </td>
                                                </tr>
                                            )
                                            )
                                        }
                                    </tbody>
                                </Table>
                                <Paginate page={page} pages={pages} isAdmin={true} />
                            </>
                        )
            }
        </div>
    )
}

export default ProductListScreen
