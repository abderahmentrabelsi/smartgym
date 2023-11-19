import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import { Container, Card, CardBody, CardHeader, Row, Col, Label, Input } from 'reactstrap';

import { useStateContext } from '../context';
import { money } from '../assets';
import { CustomButton, Loader } from '../components';
import { checkIfImage } from '../utils';
import { Button } from 'reactstrap'

const CreateCampaign = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { createCampaign } = useStateContext();
  const [form, setForm] = useState({
    name: '',
    title: '',
    description: '',
    target: '',
    deadline: '',
    image: ''
  });

  const handleFormFieldChange = (fieldName, e) => {
    setForm({ ...form, [fieldName]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    checkIfImage(form.image, async (exists) => {
      if (exists) {
        setIsLoading(true);
        await createCampaign({ ...form, target: ethers.utils.parseUnits(String(form.target), 18) });
        setIsLoading(false);
        navigate('/apps/campaigns');
      } else {
        alert('Provide valid image URL');
        setForm({ ...form, image: '' });
      }
    });
  };

  return (
    <Container className="mt-5">
      {isLoading && <Loader />}
      <Card>
        <CardHeader>
          <h1 className="font-weight-bold fs-4 fs-sm-5 lh-lg">Start a Campaign</h1>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} className="w-100">
            <Row>
              <Col className="mb-1" xl="6" md="12" sm="12">
                <Label className="form-label" htmlFor="nameInput">
                  Your Name *
                </Label>
                <Input
                  type="text"
                  id="nameInput"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={(e) => handleFormFieldChange('name', e)}
                />
              </Col>
              <Col className="mb-1" xl="6" md="12" sm="12">
                <Label className="form-label" htmlFor="titleInput">
                  Campaign Title *
                </Label>
                <Input
                  type="text"
                  id="titleInput"
                  placeholder="Write a title"
                  value={form.title}
                  onChange={(e) => handleFormFieldChange('title', e)}
                />
              </Col>
            </Row>

            <Row className="mt-3">
              <Col className="mb-1" xl="12" md="12" sm="12">
                <Label className="form-label" htmlFor="descriptionInput">
                  Story *
                </Label>
                <Input
                  type="textarea"
                  id="descriptionInput"
                  placeholder="Write your story"
                  value={form.description}
                  onChange={(e) => handleFormFieldChange('description', e)}
                />
              </Col>
            </Row>
            <Row className="mt-3">
              <Col className="mb-1" xl="6" md="12" sm="12">
                <Label className="form-label" htmlFor="goalInput">
                  Goal *
                </Label>
                <Input
                  type="text"
                  id="goalInput"
                  placeholder="ETH 0.50"
                  value={form.target}
                  onChange={(e) => handleFormFieldChange('target', e)}
                />
              </Col>
              <Col className="mb-1" xl="6" md="12" sm="12">
                <Label className="form-label" htmlFor="endDateInput">
                  End Date *
                </Label>
                <Input
                  type="date"
                  id="endDateInput"
                  placeholder="End Date"
                  value={form.deadline}
                  onChange={(e) => handleFormFieldChange('deadline', e)}
                />
              </Col>
            </Row>

            <Row className="mt-3">
              <Col className="mb-1" xl="12" md="12" sm="12">
                <Label className="form-label" htmlFor="imageInput">
                  Campaign image *
                </Label>
                <Input
                  type="url"
                  id="imageInput"
                  placeholder="Place image URL of your campaign"
                  value={form.image}
                  onChange={(e) => handleFormFieldChange('image', e)}
                />
              </Col>
            </Row>

            <div className="d-flex justify-content-center mt-4">
              <Button.Ripple
                title="Submit new campaign"
                color='primary'
                onClick={handleSubmit}
              >
                Submit new campaign
              </Button.Ripple>
            </div>
          </form>
        </CardBody>
      </Card>
    </Container>
  );
};

export default CreateCampaign;
