import "firebase/storage";
import { StudentTeacher } from "models";
import { db } from "services";
import { dbCollections } from "utilities";


/**
 * Retrieves a list of all alumni from PeopleGrove, using the map view type.
 * @returns A Promise containing the list of all PeopleGrove alumni.
 */
export async function getAllStudentTeachers(): Promise<StudentTeacher[]> {
  const snipshot = await db.collection(dbCollections.memberInfo).where("type", "==", "student-teacher").get();
  return snipshot.docs.map(doc => {
    return { ...doc.data(), id: doc.id } as StudentTeacher;
  });
}

/**
 * Retrieves more detailed data for one specific student-teacher on PeopleGrove.
 * @param username The username of a specific PeopleGrove student-teacher.
 * @returns A more detailed blob of data for a specific student-teacher on PeopleGrove.
 */
export async function getStudentTeacher(id: string): Promise<StudentTeacher | undefined> {
  const snapshot = await db.doc(`${dbCollections.memberInfo}/${id}`).get();
  return snapshot.data() ? ({ ...snapshot.data(), id: snapshot.id } as StudentTeacher) : undefined;
}
