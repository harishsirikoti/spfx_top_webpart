import type { IPersonValue, IResponsibility } from '../models/IMeetTheTeam';
import type { ProfileService } from '../services/ProfileService';

export interface IMeetTheTeamProps {
  title: string;
  specialistsTitle: string;
  featuredSectionTitle: string;
  featuredEmployee?: IPersonValue;
  teamDlUrl: string;
  description: string;
  responsibilities: IResponsibility[];
  specialists: IPersonValue[];
  profileService: ProfileService;
  /** True while the page is being edited. Used to show helpful hints for empty sections. */
  isEditMode: boolean;
}
