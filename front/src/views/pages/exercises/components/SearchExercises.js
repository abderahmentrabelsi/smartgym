import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Input, Button } from 'reactstrap';

import { exerciseOptions, fetchData } from '../utils/fetchData';
import VerticalScrollbar from './VerticalScrollbar';

const SearchExercises = ({ setExercises, bodyPart, setBodyPart }) => {
    const [search, setSearch] = useState('');
    const [bodyParts, setBodyParts] = useState([]);

    useEffect(() => {
        const fetchExercisesData = async () => {
            const bodyPartsData = await fetchData('https://exercisedb.p.rapidapi.com/exercises/bodyPartList', exerciseOptions);

            setBodyParts(['all', ...bodyPartsData]);
        };

        fetchExercisesData();
    }, []);

    const handleSearch = async () => {
        if (search) {
            const exercisesData = await fetchData('https://exercisedb.p.rapidapi.com/exercises', exerciseOptions);

            const searchedExercises = exercisesData.filter(
                (item) => item.name.toLowerCase().includes(search)
                    || item.target.toLowerCase().includes(search)
                    || item.equipment.toLowerCase().includes(search)
                    || item.bodyPart.toLowerCase().includes(search),
            );

            window.scrollTo({ top: 1800, left: 100, behavior: 'smooth' });

            setSearch('');
            setExercises(searchedExercises);
        }
    };

    return (
        <div>
            <Container>
                <Row>
                    <Col md="8">
                        <Input
                            style={{ borderRadius: '40px' }}
                            value={search}
                            onChange={(e) => setSearch(e.target.value.toLowerCase())}
                            placeholder="Search Exercises"
                            type="text"
                        />
                    </Col>
                    <Col md="4">
                        <Button
                            style={{ borderRadius: '20px', marginTop: '3px' ,marginRight: '200px',marginBottom: '40px'}}
                            color="primary"
                            className="ms-2"
                            onClick={handleSearch}
                        >
                            Search
                        </Button>
                    </Col>
                </Row>
            </Container>

            <Container style={{ position: 'relative', width: '100%', padding: '20px' }}>
                <VerticalScrollbar data={bodyParts} bodyParts setBodyPart={setBodyPart} bodyPart={bodyPart} />
            </Container>
        </div>
    );
};

export default SearchExercises;
