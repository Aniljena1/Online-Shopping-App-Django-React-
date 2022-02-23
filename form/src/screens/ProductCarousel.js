import React, { useEffect } from 'react';
import { Carousel, Image } from 'react-bootstrap';
import { Link} from 'react-router-dom'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { useDispatch, useSelector } from 'react-redux';
import { topProducts } from '../actions/productActions'
const ProductCarousel = () => {
    const dispatch = useDispatch()
    const productTop = useSelector(state => state.productTop)
    const { products, loading, error } = productTop

    useEffect(()=>{
        dispatch(topProducts())
    }, dispatch)
  return (
      loading ? <Loader /> :
      error ? <Message variant='danger'>{error}</Message> :(
          <Carousel pause='hover' className='bg-dark mt-3'>
              {
                  products.map(product => (
                      <Carousel.Item key={product._id}>
                          <Link to={`/product/${product._id}`}>
                          <Image src={product.image} alt={product.name} fluid />
                          <Carousel.Caption className='carousel.caption'>
                              <h6 style={{color:'red'}}> {product.name} (&#8377;{product.price})</h6>
                          </Carousel.Caption>
                          </Link>
                      </Carousel.Item>
                  ))
              }
          </Carousel>
      )
  )
}

export default ProductCarousel