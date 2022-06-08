import { PageContainerDiv } from "components/reusables";
// import { DOMPurify } from "dompurify";
import React from "react";
import myPic from "../../../images/education-dep-flowchart.png"
import "./EdDepInfo.scss";
import edStat1 from "../../../images/michigan-ed-attainment.png";
import edStat2 from "../../../images/applicants-by-experience.png";
import edStat3 from "../../../images/hope-college-honors-percent-total-graduates.png";
import edStat4 from "../../../images/undergraduate-enrollment-by-gender.png";
// import { ReactEmbeddedGoogleCalendar } from "react-embedded-google-calendar";



const myCalSrc = "https://calendar.google.com/calendar/embed?src=cadence.tennant%40gmail.com&ctz=America%2FNew_York";

  export function EdDepInfo(): JSX.Element {
  return (
    <PageContainerDiv>
     <div className="grid-container-ed">
       <div className="grid-item-1">Below is the upcoming events calendar</div>
       <div className="grid-item-2">Below are some Fast Facts and Stats about the Ed Department</div>
       <div className="grid-item-3" >
         <iframe src={myCalSrc} width="800" height="600" scrolling="no"></iframe>
       </div>
       <div className="grid-item-4">
         <img className="img1" src={edStat1}></img>
       </div>
       <div className="grid-item-5">
         <img className="img1" src={edStat3}></img>
       </div>
       <div className="grid-item-6">Item6</div>
       <div className="grid-item-7">Hello7</div>
       <div className="grid-item-8">Hello8</div>
       <div className="grid-item-9">Hello9</div>
     </div>
    </PageContainerDiv>
  );
}