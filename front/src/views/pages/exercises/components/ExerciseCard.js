import React from 'react';
import { Link } from 'react-router-dom';
import {Button, CardTitle} from 'reactstrap';
import { Row, Col, Card, CardBody } from "reactstrap";
import { useState } from 'react';

const ExerciseCard = ({ exercise }) => (





<Card>
    <Link className="exercise-card" to={`/exercise/${exercise.id.toString().padStart(4, '0')}`}>
        <CardBody >
            <img src={exercise.gifUrl} alt={exercise.name} loading="lazy" />
            <div className="d-flex">
                <Button className="mr-2" color="secondary" style={{ fontSize: '14px', borderRadius: '20px', textTransform: 'capitalize' }}>
                    {exercise.bodyPart}
                </Button>
                <Button className="mr-2" color="primary" style={{ fontSize: '14px', borderRadius: '20px', textTransform: 'capitalize' }}>
                    {exercise.target}
                </Button>
            </div>
            <CardTitle>
            <div className="ml-2 mt-3 mb-1" style={{ fontSize: '24px', fontWeight: 'bold', textTransform: 'capitalize' }}>
                {exercise.name}
            </div>
            </CardTitle>
        </CardBody>
    </Link>
</Card>
);
export default ExerciseCard;

