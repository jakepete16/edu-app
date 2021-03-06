import { App } from "components";
import {
  BackgroundLoaderProvider,
  HandshakeCareersContext,
  HiredTeacherPlacementContext,
  NavPositionProvider,
  StudentTeacherContext,
  UserProvider,
} from "contexts";
import React from "react";
import ReactDOM from "react-dom";
import { fetchHandshakeCareers, getAllStudentTeachers } from "services";
import { getAllHiredPlacements } from "services/hiredPlacementsService";
import "styles/fonts.scss";
import "styles/index.scss";
import { createCommaSeparatedList } from "utilities";

const requiredEnvContents = ["REACT_APP_GOOGLE_API_KEY", "REACT_APP_HANDSHAKE_API_KEY"];

const missingEnvContents: string[] = [];
requiredEnvContents.forEach(key => {
  if (!process.env[key]) {
    missingEnvContents.push(key);
  }
});
if (missingEnvContents.length > 0) {
  // eslint-disable-next-line no-console
  console.error(
    `Your local environment is missing the following keys: ${createCommaSeparatedList(
      missingEnvContents,
    )}. Make sure that you have an .env file in your root directory with the required contents.`,
  );
}

ReactDOM.render(
  <React.StrictMode>
    <UserProvider>
    <BackgroundLoaderProvider 
        numPages={1} 
        fetchFn={getAllHiredPlacements} 
        context={HiredTeacherPlacementContext}
        >
    <BackgroundLoaderProvider
        numPages={100}
        fetchFn={fetchHandshakeCareers}
        context={HandshakeCareersContext}
      >
        <BackgroundLoaderProvider 
        numPages={1} 
        fetchFn={getAllStudentTeachers} 
        context={StudentTeacherContext}
        >
        
          <NavPositionProvider>
            <App />
          </NavPositionProvider>
        </BackgroundLoaderProvider>
        </BackgroundLoaderProvider>
      </BackgroundLoaderProvider>
    </UserProvider>
  </React.StrictMode>,
  document.getElementById("root") || document.createElement("div"),
);
