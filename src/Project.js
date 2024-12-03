// Project.js
import React from 'react';


const Project = ({ title, description, link, image, isLeft }) => {
  return (
    <div className={`project ${isLeft ? 'left' : 'right'}`}>
      <div className={`project-content ${isLeft ? 'left' : 'right'}`}>
        <h2>{title}</h2>
        <p>{description}</p>
        <a href={link} target="_blank" rel="noopener noreferrer">
          View Project
        </a>
      </div>
      <div className="project-image">
        <img src={image} alt={title} />
      </div>
    </div>
  );
};

export default Project;
