import genericAvatar from "assets/images/generic_avatar.jpg";
import { ErrorModal, PhotoUploader } from "components";
import { CuratedTeacher, emptyTeacher } from "models";
import React, { FormEvent, useState } from "react";
import { Button, Col, Form, Modal } from "react-bootstrap";
import Img from "react-cool-img";
import { addTeacherStory, updateTeacherStory, uploadProfilePhoto } from "services";
import { generateFullName } from "utilities";
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from "react-places-autocomplete";

interface AddEditTeacherModalProps {
  /** Whether the modal should be shown. */
  show: boolean;
  /** Function to be called when canceling or closing the modal. */
  onCancel: () => void;
  /** The alum to edit, or undefined if creating a new alum. */
  currentTeacher: CuratedTeacher | undefined;
}

/** Modal for adding/editing curated alumni. */
export function AddEditTeacherModal({
  show,
  onCancel,
  currentTeacher,
}: AddEditTeacherModalProps): JSX.Element {
  const [editedTeacher, setEditedTeacher] = useState<CuratedTeacher>(
    currentTeacher ? { ...currentTeacher } : { ...emptyTeacher },
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedPhoto, setUploadedPhoto] = useState<File | undefined>(undefined);
  const [isReplacingPhoto, setIsReplacingPhoto] = useState(false);
  const isNew = currentTeacher === undefined;
  const [error, setError] = useState<Error | undefined>(undefined);

  const [address, setAddress] = useState("");
  editedTeacher.location = address;
  const [coordinates, setCoordinates] = React.useState({
    lat: 32.779167,
    lng: -96.808891,
  });
  editedTeacher.longitude = coordinates.lng;
  editedTeacher.latitude = coordinates.lat;

  const handleSelect = async (mapvalue: string) => {
    const results = await geocodeByAddress(mapvalue);
    const latLng = await getLatLng(results[0]);
    setAddress(mapvalue);
    setCoordinates(latLng);
  };

  async function submitTeacher(event: FormEvent) {
    event.preventDefault(); // prevents the page from reloading immediately on submit
    setIsSubmitting(true);

    if (uploadedPhoto !== undefined) {
      const snapshot = await uploadProfilePhoto(uploadedPhoto, editedTeacher);
      const url = await snapshot.ref.getDownloadURL();
      editedTeacher.photoUrl = url;
    }

    const submitFn: () => Promise<unknown> = isNew
      ? () => addTeacherStory(editedTeacher)
      : () => updateTeacherStory(editedTeacher.id, editedTeacher);

    submitFn()
      .catch(err => setError(err))
      .finally(() => {
        setIsSubmitting(false);
        window.location.reload();
      });
  }

  return (
    <>
      <Modal show={show} size="lg" className="add-edit-alumni-modal">
        <Form onSubmit={submitTeacher}>
          <Modal.Header>
            <Modal.Title>
              {isNew
                ? "Add New Teacher"
                : `Edit ${generateFullName(editedTeacher.firstName, editedTeacher.lastName)}`}
            </Modal.Title>
          </Modal.Header>
          {/* <PlacesAutocomplete value={address} onChange={setAddress} onSelect={handleSelect}> */}

          <Modal.Body>
            <Form.Group>
              <strong>Basic Info</strong>
            </Form.Group>
            <Form.Row>
              <Col>
                <TeacherFormGroup
                  attribute="firstName"
                  label="First Name"
                  placeholder="e.g. Jane"
                  onChange={e =>
                    setEditedTeacher({ ...editedTeacher, firstName: e.target.value.trim() })
                  }
                  defaultValue={editedTeacher.firstName}
                  required
                />
              </Col>
              <Col>
                <TeacherFormGroup
                  attribute="lastName"
                  label="Last Name"
                  placeholder="e.g. Doe"
                  onChange={e =>
                    setEditedTeacher({ ...editedTeacher, lastName: e.target.value.trim() })
                  }
                  defaultValue={editedTeacher.lastName}
                  required
                />
              </Col>
              <Col>
                <TeacherFormGroup
                  type="number"
                  attribute="gradYear"
                  label="Graduation Year"
                  placeholder={`e.g. ${new Date().getFullYear()}`}
                  onChange={e =>
                    setEditedTeacher({ ...editedTeacher, gradYear: parseInt(e.target.value, 10) })
                  }
                  defaultValue={editedTeacher.gradYear ? editedTeacher.gradYear.toString() : ""}
                  required
                />
              </Col>
            </Form.Row>
            <Form.Group>
              <Form.Label>Profile Photo</Form.Label>
              {!!editedTeacher.photoUrl && !isReplacingPhoto ? (
                <Form.Row>
                  <Col xs={2}>
                    <Img
                      src={editedTeacher.photoUrl || ""}
                      placeholder={genericAvatar}
                      alt={`${editedTeacher.firstName} ${editedTeacher.lastName}`}
                      width="100%"
                      loading="lazy"
                      className="img-circle"
                    />
                  </Col>
                  <Col className="d-flex align-items-center">
                    <Button variant="outline-secondary" onClick={() => setIsReplacingPhoto(true)}>
                      Replace
                    </Button>
                  </Col>
                </Form.Row>
              ) : (
                <PhotoUploader onDrop={(photos: File[]) => setUploadedPhoto(photos[0])} />
              )}
            </Form.Group>

            <Form.Row>
              <Col>
                <Form.Label>
                  School Address/Location
                  <span className="text-danger"> *</span>
                </Form.Label>

                <PlacesAutocomplete value={address} onChange={setAddress} onSelect={handleSelect}>
                  {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                    <div>
                      <Form.Control {...getInputProps({ placeholder: "Type address" })} />
                      <div>
                        {loading ? <div>...loading</div> : null}

                        {suggestions.map(suggestion => {
                          const style = {
                            backgroundColor: suggestion.active ? "#41b6e6" : "#fff",
                          };

                          return (
                            <div {...getSuggestionItemProps(suggestion, { style })}>
                              {suggestion.description}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </PlacesAutocomplete>
              </Col>
              <TeacherFormGroup
                attribute="focus"
                label="Major Focus"
                placeholder="e.g. Secondary Education"
                onChange={e => setEditedTeacher({ ...editedTeacher, focus: e.target.value.trim() })}
                defaultValue={editedTeacher.focus || ""}
              />
              <Col>
                <TeacherFormGroup
                  attribute="position"
                  label="Position"
                  placeholder="e.g. Special Education Teacher"
                  onChange={e =>
                    setEditedTeacher({ ...editedTeacher, position: e.target.value.trim() })
                  }
                  defaultValue={editedTeacher.position || ""}
                />
              </Col>
            </Form.Row>
            <TeacherFormGroup
              as="textarea"
              rows={6}
              attribute="bio"
              label="Bio"
              placeholder="Enter some interesting information about this alum"
              onChange={e => setEditedTeacher({ ...editedTeacher, bio: e.target.value.trim() })}
              defaultValue={editedTeacher.bio}
              required
            />
            <Form.Row>
              <Col>
                <Form.Group controlId="formBasicSelect">
                  <Form.Label>
                    {" "}
                    Department Member Type
                    <span className="text-danger"> *</span>
                  </Form.Label>
                  <Form.Control
                    as="select"
                    value={editedTeacher.type}
                    onChange={e => {
                      setEditedTeacher({ ...editedTeacher, type: e.target.value });
                    }}
                    required
                  >
                    <option value=""> Select Option</option>
                    <option value="student-teacher"> Student Teacher</option>
                    <option value="hired">Hired Placement</option>
                  </Form.Control>
                </Form.Group>
              </Col>

              <Col>
                <TeacherFormGroup
                  attribute="email"
                  label="Email"
                  placeholder="e.g. example@example.com"
                  onChange={e =>
                    setEditedTeacher({ ...editedTeacher, email: e.target.value.trim() })
                  }
                  defaultValue={editedTeacher.email || ""}
                />
              </Col>
              <Col>
                <TeacherFormGroup
                  attribute="phone"
                  label="Phone"
                  placeholder="e.g. 555-555-5555"
                  onChange={e =>
                    setEditedTeacher({ ...editedTeacher, phone: e.target.value.trim() })
                  }
                  defaultValue={editedTeacher.phone || ""}
                />
              </Col>
            </Form.Row>
            <Form.Group>
              <strong>Other Info</strong>
            </Form.Group>
            <TeacherFormGroup
              as="textarea"
              rows={3}
              attribute="quotes"
              label="Quotes"
              placeholder="Enter any quotes separated by pipes (quote1 | quote2 | ...)"
              onChange={e =>
                setEditedTeacher({
                  ...editedTeacher,
                  quotes:
                    e.target.value === ""
                      ? []
                      : e.target.value.split("|").map(quote => quote.trim()),
                })
              }
              defaultValue={editedTeacher.quotes?.join(" | ") || ""}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-secondary" onClick={onCancel} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button variant="outline-primary" type="submit" disabled={isSubmitting}>
              Submit
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
      <ErrorModal error={error} />
    </>
  );
}

interface TeacherFormGroupProps {
  attribute: keyof CuratedTeacher;
  type?: "text" | "number";
  as?: "textarea";
  label: string;
  placeholder: string;
  onChange: React.ChangeEventHandler<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>;
  defaultValue: string;
  required?: boolean;
  rows?: number;
}

function TeacherFormGroup({
  attribute,
  label,
  placeholder,
  onChange,
  defaultValue,
  type,
  as,
  required,
  rows,
}: TeacherFormGroupProps) {
  return (
    <Form.Group controlId={attribute}>
      <Form.Label>
        {label}
        {required && <span className="text-danger"> *</span>}
      </Form.Label>
      <Form.Control
        placeholder={placeholder}
        onChange={onChange}
        type={type || "text"}
        defaultValue={defaultValue}
        as={as}
        required={required}
        rows={rows}
      />
    </Form.Group>
  );
}
