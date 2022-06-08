import genericAvatar from "assets/images/generic_avatar.jpg";
import placeholderImg from "assets/images/placeholder_img.jpg";
import { HandshakeCareer, HiredTeacherPlacements, Mappable, StudentTeacher } from "models";
import React, { useCallback } from "react";
import { useAsync } from "react-async";
import { Col, Row, Spinner } from "react-bootstrap";
import Img from "react-cool-img";
import { getStudentTeacher, getHiredPlacement } from "services";
import { createCommaSeparatedList } from "utilities";

/** Creating an interface for the PopoverItem function, for easier Popover Item generation */
interface PopoverItemProps<I extends Mappable> {
  item: I;
}

/** Generating Popover Item based on the type of item which is either student-teacher or hired or career */
export function PopoverItem<I extends Mappable>({ item }: PopoverItemProps<I>): JSX.Element {
  switch (item.type) {
    case "student-teacher": {
      const studentTeacher = (item as unknown) as StudentTeacher;
      return <StudentTeacherPopover studentTeacher={studentTeacher} />;
    }
    case "hired": {
      const hiredPlacement = (item as unknown) as HiredTeacherPlacements;
      return <HiredPlacementPopover hiredPlacement={hiredPlacement} />;
    }
    case "career": {
      const job = (item as unknown) as HandshakeCareer;
      return <CareerPopoverItem career={job} />;
    }
    default:
      return <span>#{item.id}</span>;
  }
}

/** Creating an interface for the StudentTeacherPopover function, for easier studentTeacher Popover Item generation */
interface StudentTeacherPopoverProps {
  studentTeacher: StudentTeacher;
}

/** Generating studentTeacherPopover Item with its properties */
function StudentTeacherPopover({ studentTeacher }: StudentTeacherPopoverProps): JSX.Element {
  const promiseFn = useCallback(() => getStudentTeacher(studentTeacher.identifier), [
    studentTeacher.identifier,
  ]);
  const { data, isPending } = useAsync({ promiseFn });

  return (
    <Row className="studentTeacher-popover-item">
      <Col xs={3} className="d-flex align-items-center">
        <div className="img-circle-container">
          <Img
            src={studentTeacher.photoUrl}
            placeholder={genericAvatar}
            alt={`${studentTeacher.firstName} ${studentTeacher.lastName}`}
            width="100%"
            lazy
          />
        </div>
      </Col>
      <Col className="d-flex align-items-center">
        <div>
          <h4>{`${studentTeacher.firstName} ${studentTeacher.lastName}`}</h4>
          <div className="secondary-info d-flex flex-column">
            {studentTeacher.majors?.length > 0 && (
              <span>
                <i className="fas fa-graduation-cap" />
                {createCommaSeparatedList(studentTeacher.majors)}
              </span>
            )}
            {isPending ? (
              <Spinner animation="border" variant="secondary" size="sm" />
            ) : (
              data?.workHistory[0] && (
                <span>
                  <i className="fas fa-briefcase" />
                  {data.workHistory[0].companyTitle}
                </span>
              )
            )}
          </div>
        </div>
      </Col>
    </Row>
  );
}

/** Creating an interface for the StudentTeacherPopover function, for easier studentTeacher Popover Item generation */
interface HiredPlacementPopoverProps {
  hiredPlacement: HiredTeacherPlacements;
}

/** Generating studentTeacherPopover Item with its properties */
function HiredPlacementPopover({ hiredPlacement }: HiredPlacementPopoverProps): JSX.Element {
  const promiseFn = useCallback(() => getHiredPlacement(hiredPlacement.identifier), [
    hiredPlacement.identifier,
  ]);
  const { data, isPending } = useAsync({ promiseFn });

  return (
    <Row className="hiredPlacement-popover-item">
      <Col xs={3} className="d-flex align-items-center">
        <div className="img-circle-container">
          <Img
            src={hiredPlacement.photoUrl}
            placeholder={genericAvatar}
            alt={`${hiredPlacement.firstName} ${hiredPlacement.lastName}`}
            width="100%"
            lazy
          />
        </div>
      </Col>
      <Col className="d-flex align-items-center">
        <div>
          <h4>{`${hiredPlacement.firstName} ${hiredPlacement.lastName}`}</h4>
          <div className="secondary-info d-flex flex-column">
            {hiredPlacement.majors?.length > 0 && (
              <span>
                <i className="fas fa-graduation-cap" />
                {createCommaSeparatedList(hiredPlacement.majors)}
              </span>
            )}
            {isPending ? (
              <Spinner animation="border" variant="secondary" size="sm" />
            ) : (
              data?.workHistory[0] && (
                <span>
                  <i className="fas fa-briefcase" />
                  {data.workHistory[0].companyTitle}
                </span>
              )
            )}
          </div>
        </div>
      </Col>
    </Row>
  );
}

/** Creating an interface for the CareerPopoverItem function, for easier Career Popover Item generation */
interface CareerPopoverItemProps {
  career: HandshakeCareer;
}

/** Generating Career Item with its properties */
function CareerPopoverItem({ career }: CareerPopoverItemProps): JSX.Element {
  return (
    <Row className="job-popover-item">
      <Col xs={3} className="d-flex align-items-center">
        <div>
          <Img
            src={career.employer_logo_url}
            placeholder={placeholderImg}
            width="100%"
            loading="lazy"
          />
        </div>
      </Col>
      <Col className="d-flex align-items-center">
        <div>
          <h4>{career.job_name}</h4>
          <div className="secondary-info d-flex flex-column">
            {career.employer_name && (
              <span>
                <i className="fas fa-briefcase" />
                {career.employer_name}
              </span>
            )}
            {career.employment_type_name && (
              <span>
                <i className="fas fa-clock" />
                {career.employment_type_name}
              </span>
            )}
            {career.job_city && (
              <span>
                <i className="fas fa-location-arrow" />
                {career.job_city}
              </span>
            )}
          </div>
        </div>
      </Col>
    </Row>
  );
}
