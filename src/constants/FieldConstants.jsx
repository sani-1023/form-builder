import {
  Type,
  Mail,
  Calendar,
  List,
  Clock,
  FilePlus2,
  ListChecks,
  CircleDot,
  SquareCheck,
} from "lucide-react";

export const fieldTypes = [
  { id: 1, type: "text", label: "Text Input", icon: <Type /> },
  { id: 2, type: "email", label: "Email", icon: <Mail /> },
  { id: 3, type: "date", label: "Date", icon: <Calendar /> },
  { id: 4, type: "time", label: "Time", icon: <Clock /> },
  { id: 5, type: "file", label: "File Upload", icon: <FilePlus2 /> },
  { id: 6, type: "select", label: "Select Dropdown", icon: <List /> },
  { id: 7, type: "checkbox", label: "Checkbox", icon: <ListChecks /> },
  { id: 8, type: "radio", label: "Radio Button", icon: <CircleDot /> },
  { id: 9, type: "acceptance", label: "Acceptance", icon: <SquareCheck /> },
];

export const FieldNames = {
  TEXT: "text",
  EMAIL: "email",
  DATE: "date",
  TIME: "time",
  FILE: "file",
  SELECT: "select",
  CHECKBOX: "checkbox",
  RADIO: "radio",
  ACCEPTANCE: "acceptance",
};
