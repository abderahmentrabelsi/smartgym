import React, { useContext } from 'react';
import { ScrollMenu, VisibilityContext } from 'react-horizontal-scrolling-menu';
import { Container, Row, Col } from 'reactstrap';

import ExerciseCard from './ExerciseCard';
import BodyPart from './BodyPart';
import RightArrowIcon from '../assets/icons/right-arrow.png';
import LeftArrowIcon from '../assets/icons/left-arrow.png';

const LeftArrow = () => {
    const { scrollPrev } = useContext(VisibilityContext);

    return (
        <div onClick={() => scrollPrev()} className="right-arrow">
            <img src={LeftArrowIcon} alt="right-arrow" />
        </div>
    );
};

const RightArrow = () => {
    const { scrollNext } = useContext(VisibilityContext);

    return (
        <div onClick={() => scrollNext()} className="left-arrow">
            <img src={RightArrowIcon} alt="right-arrow" />
        </div>
    );
};

const VerticalScrollbar = ({ data, bodyParts, setBodyPart, bodyPart }) => (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
        <ScrollMenu >
            {data.map((item) => (
                <div
                    key={item.id || item}
                    itemID={item.id || item}
                    title={item.id || item}
                    style=

                        {{
                            marginTop: '10px',
                        m: '0 40px',
                        display: 'inline-flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        textAlign: 'center',
                        borderRadius: '10px',
                        padding: '10px',
                        width: '340px',
                        height: '80px',
                        overflow: 'hidden',
                        scrollbarWidth: 'thin',
                        scrollbarColor: '#FF2625 #F5F5F5',
                    }}
                >
                    {bodyParts ? (
                        <BodyPart item={item} setBodyPart={setBodyPart} bodyPart={bodyPart} />
                    ) : (
                        <ExerciseCard exercise={item} />
                    )}
                </div>
            ))}
        </ScrollMenu>

    </div>
);

export default VerticalScrollbar;
