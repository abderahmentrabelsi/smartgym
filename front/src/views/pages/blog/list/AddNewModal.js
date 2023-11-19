// ** React Imports
import { useState} from 'react'
import img from '@src/assets/images/elements/img.png'

// ** Third Party Components
import {User, X, MessageSquare, Hash} from 'react-feather'

// ** Reactstrap Imports
import {Modal, Label, Button, ModalHeader, ModalBody, InputGroup, InputGroupText, Col} from 'reactstrap'
import FileBase from 'react-file-base64';


// ** Styles
import '@styles/react/libs/flatpickr/flatpickr.scss'
import axios from "axios";
import {TextField} from "@material-ui/core";
import {useNavigate} from "react-router-dom";
import MySwal from "sweetalert2";



const AddNewModal = ({ open, handleModal }) => {




  // ** State
    const [formData, setFormData] = useState({});
  const navigate = useNavigate();
    const  clear = () => {
        setFormData({
            title: '',
            message: '',
            tags: '',
            selectedFile: '',
        });
    }


        const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('/posts', formData)
            .then(response => {
        navigate(`/pages/programs/detail/${response.data._id}`);
                 MySwal.fire({
                     title: 'Great!',
                     text: 'program added succefully!',
                     icon: 'success',
                     customClass: {
                         confirmButton: 'btn btn-primary'
                     },
                     buttonsStyling: false
                 }).then(r => {
                     if (r.isConfirmed) {
                         navigate(`/pages/programs/list/`);
                     }
                 })
            })
            .catch(error => {
                console.error(error);
            });

        setFormData({
            creator: 'eeee' ,
            title: '',
            message: '',
            tags: '',
            selectedFile: '',
        });
        handleModal();
    };

  return (
      <Modal
          isOpen={open}
          toggle={handleModal}
          className='sidebar-sm'
          modalClassName='modal-slide-in'
          contentClassName='pt-0'
      >
        <ModalHeader className='mb-1' toggle={handleModal} close={<X className='cursor-pointer' size={15} onClick={handleModal} />} tag='div'>
          <h5 className='modal-title'>New Program</h5>
        </ModalHeader>
        <ModalBody className='flex-grow-1'>
          <div className='mb-1'>
            <Label className='form-label' for='name'>
                Title
            </Label>
            <InputGroup>
              <InputGroupText>
                <User size={15} />
              </InputGroupText>
                <TextField name="title" variant="outlined" label="Title"  value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
            </InputGroup>
          </div>
            <div className='mb-1'>
                <Label className='form-label' for='description'>
                    Message
                </Label>
                <InputGroup>
                    <InputGroupText>
                        <MessageSquare size={15} />
                    </InputGroupText>
                    <TextField name="message" variant="outlined" label="Message"  multiline minRows={4} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} />
                </InputGroup>
            </div>
          <div className='mb-1'>
            <Label className='form-label' for='price'>
              tags
            </Label>
            <InputGroup>
              <InputGroupText>
                  <Hash size={15}/>
              </InputGroupText>
                <TextField name="tags" variant="outlined" label="Tags (coma separated)"  value={formData.tags} onChange={(e) => setFormData({ ...formData, tags: e.target.value.split(',') })} />
            </InputGroup>
          </div>

            <div className='mb-1'>
                <Col >
                    <Label className='form-label' for='image'>
                        Image
                    </Label>
                    <InputGroup>

                        <img src={formData.selectedFile ? formData.selectedFile : img} alt="image" width="100%" height="100%" />
                        <div style={{ width: '100%' , height : '100%', marginTop: '10px'}}>

                        <FileBase type="file" multiple={false} onDone={({ base64 }) => setFormData({ ...formData, selectedFile: base64 })} />
                        </div>
                    </InputGroup>
                </Col>
            </div>

          <Button className='me-1' color='primary' onClick={handleSubmit }  disabled={!formData.title || !formData.message || !formData.tags || !formData.selectedFile} >
            Submit
          </Button>
            <Button color='secondary' onClick={clear} outline style={{marginRight: '13px'}}>
                clear
        </Button>
          <Button color='secondary' onClick={handleModal} outline>
            Cancel
          </Button>




        </ModalBody>
      </Modal>
  )
}

export default AddNewModal
