import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import "../../styles/homepage.scss";

const HomePage = () => {
  const titleRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      titleRef.current,
      { opacity: 0, scale: 0.5 },
      { opacity: 1, scale: 1, duration: 2, ease: "power2.out" }
    );
  }, []);

  return (
    <div className="container">
      <header className="header"></header>
      <div className="intro-view" ref={titleRef}></div>
    </div>
  );
};

export default HomePage;
