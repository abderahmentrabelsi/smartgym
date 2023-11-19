import React from "react";
import { Link } from "react-router-dom";
import Icons from "./Icons";

export default function BottomNavbar() {
  return (
    <nav className="d-flex justify-content-center ">
      <Link to="/pages/diary" className="link blue hover-silver dib mh2 tc">
        <Icons icon="diary" />
        <span className="fst-normal">Diary</span>
      </Link>

      <Link to="/pages/analysis" className="link blue hover-silver dib mh2 tc">
        <Icons icon="analysis" />
        <span className="fst-normal">Analysis</span>
      </Link>

      <Link to="/pages/diary/add-item" className="link blue hover-silver dib mh2 tc">
        <Icons icon="add" />
        <span className="fst-normal">add</span>
      </Link>

      <Link to="/pages/recipes" className="link blue hover-silver dib mh3 tc">
        <Icons icon="recipes" />
        <span className="fst-normal">Recipes</span>
      </Link>

      <br/>
    </nav>
    
  );
}
