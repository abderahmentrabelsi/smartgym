import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import Loader from './Loader';

const ExerciseVideos = ({ exerciseVideos, name }) => {
    if (!exerciseVideos.length) return <Loader />;

    return (
        <Container className="mt-5 pt-3">
            <Row>
                <Col>
                    <h4 className="mb-3 font-weight-bold">
                        Watch{' '}
                        <span style={{ color: '#786DF1FF', textTransform: 'capitalize' }}>{name}</span> exercise videos
                    </h4>
                </Col>
            </Row>
            <Row>
                {exerciseVideos?.slice(0, 3)?.map((item, index) => (
                    <Col key={index} lg="4" md="12" className="mb-4">
                        <a
                            className="exercise-video"
                            href={`https://www.youtube.com/watch?v=${item.video.videoId}`}
                            target="_blank"
                            rel="noreferrer"
                        >
                            <img
                                style={{ borderTopLeftRadius: '20px' }}
                                src={item.video.thumbnails[0].url}
                                alt={item.video.title}
                                className="img-fluid"
                            />
                            <div>
                                <h5 className="font-weight-bold">{item.video.title}</h5>
                                <p>{item.video.channelName}</p>
                            </div>
                        </a>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default ExerciseVideos;