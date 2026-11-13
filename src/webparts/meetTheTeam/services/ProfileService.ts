import { SPHttpClient, type SPHttpClientResponse } from '@microsoft/sp-http';
import type { IEmployeeProfile, IPersonValue } from '../models/IMeetTheTeam';

/** Shape of the fields we read from SharePoint's PeopleManager response. */
interface IPeopleManagerResult {
  DisplayName?: string;
  Title?: string;
  Email?: string;
  PictureUrl?: string;
  /** All profile properties as key/value pairs, for example { Key: 'SPS-JobTitle', Value: 'Manager' }. */
  UserProfileProperties?: { Key: string; Value: string }[];
}

/**
 * Loads profile data (name, job title, photo) with the SharePoint PeopleManager API.
 * This API works with the signed-in user's rights, so no Microsoft Graph permission is needed.
 */
export class ProfileService {
  // Cache by login name: the same person is never requested twice while the page is open.
  // We cache the promise, so two parallel requests for one person share one network call.
  private readonly _cache: Map<string, Promise<IEmployeeProfile>> = new Map();

  public constructor(
    private readonly _spHttpClient: SPHttpClient,
    private readonly _webUrl: string
  ) {}

  /** Loads many profiles at once. The result keeps the same order as the input. */
  public getProfiles(people: IPersonValue[]): Promise<IEmployeeProfile[]> {
    return Promise.all(people.map(person => this.getProfile(person)));
  }

  public getProfile(person: IPersonValue): Promise<IEmployeeProfile> {
    const cached: Promise<IEmployeeProfile> | undefined = this._cache.get(person.loginName);
    if (cached) {
      return cached;
    }

    const request: Promise<IEmployeeProfile> = this._fetchProfile(person).catch(() => {
      // Do not keep failures in the cache, so a later call can try again.
      this._cache.delete(person.loginName);
      // Show what the picker saved instead of an empty card. No error details are logged.
      return this._toProfile(person, undefined);
    });
    this._cache.set(person.loginName, request);
    return request;
  }

  private async _fetchProfile(person: IPersonValue): Promise<IEmployeeProfile> {
    // The login name is quoted and encoded, so it cannot change the URL structure.
    const escapedLogin: string = person.loginName.replace(/'/g, "''");
    const url: string =
      `${this._webUrl}/_api/SP.UserProfiles.PeopleManager/GetPropertiesFor(accountName=@v)` +
      `?@v='${encodeURIComponent(escapedLogin)}'&$select=DisplayName,Title,Email,PictureUrl,UserProfileProperties`;

    const response: SPHttpClientResponse = await this._spHttpClient.get(url, SPHttpClient.configurations.v1);
    if (!response.ok) {
      throw new Error(`Profile request failed with status ${response.status}`);
    }
    const result: IPeopleManagerResult = await response.json();
    return this._toProfile(person, result);
  }

  /** Merges API data with the saved picker data. API values win when they exist. */
  private _toProfile(person: IPersonValue, result: IPeopleManagerResult | undefined): IEmployeeProfile {
    return {
      loginName: person.loginName,
      displayName: result?.DisplayName || person.displayName,
      email: result?.Email || person.email,
      jobTitle: this._pickJobTitle(person, result),
      photoUrl: result?.PictureUrl || undefined
    };
  }

  /**
   * Finds the job title. Field mapping, in order:
   * 1. "SPS-JobTitle" in UserProfileProperties: the real "Job title" field of the profile.
   * 2. "Title" on the PeopleManager result: SharePoint fills it from the same job title, but it can be empty.
   * 3. The title the People Picker saved earlier (also a job title, not the display name).
   * If all are empty we return undefined. The UI shows a neutral fallback; nothing is invented.
   */
  private _pickJobTitle(person: IPersonValue, result: IPeopleManagerResult | undefined): string | undefined {
    const fromProperties: string | undefined = result?.UserProfileProperties?.find(
      property => property.Key === 'SPS-JobTitle'
    )?.Value;
    const title: string = (fromProperties || result?.Title || person.jobTitle || '').trim();
    return title || undefined;
  }
}
