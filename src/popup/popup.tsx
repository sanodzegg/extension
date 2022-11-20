import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './popup.css'
import uuid from "react-uuid";
import { motion } from "framer-motion";

import Logo from "../assets/logo.svg";

let identifyUser:string |  null;

chrome.storage.sync.get(['username'], (res) => {
  if(res) identifyUser = res.username;
  else identifyUser = null; 
});

const App: React.FC<{}> = () => {
  const unique = uuid();
  const [user, setUser] = useState(identifyUser);
  const [userName, setUserName] = useState("");
  const [violations, setViolations] = useState<any>([]);
  const [eligible, setEligible] = useState(false);

  useEffect(() => {
    if(userName.length > 2) setEligible(true);
    else setEligible(false);
  }, [userName]);

  const handleSaveButton = () => {
    chrome.storage.sync.set({ username: userName, id: unique });
    window.close();
    window.open("https://guardingchamp.netlify.app/");
  }  

  useEffect(() => {
    const handleLocalViolations = async () => {
      chrome.storage.sync.get(['violations'], (res) => {
        setViolations([res.violations.data.sensitivity]);
      });
    }

    handleLocalViolations();
  }, []);

  if(!user) {
    return (
      <div className="uiwrapper">
        <div className="greeter">
          <input type="text" placeholder='Enter your name..' onChange={(e) => setUserName(e.target.value)} />
          <button onClick={handleSaveButton} className={`${eligible ? 'active' : 'disabled'}`}>save</button>
        </div>
      </div>
    )
  }

  if(user && violations.length === 0) {
    return (
      <div className='uiwrapper'>
        <motion.nav className='navbar' initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7, type: "spring" }}>
          <h4>Welcome back {user}!</h4>
        </motion.nav>
        <a href="https://guardingchamp.netlify.app/" target="_blank" rel='noreferer'><img src={Logo} alt="logo" className='logo' /></a>
        <span className='loadingspan'>Loading...</span>
      </div>
    )
  }

  const keys = violations[0] && Object.keys(violations[0]);
  const parsedKeys = keys && keys.map(e => e.charAt(0).toUpperCase() + e.slice(1).replaceAll("_", " "));
  
  const values = violations[0] && Object.values(violations[0]);

  if(user && violations) {
    return (
      <div className="uiwrapper">
        <div className="violations">
          <p>{user}, I've found several violations on this page.</p>
          <ul>
            {violations[0] && Object.values(violations[0]).map((_, i) => {
              return <li key={i}>{`${parsedKeys[i]}: ${values && values[i]}`}</li>
            })}           
          </ul>
          <div className="actionbuttons">
            <button className='main'>Report this page</button>
            <button className='secondary' onClick={() => window.close()}>Cancel</button>
          </div>
        </div>
      </div>
    )
  }

  return null;
}

const container = document.createElement('div')
document.body.appendChild(container)
const root = createRoot(container)
root.render(<App />)
