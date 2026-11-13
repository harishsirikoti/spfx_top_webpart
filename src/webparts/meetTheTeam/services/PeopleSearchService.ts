import { SPHttpClient, type ISPHttpClientOptions, type SPHttpClientResponse } from '@microsoft/sp-http';
import type { IPersonValue } from '../models/IMeetTheTeam';

interface IPickerEntity {
  Key: string;
  DisplayText: string;
  EntityType?: string;
  EntityData?: { Email?: string; Title?: string };
}

/** Searches users for the property pane People Picker using SharePoint's own picker endpoint. */
export class PeopleSearchService {
  public constructor(
    private readonly _spHttpClient: SPHttpClient,
    private readonly _webUrl: string
  ) {}

  public async searchUsers(query: string, maxResults: number = 10): Promise<IPersonValue[]> {
    const text: string = query.trim();
    if (!text) {
      return [];
    }

    const options: ISPHttpClientOptions = {
      body: JSON.stringify({
        queryParams: {
          QueryString: text,
          MaximumEntitySuggestions: maxResults,
          AllowEmailAddresses: false,
          AllowOnlyEmailAddresses: false,
          PrincipalType: 1, // 1 = users only
          PrincipalSource: 15, // user info list + profile service + directory
          SharePointGroupID: 0
        }
      })
    };

    const response: SPHttpClientResponse = await this._spHttpClient.post(
      `${this._webUrl}/_api/SP.UI.ApplicationPages.ClientPeoplePickerWebServiceInterface.clientPeoplePickerSearchUser`,
      SPHttpClient.configurations.v1,
      options
    );
    if (!response.ok) {
      return [];
    }

    // SharePoint returns the entity list as a JSON string inside the JSON response.
    const json: { value?: string } = await response.json();
    const entities: IPickerEntity[] = json.value ? JSON.parse(json.value) : [];

    return entities
      .filter(entity => entity.Key && (!entity.EntityType || entity.EntityType === 'User'))
      .map(entity => ({
        loginName: entity.Key,
        displayName: entity.DisplayText,
        email: entity.EntityData?.Email || undefined,
        jobTitle: entity.EntityData?.Title || undefined
      }));
  }
}
