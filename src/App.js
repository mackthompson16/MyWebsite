
import Project from './Project';
import React, { useRef } from "react";
import "./App.css";

import BK from './images/BK.jpg'
import CAMP from './images/camp.png'
import EMAIL from './images/email.png'
import METEO from './images/meteo.jpg'
import WECAL from './images/wecal.png'
import HS from './images/hs.jpg'
import CPT from './images/cpt.jpg'

const App = () => {
  const projectRefs = useRef([]);

  const scrollToProject = (index) => {
    if (projectRefs.current[index]) {
      projectRefs.current[index].scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };


const projects = [
  {
    title: 'Education',
    description: `I'm currently studying computer science and mathematics with a minor in business engineering technology. I am interested in data analytics and deep learning. I hope to start a research position soon.`,
    link: 'https://example.com/project1',
    image: BK,
  },
  {
    title: 'BWH Sports Camp',
    description: 'For the past 4 summers, I have worked at a camp that I founded in my childhood neighborhood. Last summer, we took around 55 kids for three week long sessions. I am in charge of advertising, finance, counselor training, organization, and day to day operation. Estimated gross revenue is >$100,000',
    link: 'https://example.com/project2',
    image: CAMP,
  },

  {
    title: 'Involvement',
    description: `I am involved in Auburn's competitive programming team. Last year, we won in our division at the University of Western Florida. This year we competed at Central Georgia Technical college. This helps me Improve my skills in data structures and algorithms. I am also involved in the technical interview associtaion. `,
    link: 'https://example.com/project2',
    image: CPT,
  },

  {
    title: 'Early Life',
    description: `Born in Atlanta in 2004, I am the middle of an older sister who attends Skidmore College, and a younger brother in ninth grade. I graduate from Westminster highschool in 2023, heavily involved in athletics, mainly the wrestling team where I won region champion in my division senior year. I also was the president of the coding club, where I prepared tech talks on related topics weekly.`,
    link: 'https://example.com/project2',
    image: HS,
  },

  {
    title: 'Social Media Platform',
    description: 'To learn database management and frontend backend communication, I created a social calendar sharing platform. Users can create and manage their schedule, invite friends, and schedule group events. Users will get live updates for friend and meeting invites. I coded this in Java Script and used SQLITE3 for my data, WebSocket for live updates, and react for the calendar component and some other features.',
    link: 'https://example.com/project2',
    image: WECAL,
  },

  {
    title: 'Email Manager',
    description: ` To learn about cloud computing, I created a bot that listens to incoming messages, reads a pre-written context file, and responds to them based on OpenAI's chat completion API. I used google cloud console to host the script, and a pub/sub notifcation system to listen for incoming messages. I coded this in python.`,
    link: 'https://example.com/project2',
    image: EMAIL,
  },

  {
    title: 'Freshman Hackathon Project',
    description: `My First group project using GitHub (with many more to come) was a simple react project that fetches data from Nasa's Mars Rovers APIS, and displays them on our website to create a mars weather app. This taught us a lot about managing group projects, fetching apis, and introduced us to frontend programming languages.`,
    link: 'https://example.com/project2',
    image: METEO,
  },



];
return (
  <div className="App">
    <header className="App-header">
      <h1>Mack Thompson</h1>
      <p>Aspiring Software Engineer</p>
    </header>

    <div className="page">
     
        <div className="side-menu">
          {projects.map((project, index) => (
            <button
              key={index}
              onClick={() => scrollToProject(index)}
              className="menu-button"
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