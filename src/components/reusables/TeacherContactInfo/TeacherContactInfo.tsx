import { CuratedTeacher } from "models";
import React from "react";
import { standardizePhoneNumber } from "utilities";

interface TeacherContactInfoProps {
  /** The alum whose details should be displayed. */
  teacher: CuratedTeacher;
}

/** Reusable component to display contact information for an alum. */
export function TeacherContactInfo({ teacher }: TeacherContactInfoProps): JSX.Element {
  return (
    <div className="secondary-info d-flex flex-column">
      {teacher.email && (
        <span>
          <i className="fas fa-envelope" />
          {teacher.email}
        </span>
      )}
      {teacher.phone && (
        <span>
          <i className="fas fa-phone-alt" />
          {standardizePhoneNumber(teacher.phone)}
        </span>
      )}
    </div>
  );
}
