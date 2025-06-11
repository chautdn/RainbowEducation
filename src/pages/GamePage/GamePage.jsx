import React, { useState } from "react";
import { useParams } from "react-router-dom";
import FruitsCountChallenge from "../coutingGames/fruitsCount/FruitsCountChallenge";
import CountAndMatchGame from "../coutingGames/countMatchChallenge/CountAndMatchGame";
import ShapeCountChallenge from "../coutingGames/shapeCountChallenge/ShapeCountChallenge";

import CallOutNumber from "../coutingGames/callOutNumber/CallOutNumber";
const GamePage = () => {
  const { id: param_id } = useParams();
  if (Number(param_id) == 1) {
    return <FruitsCountChallenge />;
  } else if (Number(param_id) == 2) {
    return <CountAndMatchGame />;
  } else if (Number(param_id) == 3) {
    return <ShapeCountChallenge />;
  } else if (Number(param_id) == 5) {
    return <CallOutNumber />;
  }
  return <div>Game not found</div>;
};

export default GamePage;
