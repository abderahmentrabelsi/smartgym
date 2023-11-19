import React from 'react';
import { Card, CardImg, CardBody, CardTitle, CardText, Row, Col } from 'reactstrap';
import { thirdweb } from '../assets';
import { daysLeft } from '../utils';

const FundCard = ({ owner, title, description, target, deadline, amountCollected, image, handleClick }) => {
  const remainingDays = daysLeft(deadline);

  return (
      <Col>
        <Card className="w-100 rounded-15 cursor-pointer" onClick={handleClick}>
          <CardImg top src={image} alt="fund" className="px-2 pt-1" style={{
            maxHeight: 300,
            objectFit: 'cover',
          }} />
          <CardBody className="p-2">
            <div className="d-block">
              <CardTitle className="text-white text-left mb-0">{title}</CardTitle>
              <CardText className="mt-1 mb-3 text-muted text-left">{description}</CardText>
            </div>
            <div className="d-flex flex-column justify-content-between mb-3">
              <div className="d-flex align-items-center gap-1">
                <span className="mr-2">{amountCollected}</span>
                <span className="text-muted mb-0">Raised of {target}</span>
              </div>
              <div className="d-flex align-items-center gap-1">
                <span className="mr-2">{remainingDays}</span>
                <span className="text-muted mb-0">Days Left</span>
              </div>
            </div>
            <div className="d-flex align-items-center gap-1">
              <img src={thirdweb} alt="user" className="rounded-circle mr-2" style={{ maxWidth: 33 }} />
              <span className="flex-grow-1 mb-0 text-muted text-left">{`by ${owner}`}</span>
            </div>
          </CardBody>
        </Card>
      </Col>
  );
};

export default FundCard;
