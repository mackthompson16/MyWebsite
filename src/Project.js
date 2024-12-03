import { useEffect } from "react";

const Project = ({ title, description, link, image, isLeft, button }) => {
  useEffect(() => {
    const fadeInElements = document.querySelectorAll(".fade-in");

    const observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target); // Stop observing this element
          }
        });
      },
      { threshold: 0.1 } // Trigger when 10% of the element is visible
    );

    fadeInElements.forEach(el => observer.observe(el));

    // Clean up observer on component unmount
    return () => observer.disconnect();
  }, []); // Empty dependency array ensures this runs only once

  return (
    <div className={`project ${isLeft ? 'left' : 'right'}`}>
      <div className={`project-content ${isLeft ? 'left' : 'right'}`}>
        <h1 class="fade-in">{title}</h1>
        <p class="fade-in">{description}</p>
        {button && (
          <a class="fade-in" href={link} target="_blank" rel="noopener noreferrer">
          {button}
        </a>
        )}
      </div>
      <div className="project-image">
        <img class="fade-in" src={image} alt={title} />
      </div>
    </div>
  );
};

export default Project;
