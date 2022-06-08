import { NavPositionContext, UserContext } from "contexts";
import logo from "assets/images/hopeedulogo.png";
import React, { useContext } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link, useLocation, useHistory } from "react-router-dom";
import { URLPaths } from "utilities";
import { logout } from "services";
import { BsFillArrowLeftCircleFill } from "react-icons/bs";
import { BsFillArrowRightCircleFill } from "react-icons/bs";
import "./Navigation.scss";

/** Generating the navigation bar which include categorical options */
/** This file can also be added with further authentification for administrative privilege */
export const navbarHeight = "4.5rem";


export function Navigation(): JSX.Element {
  const user = useContext(UserContext);
  const { navPosition } = useContext(NavPositionContext);
  
  return (
    <Navbar bg="light" fixed={navPosition} style={{ height: navbarHeight }}>
      <LNavLinkArrow path={URLPaths.edDepInfo}> </LNavLinkArrow>
      <Container>
        <EdImage  />
        <Nav>
          <AdNavLink path={URLPaths.teacherStories}>Admin Login</AdNavLink>
          {/* <NavLink path={URLPaths.poll}>Quick Poll</NavLink> */}
          {/* <NavLink path={URLPaths.admin}>Admin</NavLink> */}
          {/*  This is the Admin button for administrative access  */}
          {/*  {!!user && <NavLink path={URLPaths.admin}>Admin</NavLink>}  */}
        </Nav>
        <Nav>
          {/* <NavLink path={URLPaths.alumFinder}>Find Alumni</NavLink>
          <NavLink path={URLPaths.careerFinder}>Career Opportunities</NavLink>
          <NavLink path={URLPaths.offCampusFinder}>Off-Campus Study</NavLink> */}
          <NavLink path={URLPaths.studentTeacherFinder} >Hope Partners</NavLink>
          <NavLink path={URLPaths.jobOpeningsFinder}>Find Job Openings</NavLink>
          <NavLink path={URLPaths.hiredPlacementFinder}>Hope Teachers in the World</NavLink>
        </Nav>
      </Container>
      <RNavLinkArrow path={URLPaths.pictureWall}> </RNavLinkArrow>
    </Navbar>
  );
}

type NavLinkProps = {
  path: string;
  children: React.ReactNode;
};

function AdNavLink({ path, children }: NavLinkProps): JSX.Element {
  const { pathname } = useLocation();
  
  return (
    <Link to={path} className={`nav-link ${pathname === path ? "active" : ""}`} >
      {children}
    </Link>
  );
}

function NavLink({ path, children }: NavLinkProps): JSX.Element {
  const { pathname } = useLocation();
  const history = useHistory();
  return (
    <Link to={path} className={`nav-link ${pathname === path ? "active" : ""}`} /* onClick={() => logout().then(() => history.push("/"))} */>
      {children}
    </Link>
  );
}

function RNavLinkArrow({ path, children }: NavLinkProps): JSX.Element {
  const { pathname } = useLocation();
  return (
    <Link
      to={path}
      id="right-nav-arrow"
      className={`nav-link-arrow-right  ${pathname === path ? "active" : ""}`}
    >
      {children}
      <BsFillArrowRightCircleFill />
    </Link>
  );
}

function LNavLinkArrow({ path, children }: NavLinkProps): JSX.Element {
  const { pathname } = useLocation();
  return (
    <Link
      to={path}
      id="left-nav-arrow"
      className={`nav-link-arrow-left  ${pathname === path ? "active" : ""}`}
    >
      {children}
      <BsFillArrowLeftCircleFill />
    </Link>
  );
}

function EdImage(): JSX.Element {
  
  
  return (
    <img className="edlogo" id="logo" alt="edu" src={logo}></img>
  );
}
