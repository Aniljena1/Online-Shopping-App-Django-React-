import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom'
import Message from '../components/Message';
import Loder from '../components/Loader';
import { Form, Button, Row, Col, ListGroup, Image, Card } from 'react-bootstrap';
import { getOrderDetails, deliverOrder } from '../actions/orderAction'
import { ORDER_DELIVERED_RESET } from '../constants/orderConstants'

const OrderScreen = ({ match, history }) => {
    const orderId = match.params.id
    const dispatch = useDispatch()

    const orderDetails = useSelector(state => state.orderDetails)
    const { order, error, loading } = orderDetails

    const orderPay = useSelector(state => state.orderPay)
    const { loading: loadingPay, success: successPay } = orderPay

    const orderDeliver = useSelector(state => state.orderDeliver)
    const { loading: loadingDelivered, success: successDelivered } = orderDeliver

    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin


    if (!loading && !error) {
        order.itemPrice = order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2)
    }

    //rzp_test_wt4jUEGJk7h81V -> payment getway id

    const displayRazorpay = () => {
        var options = {
            "key": "YOUR_KEY_ID", // Enter the Key ID generated from the Dashboard
            "amount": "50000", // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
            "currency": "INR",
            "name": "Acme Corp",
            "description": "Test Transaction",
            "image": "https://example.com/your_logo",
            "order_id": "order_9A33XWu170gUtm", //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
            "handler": function (response) {
                alert(response.razorpay_payment_id);
                alert(response.razorpay_order_id);
                alert(response.razorpay_signature)
            },
            "prefill": {
                "name": order.user.name,
                "email": order.user.email,
            },

        };
        var rzp1 = new window.Razorpay(options);
    }

    const loadRazorpay = () => {
        const script = document.createElement('script')
        script.src = 'https://checkout.razorpay.com/v1/checkout.js'
        document.body.appendChild(script)
        script.onload = displayRazorpay
    }

    useEffect(() => {
        if(!userInfo){
            history.push('/login')
        }

        if (!order || order._id !== Number(orderId) || successDelivered) {

            dispatch(getOrderDetails(orderId))
            dispatch({ type: ORDER_DELIVERED_RESET })

        } else if (!order.isPaid) {

        }
    }, [dispatch, order, orderId, successDelivered])

    const deliverHandler = () => {
        dispatch(deliverOrder(order))
    }

    return loading ? (<Loder />)
        : error ? (<Message variant='danger'>{error}</Message>)
            :
            (
                <div>
                    <h2>Order: {order._id}</h2>
                    <Row>
                        <Col md={8}>
                            <ListGroup variant='flush'>
                                <ListGroup.Item>
                                    <h2>Shipping</h2>
                                    <p><strong>Name:</strong>{order.user.name}</p>
                                    <p><strong>Email:</strong><a href={`mailto:{order.user.email}`}>{order.user.email}</a></p>
                                    <p>
                                        <strong>Shipping: </strong>
                                        {order.shippingAddress.address},{order.shippingAddress.city}
                                        {' '}
                                        {order.shippingAddress.postalCode}
                                        {' '}
                                        {order.shippingAddress.country}
                                    </p>

                                    {order.isDelivered ? (<Message variant='success'>Delivered on {order.deliveredAt}</Message>) :
                                        (
                                            <Message variant='warning'> Not Delivered</Message>
                                        )}

                                </ListGroup.Item>

                                <ListGroup.Item>
                                    <h2>Payment Method </h2>
                                    <p>
                                        <strong>Method: </strong>
                                        {order.paymentMethod}
                                    </p>
                                    {order.isPaid ? (<Message variant='success'>Paid on {order.paidAt}</Message>) :
                                        (
                                            <Message variant='warning'> NotPaid</Message>
                                        )}
                                </ListGroup.Item>

                                <ListGroup.Item>
                                    <h2>Order Items </h2>
                                    {
                                        order.orderItems.length === 0 ?
                                            <Message variant='info'>
                                                Your Order is Empty
                                            </Message>
                                            : (
                                                <ListGroup variant='flush'>
                                                    {
                                                        order.orderItems.map((item, index) => (
                                                            <ListGroup.Item key={index}>
                                                                <Row>
                                                                    <Col md={1}>
                                                                        <Image src={item.image} alt={item.name} fluid rounded />
                                                                    </Col>
                                                                    <Col>
                                                                        <Link to={`/product/${item.product}`}>{item.name}</Link>
                                                                    </Col>

                                                                    <Col md={4}>
                                                                        {/* tofixed = for two decimal faces */}
                                                                        {item.qty}  x &#8377;{item.price} = &#8377;{(item.qty * item.price).toFixed(2)}
                                                                    </Col>
                                                                </Row>
                                                            </ListGroup.Item>
                                                        ))
                                                    }
                                                </ListGroup>
                                            )
                                    }
                                </ListGroup.Item>

                            </ListGroup>
                        </Col>
                        <Col md={4}>
                            <Card>
                                <ListGroup variant='flush'>
                                    <ListGroup.Item>
                                        <h4> Order Summary </h4>
                                    </ListGroup.Item>

                                    <ListGroup.Item>
                                        <Row>
                                            <Col>Item:</Col>
                                            <Col>&#8377;{order.itemPrice}</Col>
                                        </Row>
                                    </ListGroup.Item>

                                    <ListGroup.Item>
                                        <Row>
                                            <Col>Shipping:</Col>
                                            <Col>&#8377;{order.shippingPrice}</Col>
                                        </Row>
                                    </ListGroup.Item>

                                    <ListGroup.Item>
                                        <Row>
                                            <Col>Tax:</Col>
                                            <Col>&#8377;{order.taxPrice}</Col>
                                        </Row>
                                    </ListGroup.Item>

                                    <ListGroup.Item>
                                        <Row>
                                            <Col>Total:</Col>
                                            <Col>&#8377;{order.totalPrice}</Col>
                                        </Row>
                                    </ListGroup.Item>

                                </ListGroup>

                                {loadingDelivered && <Loder />}

                                {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                                    <ListGroup.Item>
                                        <Button type='button' className='btn btn-block' onClick={deliverHandler}>
                                            Mark as Deliver
                                        </Button>
                                    </ListGroup.Item>
                                )}
                            </Card>
                        </Col>
                    </Row>
                </div>
            )
}

export default OrderScreen

