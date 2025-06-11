import React from 'react'
import { useParams } from 'react-router-dom';
import { LearnCounting, LearnShapes } from '../';

const LessonPage = () => {

    const { id: param_id } = useParams()
    if (Number(param_id) == 1) {
        return <LearnShapes />
    }
    else if (Number(param_id) == 2) {
        return <LearnCounting />
    }
    // else if (Number(param_id) == 3) {
    //     return <ShapeCountChallenge />
    // }
    // else if (Number(param_id) == 4) {
    //     return <BingoGame />
    // }
    return <div>Lesson Summary not available</div>;
};


export default LessonPage
