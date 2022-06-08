import "firebase/storage";
import { HiredTeacherPlacements } from "models";
import { db } from "services";
import { dbCollections } from "utilities";

/**
 * Retrieves a list of all alumni from PeopleGrove, using the map view type.
 * @returns A Promise containing the list of all PeopleGrove alumni.
 */
export async function getAllHiredPlacements(): Promise<HiredTeacherPlacements[]> {
  const snipshot = await db.collection(dbCollections.memberInfo).where("type", "==", "hired").get();
  return snipshot.docs.map(doc => {
    return { ...doc.data(), id: doc.id } as HiredTeacherPlacements;
  });
}

/**
 * Retrieves more detailed data for one specific student-teacher on PeopleGrove.
 * @param username The username of a specific PeopleGrove student-teacher.
 * @returns A more detailed blob of data for a specific student-teacher on PeopleGrove.
 */
export async function getHiredPlacement(id: string): Promise<HiredTeacherPlacements | undefined> {
  const snapshot = await db.doc(`${dbCollections.memberInfo}/${id}`).get();
  return snapshot.data() ? ({ ...snapshot.data(), id: snapshot.id } as HiredTeacherPlacements) : undefined;
}
