
import Content from './Content';
import { CiMenuFries } from "react-icons/ci";
import { IoLogoGithub } from "react-icons/io";
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

  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 700);;

  useEffect(() => {
    const handleResize = () => {
      const isCurrentlyMobile = window.innerWidth < 700;
      setIsMobile(isCurrentlyMobile);
      console.log('Updated isMobile:', isCurrentlyMobile);
    };

    window.addEventListener('resize', handleResize);

    // Set initial state to ensure correctness
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  };


  const [activeIndex, setActiveIndex] = useState(null);

  const updateActiveButton = useCallback(() => {
    const viewportHeight = window.innerHeight;
    const centerY = viewportHeight / 2;

    let closestIndex = activeIndex;
    let closestDistance = Infinity;

    contentRefs.current.forEach((content, index) => {
      if (content) {
        const rect = content.getBoundingClientRect();
        const contentCenterY = rect.top + rect.height / 2;
        const distanceToCenter = Math.abs(contentCenterY - centerY);

        
        if (distanceToCenter < closestDistance) {
          closestDistance = distanceToCenter;
          closestIndex = index;
        }
      }
    });

    if (closestIndex !== activeIndex) 
    {
      if (closestIndex > 1 && closestIndex < 7){
        setActiveIndex(2)
      } else {
      setActiveIndex(closestIndex);
    }}
  
  }, [activeIndex]);

  useEffect(() => {
    window.addEventListener("scroll", updateActiveButton);
    return () => window.removeEventListener("scroll", updateActiveButton);
  }, [updateActiveButton]);

  const contentRefs = useRef([]);

  const scrollToContent = (index) => {
    if (contentRefs.current[index]) {
      const element = contentRefs.current[index];
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


  useEffect(() => {

    const handleScroll = () => {
      const scrollPosition = window.scrollY;

    if(!isMobile)
    {
      if (scrollPosition > 100 && !isMenuVisible) {
        setIsMenuVisible(true);
      }

      // Hide menu when close to the top
      if (scrollPosition <= 100 && isMenuVisible) {
        setIsMenuVisible(false);
      }
    }
  };
    
    window.addEventListener("scroll", handleScroll);
  
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMenuVisible, isMobile]);

  
const contents = [
  {
    title: 'Education',
    type: 'reg',
    description: `I'm currently studying computer science with a minor in business engineering technology. I am interested in data analytics and deep learning, and am highly considering double majoring in mathematics to pursue these interests. I am set to graduate in the fall of 2026, but will in the fall of 2027 if I double major. I hope to start a research position soon with one of our talented computer science professors in the realm of data science of machine learning. I put a lot of effort into learning outside the classroom because I believe that is deathly important with the highly competetive nature of computer science.`,
    link: 'https://www.linkedin.com/in/mackthompson1/',
    button: 'LinkedIn',
    image: BK,
  },
 

  {
    title: 'Involvement',
    type: 'reg',
    description: `On campus, I am involved in many clubs. Namely, Auburn's competitive programming team, where last year we won in our division at the University of Western Florida. This year we competed at Central Georgia Technical college. This helps me Improve my skills in data structures and algorithms. I am also involved in the technical interview associtaion where we hone our resumes and interviewing skills. I am also a member of the Lambda Chi Alpha Fraternity where I build connections and participate in charity events. I will also be boxing in a charity event this upcoming august, which I am training very hard for. `,
    image: CPT,
  },

  { 
  type:'title',
  title:'Projects'
  },

  {
    title: 'BWH Sports Camp',
    type: 'project',
    description: 'I founded a camp in my childhood neighborhood when I was a sophomore in highschool. It has grown exponentially every summer, taking around 55 kids for three week-long sessions this year. I am in charge of advertising, finance, counselor training, organization, and day to day operation. Estimated gross revenue is >$100,000. Unfortunately, I had to pass on the ownership to my little brother as I venture into the realm of software engineering. The last session I will run will be this winter break. Building and perfecting this camp has been an infinetly valuable learning experience for me.',
    link: 'https://www.instagram.com/bwh_sports_camp/',
    button: 'Our Instagram',
    image: CAMP,
  },

  {
    title: 'WeCal',
    type: 'project',
    description: 'To learn database management and frontend backend communication, I created a social calendar sharing platform. Users can create and manage their schedule, invite friends, and schedule group events. Users will get live updates for friend and meeting invites. I coded this in Java Script and used SQLITE3 for my data, WebSocket for live updates, and react for the calendar component and some other features.',
    link: 'https://github.com/mackthompson16/WeCal',
    button: 'View Project',
    image: WECAL,
  },

  {
    title: 'Email Manager',
    type: 'project',
    description: ` To learn about cloud computing, I created a bot that listens to incoming messages, reads a pre-written context file, and responds to them based on OpenAI's chat completion API. I used google cloud console to host the script, and a pub/sub notifcation system to listen for incoming messages. I coded this in python.`,
    link: 'https://github.com/mackthompson16/EmailBot',
    button: 'View Project',
    image: EMAIL,
  },

  {
    title: 'Freshman Hackathon',
    type: 'project',
    description: `My First group project using GitHub (with many more to come) was a simple react project that webscrapes from a dataset on Nasa's Mars Rovers, and displays them on our website to create a mars weather app. This taught us a lot about managing group projects, fetching apis, and introduced us to frontend programming languages.`,
    link: 'https://github.com/eli-standard/Mars-Meteo',
    button: 'View Project',
    image: METEO,
  },

  {
    title: 'Early Life',
    description: `Born in Atlanta in 2004, I am the middle of an older sister who attends Skidmore College, and a younger brother in ninth grade. I graduated from Westminster highschool in 2023. I was heavily involved in athletics, mainly the wrestling team where I won region champion in my division senior year. I also was the president and co-founder of the coding club, where I prepared tech talks on related topics weekly.`,
    image: HS,
    type:'last'
  },

];
return (
  <div className="App">
    <header className="App-header">
      <h1>I'm Mack</h1>
      <p>a Computer Science Student.</p>
    </header>

    <div className="page">

    {isMobile && (
        <button
          className="show-menu-button"
          onClick={toggleMenu}
        >
        <CiMenuFries />
        </button>
      )}
     
      <div className={`side-menu ${isMenuVisible ? "visible" : "hidden"}`}>
         

        {contents.map((content, index) => (
         

          content.type !== 'project' && (
           <button
             key={index}
             onClick={() => scrollToContent(index)}
             className={`menu-button ${
               index === activeIndex ? "active-button" : ""
             }`}
           >
             {content.title}
           </button>
            )
        ))}

        </div>
  
      <div className="contents">
 

        {contents.map((content, index) => (

            <div
            key={index}
            ref={(el) => (contentRefs.current[index] = el)} 
            >
            {content.type==='title' && (<div className="title"><h1>PROJECTS</h1></div>)}

            {content.type!=='title'&&(
            <Content
            key={index}
            title={content.title}
            description={content.description}
            link={content.link}
            image={content.image}
            button={content.button}
            type={content.type}
            isLeft={index % 2 === 0} // Alternates between left and right
          />   
          )}
          </div>
        ))}
        <h2>Email mackthompson16@gmail.com with inqueries</h2>
        <a style={{fontSize:50,  textDecoration: 'none', color:'white'}} href="https://github.com/mackthompson16/MyWebsite" target="_blank" rel="noopener noreferrer">
           <IoLogoGithub />
        </a>
      </div>
    </div>
  </div>
);
};
export default App;