import React from "react";
import Home from "../Components/Home";
import TopSelling from "../Components/TopSelling";
import HairConcerns from "../Components/HairConcerns";
import TopSelling2 from "../Components/TopSelling2";
import Combos from "../Components/Combos";
import Review from "../Components/Review";
import Contact from "../Components/Contact";

const HomePage = () => {
  return (
    <>
      <Home />
      <TopSelling />
      <HairConcerns />
      <TopSelling2 />
      <Combos />
      <Review />
      {/* <Contact /> */}
    </>
  );
};

export default HomePage;
