import { Mappable } from "models";

export interface StudentTeacher extends Mappable {
  type: "student-teacher";
  identifier: string;
  firstName: string;
  lastName: string;
  location: string;
  longitude: number;
  latitude: number;
  photoUrl: string;
  majors: string[];
  cluster: false;
  job_city: string;
  job_name: string;
  school_name: string;
  school_logo_url: string;
  workHistory: WorkHistoryEntry[];
}

interface WorkHistoryEntry {
  role: string;
  companyTitle: string;
}
