declare interface IMeetTheTeamWebPartStrings {
  PropertyPaneDescription: string;
  GeneralGroupName: string;
  FeaturedGroupName: string;
  ResponsibilitiesGroupName: string;
  SpecialistsGroupName: string;
  MainTitleLabel: string;
  SpecialistsTitleLabel: string;
  FeaturedSectionTitleLabel: string;
  FeaturedEmployeeLabel: string;
  TeamDlUrlLabel: string;
  TeamDlUrlDescription: string;
  TeamDlUrlError: string;
  DescriptionLabel: string;
  ResponsibilitiesLabel: string;
  AddResponsibility: string;
  SpecialistsLabel: string;
  EmailButtonText: string;
  TeamDlButtonText: string;
  Loading: string;
  RoleNotAvailable: string;
  FeaturedEmptyHint: string;
  SpecialistsEmptyHint: string;
}

declare module 'MeetTheTeamWebPartStrings' {
  const strings: IMeetTheTeamWebPartStrings;
  export = strings;
}
