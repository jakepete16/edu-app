import { CuratedTeacher } from "models";
import React from "react";
import { createCommaSeparatedList } from "utilities";

interface TeacherSecondaryInfoProps {
  /** The alum whose details should be displayed. */
  teacher: CuratedTeacher;
  /** Whether the details should be shown in a row or column. */
  direction?: "row" | "column";
}

/** Reusable component to display secondary information for an alum. */
export function TeacherSecondaryInfo({
  teacher,
  direction,
}: TeacherSecondaryInfoProps): JSX.Element {
  return (
    <div className={`secondary-info d-flex flex-${direction || "row"}`}>
      {teacher.location && (
        <span>
          <i className="fas fa-location-arrow" />
          {teacher.location}
        </span>
      )}
      {teacher.majors && (
        <span>
          <i className="fas fa-graduation-cap" />
          {createCommaSeparatedList(teacher.majors)}
        </span>
      )}
      {teacher.schoolName && (
        <span>
          <i className="fas fa-briefcase" />
          {teacher.position ? `${teacher.position} at ` : ""}
          {teacher.schoolName}
        </span>
      )}
    </div>
  );
}
