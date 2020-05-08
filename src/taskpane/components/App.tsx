import * as React from "react";
import { Stack, TextField, IStackStyles, CommandBarButton } from "office-ui-fabric-react";
import Header from "./Header";
import Progress from "./Progress";
import ToggleList, { ToggleListItem } from "./ToggleList";
/* global Button, Header, HeroList, HeroListItem, Progress */

export interface AppProps {
  title: string;
  isOfficeInitialized: boolean;
}

export interface AppState {
  preferences: object;
  statistics: object;
}

var defaultPreferences = {
  polishPlainText: false,
  replaceHeader: true,
  removeExternalWarning: true
};

var defaultStatistics = {
  reformatCount: 0
};

const stackTokens = { childrenGap: 10 };

const stackStyles: Partial<IStackStyles> = { root: { height: 44 } };

var toggleListItems: ToggleListItem[] = [
  {
    name: "polishPlainText",
    label: "Remove extra new lines in plain text",
    tooltip: "Tooltip explanation"
  },
  {
    name: "replaceHeader",
    label: "Replace quoted email header",
    tooltip: "Tooltip explanation"
  },
  {
    name: "removeExternalWarning",
    label: "Remove warnings about external emails",
    tooltip: "Tooltip explanation"
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
    this.refreshRoamingSettings();
  }

  componentDidUpdate(_prevProps, prevState, _snapshot) {
    console.log("Previous state:", prevState);
    console.log("Current state:", this.state);

    console.log("Writing update to roaming settings");
    writeRoamingSettings("preferences", this.state.preferences);
    writeRoamingSettings("statistics", this.state.statistics);
  }

  updatePreference = (name: string, checked: boolean) => {
    this.setState(prevState => ({
      preferences: { ...prevState.preferences, [name]: !checked }
    }));
  };

  refreshRoamingSettings = () => {
    // Read the preferences
    var preferences = readRoamingSettings("preferences", defaultPreferences);
    var statistics = readRoamingSettings("statistics", defaultStatistics);

    // Set state
    this.setState(_prevState => ({
      preferences: preferences,
      statistics: statistics
    }));

    console.log("State:", this.state);
  };

  loadDefaultPreferences = () => {
    this.setState(_prevState => ({
      preferences: defaultPreferences
    }));
  };

  render() {
    const { title, isOfficeInitialized } = this.props;

    if (!isOfficeInitialized) {
      return (
        <Progress title={title} logo="assets/logo-filled.png" message="Please sideload your addin to see app body." />
      );
    }

    return (
      <div>
        <Header logo="assets/logo-filled.png" title={this.props.title} message="Preferences" />

        <Stack horizontal styles={stackStyles}>
          {/* <CommandBarButton iconProps={{ iconName: "Save" }} text="Save" /> */}
          <CommandBarButton iconProps={{ iconName: "Refresh" }} text="Refresh" onClick={this.refreshRoamingSettings} />
          <CommandBarButton
            iconProps={{ iconName: "AppIconDefault" }}
            text="Apply defaults"
            onClick={this.loadDefaultPreferences}
          />
        </Stack>

        {/* Preference items */}
        <main className="ms-welcome__main">
          <Stack tokens={stackTokens}>
            {/* {listItems} */}
            <ToggleList items={toggleListItems} checked={this.state.preferences} onChange={this.updatePreference} />

            <TextField label="Sample of your external email warning:" multiline autoAdjustHeight />
          </Stack>

          {/* Buttons */}
        </main>
      </div>
    );
  }
}

function readRoamingSettings(stateName, defaultSetting) {
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

function writeRoamingSettings(stateName, newSetting) {
  var roamingSettings = Office.context.roamingSettings;
  roamingSettings.set(stateName, newSetting);
  roamingSettings.saveAsync();
}
