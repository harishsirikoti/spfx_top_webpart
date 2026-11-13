/**
 * A person chosen in the property pane People Picker.
 * Only small, non-sensitive values are saved in the web part properties.
 */
export interface IPersonValue {
  /** Claims login name, for example "i:0#.f|membership|user@contoso.com". */
  loginName: string;
  displayName: string;
  email?: string;
  jobTitle?: string;
}

/** One line in the responsibilities list. The id keeps React rows stable while editors reorder. */
export interface IResponsibility {
  id: string;
  text: string;
}

/** Profile data shown on the page, after it was loaded from SharePoint. */
export interface IEmployeeProfile {
  loginName: string;
  displayName: string;
  email?: string;
  jobTitle?: string;
  /** Can be undefined when the user has no photo. The UI then shows initials. */
  photoUrl?: string;
}
