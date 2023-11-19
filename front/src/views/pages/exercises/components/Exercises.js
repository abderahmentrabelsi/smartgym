import React, { useEffect, useState } from "react";
import { Pagination as ReactstrapPagination, PaginationItem, PaginationLink } from "reactstrap";
import { Container } from "reactstrap";

import { exerciseOptions, fetchData } from "../utils/fetchData";
import ExerciseCard from "./ExerciseCard";
import Loader from "./Loader";

const Exercises = ({ exercises, setExercises, bodyPart }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [exercisesPerPage] = useState(6);

  useEffect(() => {
    const fetchExercisesData = async () => {
      let exercisesData = [];

      if (bodyPart === "all") {
        exercisesData = await fetchData("https://exercisedb.p.rapidapi.com/exercises", exerciseOptions);
      } else {
        exercisesData = await fetchData(`https://exercisedb.p.rapidapi.com/exercises/bodyPart/${bodyPart}`, exerciseOptions);
      }

      setExercises(exercisesData);
    };

    fetchExercisesData();
  }, [bodyPart]);

  // Pagination
  const indexOfLastExercise = currentPage * exercisesPerPage;
  const indexOfFirstExercise = indexOfLastExercise - exercisesPerPage;
  const currentExercises = exercises.slice(indexOfFirstExercise, indexOfLastExercise);

  const paginate = (event, value) => {
    setCurrentPage(value);

    window.scrollTo({ top: 1800, behavior: "smooth" });
  };

  if (!currentExercises.length) return <Loader />;

  const pageCount = Math.ceil(exercises.length / exercisesPerPage);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div id="exercises" style={{ marginTop: "109px" }} mt="50px" p="20px">
      <Container>
        <div style={{ marginBottom: "28px", marginLeft: "40px" }}>
          <h4 style={{ fontSize: "44px", fontWeight: "bold" }}>Showing Results</h4>
        </div>
        <div style={{ gap: "107px", display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
          {currentExercises.map((exercise, idx) => (
            <ExerciseCard key={idx} exercise={exercise} />
          ))}
        </div>
        <div style={{ marginTop: "114px", display: "flex", alignItems: "center" }}>
          {exercises.length > 9 && (
            <ReactstrapPagination className="mb-4">
              {Array.from({ length: pageCount }).map((_, index) => {
                if (index - 3 < currentPage && currentPage <= index + 4) {
                  return (
                    <PaginationItem key={index} active={index + 1 === currentPage}>
                      <PaginationLink onClick={() => handlePageChange(index + 1)}>{index + 1}</PaginationLink>
                    </PaginationItem>
                  );
                } else {
                  return null
                }
              })}
              {/*{pageCount > 9 && (*/}
              {/*  <PaginationItem disabled>*/}
              {/*    <PaginationLink>...</PaginationLink>*/}
              {/*  </PaginationItem>*/}
              {/*)}*/}
              {/*<PaginationItem>*/}
              {/*  <PaginationLink onClick={() => handlePageChange(pageCount)}>*/}
              {/*    {pageCount}*/}
              {/*  </PaginationLink>*/}
              {/*</PaginationItem>*/}
            </ReactstrapPagination>
          )}
        </div>
      </Container>
    </div>
  );
};

export default Exercises;
