
import Project from './Project';

import React, { useRef, useState, useEffect,  useCallback} from "react";
import "./App.css";

import BK from './images/BK.jpg'
import CAMP from './images/camp.png'
import EMAIL from './images/email.png'
import METEO from './images/meteo.jpg'
import WECAL from './images/wecal.png'
import HS from './images/hs.jpg'
import CPT from './images/cpt.jpg'

const App = () => {

  const [activeIndex, setActiveIndex] = useState(null);

  const updateActiveButton = useCallback(() => {
    const viewportHeight = window.innerHeight;
    const centerY = viewportHeight / 2;

    let closestIndex = null;
    let closestDistance = Infinity;

    projectRefs.current.forEach((project, index) => {
      if (project) {
        const rect = project.getBoundingClientRect();
        const projectCenterY = rect.top + rect.height / 2;
        const distanceToCenter = Math.abs(projectCenterY - centerY);

        
        if (distanceToCenter < closestDistance) {
          closestDistance = distanceToCenter;
          closestIndex = index;
        }
      }
    });

    if (closestIndex !== activeIndex) {
      setActiveIndex(closestIndex);
    }
  }, [activeIndex]);

  useEffect(() => {
    window.addEventListener("scroll", updateActiveButton);
    return () => window.removeEventListener("scroll", updateActiveButton);
  }, [updateActiveButton]);

  const projectRefs = useRef([]);

  const scrollToProject = (index) => {
    if (projectRefs.current[index]) {
      const element = projectRefs.current[index];
      const elementRect = element.getBoundingClientRect();
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const viewportHeight = window.innerHeight;
  
      // Calculate the scroll position to center the element
      const offset = scrollTop + elementRect.top - viewportHeight / 2 + elementRect.height/4;
  
      // Smooth scroll to the calculated position
      window.scrollTo({
        top: offset,
        behavior: "smooth",
      });
    }
  };


  const [isMenuVisible, setIsMenuVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;

      // Show menu when scrolling down past 100px
      if (scrollPosition > 100 && !isMenuVisible) {
        setIsMenuVisible(true);
      }

      // Hide menu when close to the top
      if (scrollPosition <= 100 && isMenuVisible) {
        setIsMenuVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMenuVisible]);

  
const projects = [
  {
    title: 'Education',
    description: `I'm currently studying computer science with a minor in business engineering technology. I am interested in data analytics and deep learning, and am highly considering double majoring in mathematics to pursue these interests. I am set to graduate in the fall of 2026, but will in the fall of 2027 if I double major. I hope to start a research position soon with one of our talented computer science professors in the realm of data science of machine learning. I put a lot of effort into learning outside the classroom because I believe that is deathly important with the highly competetive nature of computer science.`,
    link: 'https://www.linkedin.com/in/mack-thompson-185283280/',
    button: 'LinkedIn',
    image: BK,
  },
  {
    title: 'BWH Sports Camp',
    description: 'I founded a camp in my childhood neighborhood when I was a sophomore in highschool. It has grown exponentially every summer, taking around 55 kids for three week-long sessions this year. I am in charge of advertising, finance, counselor training, organization, and day to day operation. Estimated gross revenue is >$100,000. Unfortunately, I had to pass on the ownership to my little brother as I venture into the realm of software engineering. The last session I will run will be this winter break. Building and perfecting this camp has been an infinetly valuable learning experience for me.',
    link: 'https://www.instagram.com/bwh_sports_camp/',
    button: 'Our Instagram',
    image: CAMP,
  },

  {
    title: 'Involvement',
    description: `On campus, I am involved in many clubs. Namely, Auburn's competitive programming team, where last year we won in our division at the University of Western Florida. This year we competed at Central Georgia Technical college. This helps me Improve my skills in data structures and algorithms. I am also involved in the technical interview associtaion where we hone our resumes and interviewing skills. I am also a member of the Lambda Chi Alpha Fraternity where I build connections and participate in charity events. I will also be boxing in a charity event this upcoming august, which I am training very hard for. `,
    image: CPT,
  },

  {
    title: 'Early Life',
    description: `Born in Atlanta in 2004, I am the middle of an older sister who attends Skidmore College, and a younger brother in ninth grade. I graduated from Westminster highschool in 2023. I was heavily involved in athletics, mainly the wrestling team where I won region champion in my division senior year. I also was the president and co-founder of the coding club, where I prepared tech talks on related topics weekly.`,
    image: HS,
  },

  {
    title: 'WeCal',
    description: 'To learn database management and frontend backend communication, I created a social calendar sharing platform. Users can create and manage their schedule, invite friends, and schedule group events. Users will get live updates for friend and meeting invites. I coded this in Java Script and used SQLITE3 for my data, WebSocket for live updates, and react for the calendar component and some other features.',
    link: 'https://github.com/mackthompson16/WeCal',
    button: 'view project',
    image: WECAL,
  },

  {
    title: 'Email Manager',
    description: ` To learn about cloud computing, I created a bot that listens to incoming messages, reads a pre-written context file, and responds to them based on OpenAI's chat completion API. I used google cloud console to host the script, and a pub/sub notifcation system to listen for incoming messages. I coded this in python.`,
    link: 'https://github.com/mackthompson16/EmailBot',
    button: 'view project',
    image: EMAIL,
  },

  {
    title: 'Freshman Hackathon',
    description: `My First group project using GitHub (with many more to come) was a simple react project that fetches data from Nasa's Mars Rovers APIS, and displays them on our website to create a mars weather app. This taught us a lot about managing group projects, fetching apis, and introduced us to frontend programming languages.`,
    link: 'https://github.com/eli-standard/Mars-Meteo',
    button: 'view project',
    image: METEO,
  },



];
return (
  <div className="App">
    <header className="App-header">
      <h1>I'm Mack,</h1>
      <p>a Computer Science Student.</p>
    </header>

    <div className="page">
     
      <div className={`side-menu ${isMenuVisible ? "visible" : "hidden"}`}>
         

        {projects.map((project, index) => (
           <button
             key={index}
             onClick={() => scrollToProject(index)}
             className={`menu-button ${
               index === activeIndex ? "active-button" : ""
             }`}
           >
             {project.title}
           </button>
        ))}

        </div>
  
      <div className="projects">
 

        {projects.map((project, index) => (

            <div
            key={index}
            ref={(el) => (projectRefs.current[index] = el)} 
            >
              
            <Project
            key={index}
            title={project.title}
            description={project.description}
            link={project.link}
            image={project.image}
            button={project.button}
            isLeft={index % 2 === 0} // Alternates between left and right
          />   
          </div>
        ))}
      </div>
    </div>
  </div>
);
};
export default App;