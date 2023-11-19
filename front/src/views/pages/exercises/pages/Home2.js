import React, { useState } from 'react';
import Exercices from "@src/views/pages/exercises/components/exercices";

const Home = () => {
    const [exercises, setExercises] = useState([]);
    const [bodyPart, setBodyPart] = useState('all');
    const [user,setUser] = useState(JSON.parse(localStorage.getItem('userData')));// on recupere le profile de l'utilisateur a partir de reducer auth.js

    if (!user) {
        (navigation.navigate('/auth/not-auth'))
    }

    return (
        <div>
            <div style={{display: 'flex', justifyContent: 'flex-start'}}>
                <Exercices setExercises={setExercises} exercises={exercises} bodyPart={bodyPart} />

            </div>
        </div>
    );
};

export default Home;
