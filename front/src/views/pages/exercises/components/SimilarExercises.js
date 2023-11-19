import React from 'react';
import { Container, Row, Col } from 'reactstrap';

import HorizontalScrollbar from './HorizontalScrollbar';
import Loader from './Loader';

const SimilarExercises = ({ targetMuscleExercises, equipmentExercises }) => (
    <div style={{ marginTop: '100px' }} >
        <div>
            <div>
                <h2 className="mb-3" style={{ fontWeight: 700, color: '#000', marginTop: '90px' }}>
                    Similar <span style={{ color: '#786DF1FF', textTransform: 'capitalize' }}>Target Muscle</span> exercises
                </h2>
                <div className="d-flex">
                    {targetMuscleExercises.length !== 0 ? (
                        <HorizontalScrollbar data={targetMuscleExercises.slice(0, 5)} />
                    ) : (
                        <Loader />
                    )}
                </div>
            </div>
        </div>
        <div>
            <div>
                <h2 className="mb-3" style={{ fontWeight: 700, color: '#000', marginTop: '123px', marginLeft: '0' }}>
                    Similar <span style={{ color: '#786DF1FF', textTransform: 'capitalize' }}>Equipment</span> exercises
                </h2>
                <div className="d-flex">
                    {equipmentExercises.length !== 0 ? (
                        <HorizontalScrollbar data={equipmentExercises.slice(0, 5)} />
                    ) : (
                        <Loader />
                    )}
                </div>
            </div>
        </div>
    </div>
);

export default SimilarExercises;