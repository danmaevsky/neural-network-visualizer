import "./SideBar.css";
import { useState } from "react";
export function SideBar(props) {
  const toggleShowTutorial = props.toggleShowTutorial;
  const [showContactInfo, setShowContactInfo] = useState(false);

  return (
    <div className="sideBar" tabIndex={-1}>
      <h2 className="showTutorialButton" onClick={() => toggleShowTutorial(true)}>
        Show Tutorial
      </h2>
      <h2 className="contactInfoButton" onClick={() => setShowContactInfo(true)}>
        Contact Info
      </h2>
      {showContactInfo ? (
        <ul className="contactInfo">
          <li>Daniel Maevsky</li>
          <li>daniel.maevsky@rutgers.edu</li>
        </ul>
      ) : null}
      <h2 className="darkModeButton">Dark Mode! (TBD)</h2>
      <h2 className="copyrightMessage">© {new Date().getFullYear()} Daniel Maevsky</h2>
    </div>
  );
}
