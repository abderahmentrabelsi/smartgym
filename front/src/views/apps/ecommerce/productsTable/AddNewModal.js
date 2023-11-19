// ** React Imports
import { useState } from 'react'

// ** Third Party Components
import Flatpickr from 'react-flatpickr'
import {User, DollarSign, X, Image, Star} from 'react-feather'

// ** Reactstrap Imports
import {Modal, Input, Label, Button, ModalHeader, ModalBody, InputGroup, InputGroupText, Col} from 'reactstrap'
import FileBase from 'react-file-base64';


// ** Styles
import '@styles/react/libs/flatpickr/flatpickr.scss'
import axios from "axios";
import {useNavigate} from "react-router-dom";
import img from "@src/assets/images/elements/img.png";


const AddNewModal = ({ open, handleModal }) => {
  // ** State
  const [Picker, setPicker] = useState(new Date())
    const [formData, setFormData] = useState({});

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        axios.post('/products', formData)
            .then(response => {
                // handle successful response
                console.log(response.data);
                navigate('/apps/ecommerce/shop'); // redirect to /apps/ecommerce/shop on successful response
            })
            .catch(error => {
                // handle error
                console.error(error);
            });

        // clear form data and close modal
        setFormData({
            name: '',
            description: '',
            price: '',
            qty: '',
            brand: '',
            image: '',
            slug: '',
            rating: '',
        });
        handleModal();
    };

// in the component body
    const navigate = useNavigate();
  return (
      <Modal
          isOpen={open}
          toggle={handleModal}
          className='sidebar-sm'
          modalClassName='modal-slide-in'
          contentClassName='pt-0'
      >
        <ModalHeader className='mb-1' toggle={handleModal} close={<X className='cursor-pointer' size={15} onClick={handleModal} />} tag='div'>
          <h5 className='modal-title'>New Product</h5>
        </ModalHeader>
        <ModalBody className='flex-grow-1'>
          <div className='mb-1'>
            <Label className='form-label' for='name'>
              Name
            </Label>
            <InputGroup>
              <InputGroupText>
                <User size={15} />
              </InputGroupText>
                <Input id='name' placeholder='Name' value={formData.name} onChange={handleChange} />
            </InputGroup>
          </div>
            <div className='mb-1'>
                <Label className='form-label' for='description'>
                    Description
                </Label>
                <InputGroup>
                    <Input id='description' placeholder='Description' value={formData.description} onChange={handleChange} />
                </InputGroup>
            </div>
          <div className='mb-1'>
            <Label className='form-label' for='price'>
              Price
            </Label>
            <InputGroup>
              <InputGroupText>
                <DollarSign size={15} />
              </InputGroupText>
                <Input type='number' id='price' placeholder='Price' value={formData.price} onChange={handleChange} />
            </InputGroup>
          </div>

          <div className='mb-1'>
            <Label className='form-label' for='qty'>
              Qty
            </Label>
            <InputGroup>

                <Input type='number' id='qty' placeholder='Quantity' value={formData.qty} onChange={handleChange} />
            </InputGroup>
          </div>
            <div className='mb-1'>
                <Label className='form-label' for='brand'>
                Brand
                </Label>
                <InputGroup>

                    <Input id='brand' placeholder='Brand' value={formData.brand} onChange={handleChange} />
                </InputGroup>
            </div>
            <div className='mb-1'>
                <Col >
                    <Label className='form-label' for='image'>
                        Image
                    </Label>
                    <InputGroup>

                        <img src={formData.image  }  />
                        <div style={{ width: '100%' , height : '100%', marginTop: '10px'}}>

                            <FileBase type="file" multiple={false} onDone={({ base64 }) => setFormData({ ...formData, image: base64 })} />
                        </div>
                    </InputGroup>
                </Col>
            </div>
            <div className='mb-1'>
                <Label className='form-label' for='slug'>
                Slug
                </Label>
                <InputGroup>

                    <Input id='slug' placeholder='Slug' value={formData.slug} onChange={handleChange} />
                </InputGroup>
            </div>
            <div className='mb-1'>
                <Label className='form-label' for='rating'>
                Rating
                </Label>
                <InputGroup>
                <InputGroupText>
                    <Star size={15} />
                </InputGroupText>
                <Input id='rating' placeholder='Rating' value={formData.rating} onChange={handleChange} />
                </InputGroup>
            </div>





          <Button className='me-1' color='primary' onClick={handleSubmit } >
            Submit
          </Button>
          <Button color='secondary' onClick={handleModal} outline>
            Cancel
          </Button>
        </ModalBody>
      </Modal>
  )
}

export default AddNewModal
