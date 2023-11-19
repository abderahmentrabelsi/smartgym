// ** Icon Imports
import { PlusCircle } from 'react-feather'

// ** Reactstrap Imports
import { Row, Col, Form, Label, Input, Button, Card, CardHeader, CardTitle, CardBody, CardText } from 'reactstrap'
import axios from "axios";
import {useEffect, useState} from "react";

const Payment = () => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await axios.get('/cart');
        setCartItems(response.data);
      } catch (error) {
        console.error(error);
        // Handle the error
      }
    };
    fetchCartItems();
  }, []);

  const handleSubmi = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.get('/cart');
      const lineItems = response.data.products.map((product) => ({
        id: product.id,
        qty: product.qty,
      }));
      const checkoutResponse = await axios.post('/products/create-checkout', lineItems);
      window.location = checkoutResponse.data.url; // Redirect the user to the checkout page
    } catch (error) {
      console.error(error);
      // Handle the error
    }
  };


  return (
    <Form
      className='list-view product-checkout'
      onSubmit={e => {
        e.preventDefault()
      }}
    >
      <div className='payment-type'>
        <Card>
          <CardHeader className='flex-column align-items-start'>
            <CardTitle tag='h4'>Payment options</CardTitle>
            <CardText className='text-muted mt-25'>Be sure to click on correct payment option</CardText>
          </CardHeader>
          <CardBody>
            <h6 className='card-holder-name my-75'>John Doe</h6>
            <div className='form-check mb-2'>
              <Input defaultChecked id='us-card' type='radio' name='paymentMethod' />
              <Label className='form-check-label' htmlFor='us-card'>
                US Unlocked Debit Card 12XX XXXX XXXX 0000
              </Label>
            </div>
            <Row className='customer-cvv mt-1 row-cols-lg-auto'>
              <Col xs={3} className='d-flex align-items-center'>

                <Button className='btn-cvv mb-50' color='primary' onClick={handleSubmi}>
                  Pay With Stripe
                </Button>
              </Col>
            </Row>
            <hr className='my-2' />
            <hr className='my-2' />
            <div className='gift-card mb-25'>
              <CardText>
                <PlusCircle className='me-50' size={21} />
                <span className='align-middle'>Add Gift Card</span>
              </CardText>
            </div>
          </CardBody>
        </Card>
      </div>

    </Form>
  )
}

export default Payment
