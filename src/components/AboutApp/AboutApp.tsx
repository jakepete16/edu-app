import { BottomButton, InfoModal } from "components/reusables";
import React, { useState } from "react";

export function AboutApp(): JSX.Element {
  const [display, setDisplay] = useState<true | false>(false);

  return (
    <>
      <BottomButton position="left" onClick={() => setDisplay(true)}>
        About
      </BottomButton>
      <InfoModal
        show={display}
        onHide={() => setDisplay(false)}
        title="About This App"
        /* message="This application was created for the Boerigter Center for Calling and Career to show current and prospective students the opportunities available to them through a Hope College education. It was developed in the 2020–2021 academic year by computer science majors Jonathan Chaffer, Josie Crane, Nam Do, and Will von Seeger, under the supervision of Dr. Matt DeJongh and Dr. Mike Jipping." */
        message="This application was created for the Hope College Education Department to show where both current student teachers and placed graduates are now working. Hope
        College grads are well equipped for teaching the next generation of young minds how to think critically in both school and life. We wish the best of luck to all of our
        education students and graduates!"
      />
    </>
  );
}
