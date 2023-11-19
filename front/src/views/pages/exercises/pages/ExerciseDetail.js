import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {Container} from 'reactstrap';

import {exerciseOptions, fetchData, youtubeOptions} from '../utils/fetchData';
import Detail from '../components/Detail';
import ExerciseVideos from '../components/ExerciseVideos';
import SimilarExercises from '../components/SimilarExercises';

const ExerciseDetail = () => {
    const [exerciseDetail, setExerciseDetail] = useState({});
    const [exerciseVideos, setExerciseVideos] = useState([]);
    const [targetMuscleExercises, setTargetMuscleExercises] = useState([]);
    const [equipmentExercises, setEquipmentExercises] = useState([]);
    const {id} = useParams();

    useEffect(() => {
        window.scrollTo({top: 0, behavior: 'smooth'});

        const fetchExercisesData = async () => {
            const exerciseDbUrl = 'https://exercisedb.p.rapidapi.com';
            const youtubeSearchUrl = 'https://youtube-search-and-download.p.rapidapi.com';

            const exerciseDetailData = await fetchData(`${exerciseDbUrl}/exercises/exercise/${id}`, exerciseOptions);
            setExerciseDetail(exerciseDetailData);

            const exerciseVideosData = await fetchData(`${youtubeSearchUrl}/search?query=${exerciseDetailData.name} exercise`, youtubeOptions);
            setExerciseVideos(exerciseVideosData.contents);

            const targetMuscleExercisesData = await fetchData(`${exerciseDbUrl}/exercises/target/${exerciseDetailData.target}`, exerciseOptions);
            setTargetMuscleExercises(targetMuscleExercisesData);

            const equimentExercisesData = await fetchData(`${exerciseDbUrl}/exercises/equipment/${exerciseDetailData.equipment}`, exerciseOptions);
            setEquipmentExercises(equimentExercisesData);
        };

        fetchExercisesData();
    }, [id]);

    if (!exerciseDetail) return <div>No Data</div>;

    return (

        <div>
            <Detail exerciseDetail={exerciseDetail}/>

            <div >

                <div>
                    <ExerciseVideos exerciseVideos={exerciseVideos} name={exerciseDetail.name}/>
                </div>

                <div>
                    <SimilarExercises
                        targetMuscleExercises={targetMuscleExercises}
                        equipmentExercises={equipmentExercises}
                        style={{marginLeft: '200px', marginTop: '242px'}}
                    />
                </div>


            </div>

        </div>

    );
};

export default ExerciseDetail;