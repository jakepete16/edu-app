import { NavPositionContext, UserContext } from "contexts";
import React, { useContext } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link, useLocation } from "react-router-dom";
import { URLPaths } from "utilities";
import { BsFillArrowLeftCircleFill } from "react-icons/bs";
import { BsFillArrowRightCircleFill } from "react-icons/bs";
import "./Navigation.scss";

/** Generating the navigation bar which include categorical options */
/** This file can also be added with further authentification for administrative privilege */
export const pictureWallNavBarHeight = "4.5rem";

export function PictureWallNav(): JSX.Element {
  const user = useContext(UserContext);
  const { navPosition } = useContext(NavPositionContext);

  return (
    <Navbar bg="light" style={{ height: pictureWallNavBarHeight }}>
      <LNavLinkArrow path={URLPaths.studentTeacherFinder}> </LNavLinkArrow>
      <Container>
        <h1 className="navbar-title">Current Student Teachers and Alumni</h1>
        <Nav>
          
          <a href={URLPaths.edFacultyStaff} target="_blank"> Education Department Faculty and Staff </a>
          
        </Nav>

      </Container>

      <RNavLinkArrow path={URLPaths.edDepInfo}> </RNavLinkArrow>
    </Navbar>
  );
}

type NavLinkProps = {
  path: string;
  children: React.ReactNode;
};

function NavLink({ path, children }: NavLinkProps): JSX.Element {
  const { pathname } = useLocation();
  return (
    <Link to={path} className={`nav-link ${pathname === path ? "active" : ""}`}>
      {children}
    </Link>
  );
}



function RNavLinkArrow({ path, children }: NavLinkProps): JSX.Element {
  const { pathname } = useLocation();
  return (
    <Link to={path} id="right-nav-arrow" className={`nav-link-arrow-right  ${pathname === path ? "active" : ""}`}>
      {children}
      <BsFillArrowRightCircleFill />
    </Link>
  );
}

function LNavLinkArrow({ path, children }: NavLinkProps): JSX.Element {
  const { pathname } = useLocation();
  return (
    <Link to={path} id="left-nav-arrow" className={`nav-link-arrow-left  ${pathname === path ? "active" : ""}`}>
      {children}
      <BsFillArrowLeftCircleFill />
    </Link>
  );
}

