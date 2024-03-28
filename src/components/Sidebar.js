import MenuIcon from '@mui/icons-material/Menu';
import InfoIcon from '@mui/icons-material/Info';
import HomeIcon from '@mui/icons-material/Home';
import LogoDevIcon from '@mui/icons-material/LogoDev';
import { NavLink } from 'react-router-dom';
import { useState } from 'react';

export default function Sidebar({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  const toggle = () => setIsOpen(!isOpen);
  const sideBarItems = [
    {
      name: "Dashboard",
      icon: <HomeIcon />,
      path: "/"
    },
    {
      name: "Backlog",
      icon: <LogoDevIcon />,
      path: "/backlog"
    },
    {
      name: "About",
      icon: <InfoIcon />,
      path: "/about"
    }
  ]
  return (
    <div className='container-fluid'>
      <div className="sidebar" style={{ width: isOpen ? "200px" : "50px", maxWidth: isOpen ? "200px" : "50px"}}>
        <div className='top-section' style={{ paddingBottom: isOpen ? "" : "2px"}}>
          <h1 className='logo' style={{ display: isOpen ? "block" : "none" }}>Logo</h1>
          <div className='bars' style={{ marginLeft: isOpen ? "75px" : "-24px", padding: isOpen ? "0px":"10px 15px"}}>
            <MenuIcon onClick={toggle} />
          </div>
        </div>
        {
          sideBarItems.map((item, index) => (
            <NavLink to={item.path} key={index} className="link" activeclassname="active">
              <div className="icon">
                {item.icon}
              </div>
              <div className="link_text"
                style={{ display: isOpen ? "block" : "none" }}
              >
                {item.name}
              </div>
            </NavLink>
          ))
        }
      </div>
      <div className="page-contents">{children}</div>
    </div>
  )
}
