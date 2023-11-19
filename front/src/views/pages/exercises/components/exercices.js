import React, { useEffect, useState } from 'react';
import Pagination from '@mui/material/Pagination';

import ExerciseCard from './ExerciseCard';
import Loader from './Loader';
import {Link, useLocation} from "react-router-dom";
import {Container, Row, Col, Pagination as ReactstrapPagination, PaginationItem, PaginationLink} from 'reactstrap';

const Exercices  = ({ exercises, setExercises, bodyPart }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [exercisesPerPage,setExercisesPerPage] = useState(5);
    const location = useLocation();
    const formData = location.state?.formData;
    const [fatWheight, setFatWheight] = useState(0);
    const [bodyMass, setBodyMass] = useState(0);
    const [programDifficulty, setProgramDifficulty] = useState(0);
    const [sets, setSets] = useState(0);



    const provideData = {
        gender: formData.gender || 'male',
        age: parseInt(formData.age) || 18,
        height: parseInt(formData.height) || 100,
        weight: parseInt(formData.weight) || 45,
        fitnesslevel: parseInt(formData.fitnesslevel) || 5
    };
    const handleSubmit = (e) => {

        fetch('https://program-generator-api.mkadmi.tech/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(provideData)
        })
            .then(response => response.json())
            .then(data => {
                setExercises(data.exercises);
                setFatWheight(provideData.wheight - data['leanbodymass']);
                setBodyMass(data['leanbodymass']);
                setProgramDifficulty(data.score);
                setExercisesPerPage(data.n==1 || data.n == 2 ? 8 : data.n);
                setSets(data.n);

                // Handle the response data here


            })
            .catch(error => {
                console.error(error);
            });

    };

    useEffect(() => {
        const fetchExercisesData = async () => {

            await handleSubmit();


        };
        console.log(sets)
        console.log(programDifficulty)
        console.log(bodyMass)
        console.log(fatWheight)


        fetchExercisesData();
    }, [bodyPart]);

    // Pagination
    const indexOfLastExercise = currentPage * exercisesPerPage;
    const indexOfFirstExercise = indexOfLastExercise - exercisesPerPage;
    const currentExercises = exercises.slice(indexOfFirstExercise, indexOfLastExercise);

    const paginate = (event, value) => {
        setCurrentPage(value);

        window.scrollTo({ top: 1800, behavior: 'smooth' });
    };

    if (!currentExercises.length) return <Loader />;

    const pageCount = Math.ceil(exercises.length / exercisesPerPage);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    return (
        <Container id="exercises" className="mt-5 p-4">
            <div className='d-flex justify-content-flex-start'>

                <div style={{ marginLeft: '10px' , marginBottom : '20px' , fontSize : '30px' , fontWeight: 'normal', fontFamily: 'Montserrat' }}>
                    <Link to='/'> Home </Link>
                </div>

                <div style={{ marginTop: '8px', marginLeft: '10px' , fontSize : '20px' , fontWeight: 'lighter' }}>
                    | <Link to='/pages/programs/list'>  Programs ></Link> Exercises List
                </div>
            </div>
            <Row className="justify-content-between align-items-center">
                <Col>
                    Fat Weight: {(provideData.weight - bodyMass).toString()} kg<br/>
                </Col>
                <Col>
                    Body Mass: {bodyMass.toString()} kg<br/>
                </Col>
                <Col>
                    Sets: {sets.toString()} each exercise <br/>
                </Col>
                <Col>
                    cardio: {sets * 10} minutes after workout<br/>
                </Col>
            </Row>
            <div className="mb-4" style={{ marginBottom: '28px', marginLeft: '40px', marginTop: '28px', fontSize: '44px', fontWeight: 'bold' }}>
                Day: {currentPage === 6 ? '5' : (currentPage === 7 || currentPage === 8 || currentPage === 9 || currentPage === 10) ? '6' : currentPage + 0}<br/>
            </div>
            <div style={{ gap: '107px', display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                {currentExercises.map((exercise, idx) => (
                    <ExerciseCard key={idx} exercise={exercise} />
                ))}
            </div>
            <div style={{ marginTop: '114px', display: 'flex', alignItems: 'center' }}>
                {exercises.length > 9 && (
                    <ReactstrapPagination className="mb-4">
                        {Array.from({ length: pageCount }).map((_, index) => (
                            <PaginationItem key={index} active={index + 1 === currentPage}>
                                <PaginationLink onClick={() => handlePageChange(index + 1)}>{index + 1}</PaginationLink>
                            </PaginationItem>
                        ))}
                    </ReactstrapPagination>
                )}
            </div>
        </Container>



    );
};



export default Exercices;