import firebase from "firebase";
import { CuratedTeacher } from "models";
import { storageRef } from "services";

/**
 * Uploads a profile photo for an alum.
 * @param file The file to be uploaded.
 * @param alum The alum to which the profile photo is assigned.
 * @returns An UploadTask that allows you to monitor and manage the upload.
 */
export function uploadProfilePhoto(file: File, alum: CuratedTeacher): firebase.storage.UploadTask {
  return storageRef
    .child("profilePhotos")
    .child(alum.id || file.name)
    .put(file);
}
