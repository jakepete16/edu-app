import {
  AboutApp,
  AdminDashboard,
  TeacherList,
  TeacherStoryDetails,
  FrogPage,
  LoginModal,
  MapView,
  MoveNavButton,
  Navigation,
  EdDepInfoNav,
  PictureWallNav,
} from "components";
import { HandshakeCareersContext, StudentTeacherContext, HiredTeacherPlacementContext } from "contexts";
import React, { useContext, useEffect } from "react";
import { BrowserRouter as Router, Redirect, Route, Switch, useHistory } from "react-router-dom";
// import { logoutOfPG, isLoggedInToPG, loginToPG } from "services";
import { URLPaths } from "utilities";
// eslint-disable-next-line import/extensions
import { EdDepInfo } from "./pages/EdDepInfoPage";
// eslint-disable-next-line import/extensions
import { PictureWall } from "./pages/PictureWallPage";

export function App(): JSX.Element {
  const { items: handshakeCareers, isLoading: isHandshakeCareersLoading } = useContext(
    HandshakeCareersContext,
  );
  const { items: StudentTeacher, isLoading: isStudentTeacherLoading } = useContext(
    StudentTeacherContext,
  );
  const { items: HiredTeacherPlacements, isLoading: isHiredTeacherPlacementsLoading } = useContext(
    HiredTeacherPlacementContext,
  );



  return (
    <div>
      <Router>
        

        <Switch>
          <Route exact path={URLPaths.teacherStories}>
            <Navigation />
            <MapView background />
            <TeacherList />
            <AboutApp />
          </Route>
          <Route exact path={URLPaths.admin}>
            <Navigation />
            <MapView background />
            <AdminDashboard />
            <AboutApp />
          </Route>
          <Route exact path={`${URLPaths.teacherStories}/:id`}>
            <Navigation />
            <TeacherStoryDetails />
            <AboutApp />
          </Route>
          <Route exact path={URLPaths.hiredPlacementFinder}>
            <Navigation />
            <>
            <MapView data={HiredTeacherPlacements} isLoading={isHiredTeacherPlacementsLoading}/>
            </>
            <AboutApp />
          </Route>
          <Route exact path={URLPaths.jobOpeningsFinder}>
            <Navigation />
            <AboutApp />
            <MapView data={handshakeCareers} isLoading={isHandshakeCareersLoading} />
          </Route>
          <Route exact path={URLPaths.studentTeacherFinder}>
            <Navigation />
            <>
              <MapView data={StudentTeacher} isLoading={isStudentTeacherLoading} />
            </>
            <AboutApp />
          </Route>
          <Route exact path={URLPaths.pictureWall}>
            <PictureWallNav />
            <PictureWall />
          </Route>
          <Route exact path={URLPaths.edDepInfo}>
            <EdDepInfoNav />
            <EdDepInfo />
            <AboutApp />

          </Route>
     {/*     <Route exact path={URLPaths.logout}>
            <LogoutPage />
  </Route> */}
          <Route>
            <Redirect to={URLPaths.studentTeacherFinder} />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

/*
function LogoutPage(): JSX.Element {
  const history = useHistory();

  useEffect(() => {
    logoutOfPG();
    history.goBack();
  });

  return <></>;
}
*/