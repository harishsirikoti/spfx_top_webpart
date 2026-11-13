import * as React from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { DisplayMode, Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'MeetTheTeamWebPartStrings';
import MeetTheTeam from './components/MeetTheTeam';
import type { IMeetTheTeamProps } from './components/IMeetTheTeamProps';
import type { IPersonValue, IResponsibility } from './models/IMeetTheTeam';
import { ProfileService } from './services/ProfileService';
import { PeopleSearchService } from './services/PeopleSearchService';
import { validateUrlForPropertyPane } from './utils/urlValidator';
import { createReactField } from './propertyPane/createReactField';
import PeoplePickerField from './propertyPane/PeoplePickerField';
import ResponsibilitiesField from './propertyPane/ResponsibilitiesField';

export interface IMeetTheTeamWebPartProps {
  title: string;
  specialistsTitle: string;
  featuredSectionTitle: string;
  /** Saved as a list with 0 or 1 person, so it works with the same picker as the specialists. */
  featuredEmployee: IPersonValue[];
  teamDlUrl: string;
  description: string;
  responsibilities: IResponsibility[];
  specialists: IPersonValue[];
}

export default class MeetTheTeamWebPart extends BaseClientSideWebPart<IMeetTheTeamWebPartProps> {

  private _root: Root | undefined;
  private _profileService!: ProfileService;
  private _searchService!: PeopleSearchService;

  protected onInit(): Promise<void> {
    const webUrl: string = this.context.pageContext.web.absoluteUrl;
    // One service per web part, so the profile cache is shared by all cards.
    this._profileService = new ProfileService(this.context.spHttpClient, webUrl);
    this._searchService = new PeopleSearchService(this.context.spHttpClient, webUrl);
    return Promise.resolve();
  }

  public render(): void {
    const element: React.ReactElement<IMeetTheTeamProps> = React.createElement(
      MeetTheTeam,
      {
        title: this.properties.title,
        specialistsTitle: this.properties.specialistsTitle,
        featuredSectionTitle: this.properties.featuredSectionTitle,
        featuredEmployee: this.properties.featuredEmployee?.[0],
        teamDlUrl: this.properties.teamDlUrl,
        description: this.properties.description,
        responsibilities: this.properties.responsibilities ?? [],
        specialists: this.properties.specialists ?? [],
        profileService: this._profileService,
        isEditMode: this.displayMode === DisplayMode.Edit
      }
    );

    // Reuse a single React root; property pane edits simply re-render it.
    if (!this._root) {
      this._root = createRoot(this.domElement);
    }
    this._root.render(element);
  }

  protected onDispose(): void {
    this._root?.unmount();
    this._root = undefined;
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  /** Saves a value coming from a custom property pane field and refreshes the web part. */
  private _saveProperty<K extends keyof IMeetTheTeamWebPartProps>(
    name: K,
    value: IMeetTheTeamWebPartProps[K]
  ): void {
    const oldValue: IMeetTheTeamWebPartProps[K] = this.properties[name];
    this.properties[name] = value;
    this.onPropertyPaneFieldChanged(name, oldValue, value);
    this.render();
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: { description: strings.PropertyPaneDescription },
          groups: [
            {
              groupName: strings.GeneralGroupName,
              groupFields: [
                PropertyPaneTextField('title', { label: strings.MainTitleLabel }),
                PropertyPaneTextField('specialistsTitle', { label: strings.SpecialistsTitleLabel })
              ]
            },
            {
              groupName: strings.FeaturedGroupName,
              groupFields: [
                PropertyPaneTextField('featuredSectionTitle', { label: strings.FeaturedSectionTitleLabel }),
                createReactField<IPersonValue[]>(
                  'featuredEmployee',
                  onChange => React.createElement(PeoplePickerField, {
                    label: strings.FeaturedEmployeeLabel,
                    itemLimit: 1, // only one featured employee
                    initialValue: this.properties.featuredEmployee ?? [],
                    searchService: this._searchService,
                    onChange
                  }),
                  value => this._saveProperty('featuredEmployee', value)
                ),
                PropertyPaneTextField('teamDlUrl', {
                  label: strings.TeamDlUrlLabel,
                  description: strings.TeamDlUrlDescription,
                  // Bad links are blocked here, and checked again when the buttons are drawn.
                  onGetErrorMessage: (value: string) => validateUrlForPropertyPane(value, strings.TeamDlUrlError)
                })
              ]
            },
            {
              groupName: strings.ResponsibilitiesGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionLabel,
                  multiline: true,
                  rows: 4,
                  resizable: true
                }),
                createReactField<IResponsibility[]>(
                  'responsibilities',
                  onChange => React.createElement(ResponsibilitiesField, {
                    label: strings.ResponsibilitiesLabel,
                    addLabel: strings.AddResponsibility,
                    initialValue: this.properties.responsibilities ?? [],
                    onChange
                  }),
                  value => this._saveProperty('responsibilities', value)
                )
              ]
            },
            {
              groupName: strings.SpecialistsGroupName,
              groupFields: [
                createReactField<IPersonValue[]>(
                  'specialists',
                  onChange => React.createElement(PeoplePickerField, {
                    label: strings.SpecialistsLabel,
                    initialValue: this.properties.specialists ?? [],
                    searchService: this._searchService,
                    onChange
                  }),
                  value => this._saveProperty('specialists', value)
                )
              ]
            }
          ]
        }
      ]
    };
  }
}
