import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Loader from '../components/Loader'
import Message from '../components/Message'
import { useDispatch, useSelector } from 'react-redux';
import { getUserAdminDetails, updateUser } from '../actions/userAction';
import FormContainer from '../components/FormContainer';
import { Form, Button } from 'react-bootstrap';
import { USER_UPDATE_RESET } from '../constants/userConstant';

const UserEditScreen = ({ match, history }) => {

    const userId = match.params.id

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [isAdmin, setIsAdmin] = useState(false)

    const dispatch = useDispatch()

    const adminDetail = useSelector(state => state.adminDetail)
    const { error, loading, auser } = adminDetail

    const userUpdate = useSelector(state => state.userUpdate)
    const { error: errorUpdate, loading: loadingUpdate, success } = userUpdate


    useEffect(() => {
        if (success) {
            dispatch({ type: USER_UPDATE_RESET })
            history.push('/admin/userlist')
        } else {
            if (!auser || auser._id !== Number(userId)) {
                dispatch(getUserAdminDetails(userId))
            } else {
                setName(auser.name)
                setEmail(auser.email)
                setIsAdmin(auser.isAdmin)
            }

        }

    }, [auser, userId, success, history])

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(updateUser({
            _id:auser._id,name, email, isAdmin
        }))

    }

    return (
        <div>
            <Link to='/admin/userlist'>Go Back</Link>
            <FormContainer>
                <h3>Edit User</h3>
                { loadingUpdate && <Loader />  }
                { errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
                {loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message> : (
                    <Form onSubmit={submitHandler}>

                        <Form.Group controlId='name'>
                            <Form.Label>Name</Form.Label>
                            <Form.Control type='name' placeholder='Enter Name' value={name} onChange={(e) => setName(e.target.value)} >

                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId='email'>
                            <Form.Label>Email Address</Form.Label>
                            <Form.Control type='email' placeholder='Enter Email' value={email} onChange={(e) => setEmail(e.target.value)}  >
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId='isAdmin'>
                            <Form.Check type='checkbox' label='Is Admin' checked={isAdmin} onChange={(e) => setIsAdmin(e.target.checked)}  >
                            </Form.Check>
                        </Form.Group>


                        <Button type='submit' variant='primary'> Update </Button>
                    </Form>
                )}


            </FormContainer>
        </div>
    );
};

export default UserEditScreen;
