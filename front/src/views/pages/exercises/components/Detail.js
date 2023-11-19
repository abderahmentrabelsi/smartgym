import React from 'react';
import { Card, CardTitle, CardText, Button, Row, Col } from 'reactstrap';

import BodyPartImage from '../assets/icons/body-part.png';
import TargetImage from '../assets/icons/target.png';
import EquipmentImage from '../assets/icons/equipment.png';

const Detail = ({ exerciseDetail }) => {
  const { bodyPart, gifUrl, name, target, equipment } = exerciseDetail;

  const extraDetail = [
    {
      icon: BodyPartImage,
      name: bodyPart,
    },
    {
      icon: TargetImage,
      name: target,
    },
    {
      icon: EquipmentImage,
      name: equipment,
    },
  ];

  return (
      <Row className="d-flex flex-lg-row flex-column align-items-center p-3">
        <Col xs="12" lg="6" className="mb-5">
          <img src={gifUrl} alt={name} loading="lazy" className="detail-image w-100" />
        </Col>
        <Col xs="12" lg="6">
          <Card body className="bg-transparent border-0">
            <CardTitle tag="h2" className="text-capitalize" style={{ fontSize: '3rem', fontWeight: 700 }}>
              {name}
            </CardTitle>
            <CardText className="text-muted" style={{ fontSize: '1.2rem' }}>
              Exercises keep you strong. <span className="text-capitalize">{name}</span> bup is one
              of the best <br /> exercises to target your {target}. It will help you improve your{' '}
              <br /> mood and gain energy.
            </CardText>
            {extraDetail?.map((item) => (
                <Row key={item.name} className="align-items-center mb-3">
                  <Col xs="auto">
                    <Button style={{ background: '#FFF2DB', borderRadius: '50%', width: '100px', height: '100px' }}>
                      <img src={item.icon} alt={bodyPart} style={{ width: '50px', height: '50px' }} />
                    </Button>
                  </Col>
                  <Col>
                    <CardTitle tag="h5" className="text-capitalize" style={{ fontSize: '1.5rem' }}>
                      {item.name}
                    </CardTitle>
                  </Col>
                </Row>
            ))}
          </Card>
        </Col>
      </Row>
  );
};

export default Detail;
