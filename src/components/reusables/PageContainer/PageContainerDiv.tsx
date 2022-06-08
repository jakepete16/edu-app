import { navbarHeight } from "components/Navigation";
import { NavPositionContext } from "contexts";
import React, { useContext } from "react";
import "./PageContainerDiv.scss";

interface PageContainerProps {
  children: React.ReactNode;
}

/** Responsive container for page contents. */
export function PageContainerDiv({ children }: PageContainerProps): JSX.Element {
 // const { navPosition } = useContext(NavPositionContext);

  return (
    <div
      className="page-container-div" 
    >
      {children}
    </div>
  );
}
