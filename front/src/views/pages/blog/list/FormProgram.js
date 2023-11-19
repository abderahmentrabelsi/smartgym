// ** React Imports
import { useState} from 'react'

// ** Third Party Components
import { X,  Sliders, Speaker, Maximize2, UserCheck} from 'react-feather'

// ** Reactstrap Imports
import {
    Modal,
    Label,
    Button,
    ModalHeader,
    ModalBody,
    InputGroup,
    InputGroupText,
    FormGroup,
    Input
} from 'reactstrap'



// ** Styles
import '@styles/react/libs/flatpickr/flatpickr.scss'
import {useNavigate} from "react-router-dom";



const AddNewModal = ({ open, handleModal }) => {




    // ** State
    const [formData, setFormData] = useState({});
    const navigate = useNavigate();
    const  clear = () => {
        setFormData({
            gender: '',
            age: '',
            height: '',
            weight: '',
            fitnesslevel: ''
        });
    }
    const data = {
        gender: formData.gender,
        age: parseInt(formData.age),
        height: parseInt(formData.height),
        weight: parseInt(formData.weight),
        fitnesslevel: parseInt(formData.fitnesslevel)
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        navigate('/pages/exercises/listexercises', { state: { formData: data } });


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
                <h5 className='modal-title'>Get A Free Program</h5>
            </ModalHeader>
            <ModalBody className='flex-grow-1'>


                <div className='mb-1'>
                    <Label className='form-label' for='age'>
                        Age
                    </Label>
                    <InputGroup>
                        <InputGroupText>
                            <UserCheck size={15} />
                        </InputGroupText>
                        <select
                            name="age"
                            value={formData.age}
                            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                            className="form-select"
                        >
                            {Array.from({ length: 63 }, (_, i) => i + 18).map((age) => (
                                <option key={age} value={age}>
                                    {age}
                                </option>
                            ))}
                        </select>
                    </InputGroup>


                </div>
                <div className='mb-1'>
                    <Label className='form-label' for='height'>
                        Height(cm)
                    </Label>
                    <InputGroup>
                        <InputGroupText>
                            <Maximize2 size={15} />
                        </InputGroupText>
                        <select
                            name="height"
                            value={formData.height}
                            onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                            className="form-select"
                        >
                            {Array.from({ length: 181 }, (_, i) => i + 100).map((height) => (
                                <option key={height} value={height}>
                                    {height}
                                </option>
                            ))}
                        </select>
                    </InputGroup>

                </div>

                <div className='mb-1'>
                    <Label className='form-label' for='weight'>
                        Weight(kg)
                    </Label>
                    <InputGroup>
                        <InputGroupText>
                            <Speaker size={15} />
                        </InputGroupText>
                        <select
                            name="weight"
                            value={formData.weight}
                            onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                            className="form-select"
                        >
                            {Array.from({ length: 136 }, (_, i) => i + 45).map((weight) => (
                                <option key={weight} value={weight}>
                                    {weight}
                                </option>
                            ))}
                        </select>
                    </InputGroup>

                </div>

                <div className='mb-1'>
                    <Label className='form-label'>
                        Gender
                    </Label>
                    <div>
                        <FormGroup check>
                            <Label check>
                                <Input type="radio" name="gender" value="male" checked={formData.gender === 'male'} onChange={(e) => setFormData({ ...formData, gender: e.target.value })} />
                                {' '}
                                Male
                            </Label>
                        </FormGroup>
                        <FormGroup check>
                            <Label check>
                                <Input type="radio" name="gender" value="female" checked={formData.gender === 'female'} onChange={(e) => setFormData({ ...formData, gender: e.target.value })} />
                                {' '}
                                Female
                            </Label>
                        </FormGroup>
                    </div>
                </div>

                <div className='mb-1'>
                    <Label className='form-label' for='age'>
                        Fitness Level
                    </Label>
                    <InputGroup>
                        <InputGroupText>
                            <Sliders size={15} />
                        </InputGroupText>
                        <div className="d-flex align-items-center">
                            <input
                                type="range"
                                name="fitnesslevel"
                                min="0"
                                max="10"
                                value={formData.fitnesslevel}
                                onChange={(e) => setFormData({ ...formData, fitnesslevel: e.target.value })}
                                className="form-range"
                            />
                            <span className="ms-2">{formData.fitnesslevel}</span>
                        </div>
                    </InputGroup>

                </div>

                <Button className='me-1' color='primary' onClick={handleSubmit }
                  disabled=
                {!formData.age ||
                !formData.height ||
                !formData.weight ||
                !formData.fitnesslevel }
                >
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
