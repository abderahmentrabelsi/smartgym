import React, { useState } from 'react';
import SearchExercises from "@src/views/pages/exercises/components/SearchExercises";
import Exercises from "@src/views/pages/exercises/components/Exercises";

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
            <Exercises setExercises={setExercises} exercises={exercises} bodyPart={bodyPart} />

            <div style={{marginTop: '120px'}}>
            <SearchExercises setExercises={setExercises} bodyPart={bodyPart} setBodyPart={setBodyPart} />
            </div>
        </div>

    </div>


  );
};

export default Home;
