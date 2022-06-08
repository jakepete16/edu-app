import genericAvatar from "assets/images/generic_avatar.jpg";
import { ErrorModal, PageContainer } from "components";
import { TeacherContactInfo, TeacherSecondaryInfo } from "components/reusables";
import { AddEditTeacherModal } from "components/reusables/AddEditTeacherModal";
import { UserContext } from "contexts";
import React, { useCallback, useContext, useState } from "react";
import { useAsync } from "react-async";
import { Button, Card, Col, Row, Spinner } from "react-bootstrap";
import Img from "react-cool-img";
import { Redirect, useParams } from "react-router-dom";
import { getTeacherStory } from "services";
import { generateFullName, URLPaths } from "utilities";

export function TeacherStoryDetails(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const user = useContext(UserContext);
  const [isShowingEditTeacherModal, setIsShowingEditTeacherModal] = useState(false);
  const promiseFn = useCallback(() => getTeacherStory(id), [id]);
  const { data, error, isPending } = useAsync({ promiseFn });
  const teacher = data;

  if (!teacher && !isPending) return <Redirect to={URLPaths.teacherStories} />;

  return (
    <>
      <PageContainer>
        <div>
          {isPending ? (
            <Spinner animation="border" />
          ) : (
            teacher && (
              <Row>
                <Col xs={3}>
                  <Img
                    src={teacher.photoUrl || ""}
                    placeholder={genericAvatar}
                    alt={`${teacher.firstName} ${teacher.lastName}`}
                    width="100%"
                    loading="lazy"
                    className="img-circle"
                  />
                  <hr />
                  <TeacherSecondaryInfo teacher={teacher} direction="column" />
                  <hr />
                  <TeacherContactInfo teacher={teacher} />
                </Col>
                <Col>
                  <Row>
                    <Col>
                      <h1>{generateFullName(teacher.firstName, teacher.lastName)}</h1>
                      <span>{`Class of ${teacher.gradYear}`}</span>
                    </Col>

                    <Col xs="auto">
                      <Button
                        variant="outline-secondary"
                        onClick={() => setIsShowingEditTeacherModal(true)}
                      >
                        Edit
                      </Button>
                    </Col>
                  </Row>
                  <hr />
                  <Row>
                    <Col xs={8}>
                      <h4>About</h4>
                      <p className="p-breaks">{teacher.bio}</p>
                    </Col>
                    <Col xs={4}>
                      {(teacher.quotes || []).length > 0 && (
                        <>
                          <h4>Quotes</h4>
                          <Card className="quotes">
                            <Card.Body>
                              {teacher.quotes?.map(quote => (
                                <AlumQuote key={quote} quote={quote} />
                              ))}
                            </Card.Body>
                          </Card>
                        </>
                      )}
                    </Col>
                  </Row>
                </Col>
              </Row>
            )
          )}
          <ErrorModal error={error} />
        </div>
      </PageContainer>
      {!!teacher && (
        <AddEditTeacherModal
          show={isShowingEditTeacherModal}
          onCancel={() => setIsShowingEditTeacherModal(false)}
          currentTeacher={teacher}
        />
      )}
    </>
  );
}

interface AlumQuoteProps {
  quote: string;
}

function AlumQuote({ quote }: AlumQuoteProps): JSX.Element {
  return (
    <div className="quote d-flex flex-row">
      <h1>&quot;</h1>
      <span>{quote}&quot;</span>
    </div>
  );
}
