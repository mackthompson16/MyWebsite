import { useEffect } from "react";


const Content = ({ title, description, link, image, isLeft, button,type }) => {

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
    <div className={`content ${type==='special' ?  'special':''} ${isLeft ? 'left' : 'right'} ${type==='last'? 'last':''}`}>
      <div className={`content-content ${type==='special' ?  'special':''} ${isLeft ? 'left' : 'right'}`}>
        
        {type!=='special'&& (<h1 class="fade-in">{title}</h1>)}
        
        {type==='special'&&

        <div className='special'>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
        }
        {type !== 'special'&& (
        
        <p class="fade-in">{description}</p>
        )}

        {button && (
           <div className="button">
          <a class="fade-in" href={link} target="_blank" rel="noopener noreferrer">
          {button}
          </a>
          </div>
        )}
       
      
      
      </div>
        
      {image && (
      <div className="content-image">
        
        <img class="fade-in" src={image} alt={title} />
        
      </div>
      )}


    </div>
  );
};

export default Content;
