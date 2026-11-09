import * as React from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'TopWebPartWebPartStrings';
import TopWebPart from './components/TopWebPart';
import { ITopWebPartProps } from './components/ITopWebPartProps';

export interface ITopWebPartWebPartProps {
  title: string;
  description: string;
}

export default class TopWebPartWebPart extends BaseClientSideWebPart<ITopWebPartWebPartProps> {

  private _root: Root | undefined;

  public render(): void {
    const element: React.ReactElement<ITopWebPartProps> = React.createElement(
      TopWebPart,
      {
        title: this.properties.title,
        description: this.properties.description
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

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                // Single-line title
                PropertyPaneTextField('title', {
                  label: strings.TitleFieldLabel
                }),
                // Multiline description
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel,
                  multiline: true,
                  rows: 5,
                  resizable: true
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
