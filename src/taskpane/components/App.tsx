import * as React from "react";
import { Stack, CommandBarButton } from "office-ui-fabric-react";
import Header from "./Header";
import Progress from "./Progress";
import ToggleList, { ToggleListItem } from "./ToggleList";
import TextFieldWithButtons from "./TextFieldWithButtons";
/* global Button, Header, HeroList, HeroListItem, Progress */

export interface AppProps {
  title: string;
  isOfficeInitialized: boolean;
}

export interface AppState {
  preferences: object;
  statistics: object;
}

// Default values for the preferences
var defaultPreferences = {
  polishPlainText: false,
  replaceHeader: true,
  removeExternalWarning: true,
  externalWarningHtml: ""
};

// Default values for usage statistics
var defaultStatistics = {
  reformatCount: 0
};

// UI content for the preference toggles
var toggleListItems: ToggleListItem[] = [
  {
    name: "polishPlainText",
    label: "Remove extra new lines in plain text",
    tooltip: "This removes the redundant new lines when Outlook converts HTML text to plain text."
  },
  {
    name: "replaceHeader",
    label: "Replace quoted email header",
    tooltip: "Use a shortened format (On DATE at TIME, NAME <EMAIL> wrote:) instead of Outlook's full header."
  },
  {
    name: "removeExternalWarning",
    label: "Remove external sender warning",
    tooltip: "Remove the external sender warning (often in corporate environments) in the first quoted message."
  }
];

export default class App extends React.Component<AppProps, AppState> {
  constructor(props, context) {
    super(props, context);
    this.state = {
      preferences: defaultPreferences,
      statistics: defaultStatistics
    };
  }

  componentDidMount() {
    // Load the roaming settings for the preferences and statistics
    this.refreshRoamingSettings();
  }

  componentDidUpdate(_prevProps, prevState, _snapshot) {
    // Update the roaming settings if the state has changed
    if (JSON.stringify(prevState) != JSON.stringify(this.state)) {
      console.log("Updating roaming settings with new state");
      this.writeRoamingSettings("preferences", this.state.preferences);
      this.writeRoamingSettings("statistics", this.state.statistics);
    }
  }

  updatePreference = (name: string, value) => {
    this.setState(prevState => ({
      preferences: { ...prevState.preferences, [name]: value }
    }));
  };

  refreshRoamingSettings = () => {
    // Set the state from the roaming settings
    this.setState(_prevState => ({
      preferences: this.readRoamingSettings("preferences", defaultPreferences),
      statistics: this.readRoamingSettings("statistics", defaultStatistics)
    }));
  };

  loadDefaultPreferences = () => {
    this.setState(_prevState => ({
      preferences: defaultPreferences
    }));
  };

  readRoamingSettings(stateName, defaultSetting) {
    var roamingSettings = Office.context.roamingSettings;
    var setting = roamingSettings.get(stateName);
    self.console.log("Read", stateName, setting);

    if (setting == undefined) {
      // Create default preferences
      setting = defaultSetting;

      self.console.log("Initiating state for %s to %s", stateName, setting);

      roamingSettings.set(stateName, setting);
      roamingSettings.saveAsync();
    }

    return setting;
  }

  writeRoamingSettings(stateName, newSetting) {
    var roamingSettings = Office.context.roamingSettings;
    roamingSettings.set(stateName, newSetting);
    roamingSettings.saveAsync();
  }

  render() {
    const { title, isOfficeInitialized } = this.props;

    if (!isOfficeInitialized) {
      return (
        <Progress title={title} logo="assets/logo-filled.png" message="Please sideload your addin to see app body." />
      );
    }

    return (
      <div>
        {/* Page header */}
        <Header logo="assets/logo-filled.png" title={this.props.title} message="Preferences" />

        {/* Command bar icons */}
        <Stack horizontal styles={{ root: { height: 44 } }}>
          <CommandBarButton iconProps={{ iconName: "Refresh" }} text="Refresh" onClick={this.refreshRoamingSettings} />
          <CommandBarButton
            iconProps={{ iconName: "AppIconDefault" }}
            text="Reset to default"
            onClick={this.loadDefaultPreferences}
          />
        </Stack>

        {/* Preference items */}
        <main className="ms-welcome__main">
          <Stack tokens={{ childrenGap: 10 }}>
            {/* Toggle controls */}
            <ToggleList items={toggleListItems} checked={this.state.preferences} handler={this.updatePreference} />

            {/* Text box for external email warning */}
            <TextFieldWithButtons
              name="externalWarningHtml"
              textLabel="External sender warning sample"
              textValue={this.state.preferences["externalWarningHtml"]}
              textPlaceholder="Copy the HTML content of your warning message here."
              buttonText="Save"
              handler={this.updatePreference}
            />
          </Stack>
        </main>
      </div>
    );
  }
}
