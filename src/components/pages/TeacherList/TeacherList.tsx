import genericAvatar from "assets/images/generic_avatar.jpg";
import {
  TeacherSecondaryInfo,
  ConfirmationModal,
  ErrorModal,
  PageContainer,
  LoginModal,
} from "components";
import { AddEditTeacherModal } from "components/reusables/AddEditTeacherModal";
import { UserContext } from "contexts";
import { CuratedTeacher } from "models";
import React, { useContext, useState, useEffect } from "react";
import { useAsync } from "react-async";
import { Button, Card, Spinner } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import { setTimeout } from "timers";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Img from "react-cool-img";
import {
  deleteAlumStory,
  getMemberInfo,
  updateTeacherStory,
  loginAsAdmin,
  logout,
  sendPasswordResetEmail,
} from "services";
import { URLPaths } from "utilities";
import "./TeacherList.scss";



export function TeacherList(): JSX.Element {
  const { data, error, isPending } = useAsync({ promiseFn: getMemberInfo });
  const user = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const [isShowingNewTeacherModal, setIsShowingNewTeacherModal] = useState(false);
  const history = useHistory();

  useEffect(() => {
    setIsLoading(true);
    /* Adds a little bit of buffer time to check if user exists, so that if the
     * user IS logged in, they don't see the login modal briefly when opening the
     * admin page. */
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  return isLoading ? (
    <div id="loader">
      <PageContainer>
        <Spinner animation="border" />
      </PageContainer>
    </div>
  ) : (
    <>
    <LoginModal
    isLoggedIn={!!user}
    loginFn={loginAsAdmin}
    title="Admin Login"
    description="Please login using your admin credentials to view this content."
    passwordResetFn={sendPasswordResetEmail}
  />
    <PageContainer >
      
      <div className="logout">
       
      <Button
        variant="outline-secondary"
        border-right="right"
        onClick={() => logout().then(() => history.push("/"))}
      >
        Log Out
      </Button>
      </div>
      <div className="teacher-list" >
        <div className="d-flex justify-content-between">
          <div>
            <h1>Education Department Members</h1>
            <p>Student-Teachers, Recent Graduates, and Alumni from the Hope College Education Department</p>
          </div>
          <div>
            <Button
              variant="outline-primary"
              onClick={() => setIsShowingNewTeacherModal(true)}
              size="lg"
            >
              <i className="fas fa-plus mr-2" />
              New Teacher
            </Button>
          </div>
        </div>
        {isPending ? (
          <Spinner animation="border" />
        ) : (
          data &&
          data
            .filter(teacher => teacher.display === true)
            .map(teacher => <TeacherCard key={teacher.id} teacher={teacher} />)
        )}
      </div>
      <ErrorModal error={error} />
      <AddEditTeacherModal
        show={isShowingNewTeacherModal}
        onCancel={() => setIsShowingNewTeacherModal(false)}
        currentTeacher={undefined}
      />
    </PageContainer >
    </>
  );
}

interface TeacherCardProps {
  teacher: CuratedTeacher;
}

function TeacherCard({ teacher }: TeacherCardProps): JSX.Element {
  const [isShowingConfirmDelete, setIsShowingConfirmDelete] = useState(false);
  const user = useContext(UserContext);
  const [isShowingEditTeacherModal, setIsShowingEditTeacherModal] = useState(false);
  const [isDisplaying, setIsDisplaying] = useState(teacher.display);
  const [error, setError] = useState<Error | undefined>(undefined);

  return (
    <>
      <Row>
        <Col xs="auto" className="d-flex align-items-center p-0">
          
        </Col>

        <Col>
          <Card style={{ opacity: isDisplaying ? 1 : 0.5 }}>
            <Card.Body>
              <Row>
                <Col xs={3} md={2} className="d-flex align-items-center">
                  <div className="img-square-container">
                    <Img
                      src={teacher.photoUrl || ""}
                      placeholder={genericAvatar}
                      alt={`${teacher.firstName} ${teacher.lastName}`}
                      width="100%"
                      loading="lazy"
                    />
                  </div>
                </Col>
                <Col className="d-flex align-items-center">
                  <div>
                    <h2>
                      {`${teacher.firstName} ${teacher.lastName}`}{" "}
                      <span className="light">
                        &apos;{(teacher.gradYear % 100).toString().padStart(2, "0")}
                      </span>
                    </h2>
                    <TeacherSecondaryInfo teacher={teacher} />
                  </div>
                </Col>
                <Col xs="auto" className="d-flex align-items-center">
                  <div className="d-flex flex-column justify-content-center">
                    <a href={`${URLPaths.teacherStories}/${teacher.id}`} className="p-3">
                      Learn More
                      <i className="ml-2 fas fa-arrow-right" />
                    </a>

                    <div className="buttons spaced-children">
                      <div className="buttons spaced-children">
                        <Button
                          variant="outline-success"
                          size="lg"
                          onClick={() => setIsShowingEditTeacherModal(true)}
                        >
                          Edit
                        </Button>
                      </div>
                      <Button
                        variant="outline-danger"
                        size="lg"
                        onClick={() => setIsShowingConfirmDelete(true)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <ConfirmationModal
        title="Delete Member Profile?"
        message="Are you sure you want to delete this department member profile? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
        show={isShowingConfirmDelete}
        onConfirm={() => {
          return deleteAlumStory(teacher.id).finally(() => {
            window.location.reload();
          });
        }}
        onHide={() => setIsShowingConfirmDelete(false)}
      />
      <AddEditTeacherModal
        show={isShowingEditTeacherModal}
        onCancel={() => {
          window.location.reload();
          setIsShowingEditTeacherModal(false);
        }}
        currentTeacher={teacher}
      />
      <ErrorModal error={error} />
    </>
  );
}
