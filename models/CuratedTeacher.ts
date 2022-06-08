export interface CuratedTeacher {
  id: string;
  type: string;
  firstName: string;
  lastName: string;
  location: string;
  longitude: number;
  latitude: number;
  majors: string[];
  minors?: string[];
  schoolName: string;
  photoUrl?: string;
  bio: string;
  quotes?: string[];
  gradYear: number;
  email?: string;
  phone?: string;
  display: boolean;
  position?: string;
  focus?: string;
}

export const emptyTeacher: CuratedTeacher = {
  type: "",
  bio: "",
  schoolName: "",
  display: true,
  email: "",
  firstName: "",
  gradYear: 0,
  id: "",
  lastName: "",
  location: "",
  majors: [],
  minors: [],
  phone: "",
  position: "",
  focus: "",
  photoUrl: "",
  quotes: [],
  longitude: 0,
  latitude: 0,
};
