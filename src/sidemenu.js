

const SideMenu = ({ projects, scrollToProject }) => {
  

  return (
    <div className="side-menu">
      {projects.map((project, index) => (
        <button
          key={index}
          onClick={() => scrollToProject(index)}
          className={`menu-button ${index === activeIndex ? "active-button" : ""}`}
        >
          {project.title}
        </button>
      ))}
    </div>
  );
};

export default SideMenu;
