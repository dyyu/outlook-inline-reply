import * as React from "react";
import { Stack, Toggle, TooltipHost, Icon, TextField, IStackStyles, CommandBarButton } from "office-ui-fabric-react";
import Header from "./Header";
import Progress from "./Progress";
/* global Button, Header, HeroList, HeroListItem, Progress */

export interface AppProps {
  title: string;
  isOfficeInitialized: boolean;
}

export interface AppState {
  reformatCount: Number;
}

const stackTokens = { childrenGap: 10 };

export interface IButtonExampleProps {
  // These are set based on the toggles shown above the examples (not needed in real code)
  disabled?: boolean;
  checked?: boolean;
}

const stackStyles: Partial<IStackStyles> = { root: { height: 44 } };

export default class App extends React.Component<AppProps, AppState> {
  constructor(props, context) {
    super(props, context);
    this.state = {
      reformatCount: 0
    };
  }

  componentDidMount() {
    this.setState({
      reformatCount: 0
    });
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
        <Header logo="assets/logo-filled.png" title={this.props.title} message="Preferences" />

        <Stack horizontal styles={stackStyles}>
          <CommandBarButton iconProps={{ iconName: "Save" }} text="Save" />
          <CommandBarButton iconProps={{ iconName: "Refresh" }} text="Refresh" />
          <CommandBarButton iconProps={{ iconName: "AppIconDefault" }} text="Load defaults" />
        </Stack>

        {/* Preference items */}
        <main className="ms-welcome__main">
          <Stack tokens={stackTokens}>
            <Toggle
              label={
                <div>
                  Replace quoted email header{" "}
                  <TooltipHost content="Explain Feature">
                    <Icon iconName="Info" aria-label="Info tooltip" />
                  </TooltipHost>
                </div>
              }
              onText="On"
              offText="Off"
            />

            <Toggle
              label={
                <div>
                  Remove warnings about external emails{" "}
                  <TooltipHost content="Explain Feature">
                    <Icon iconName="Info" aria-label="Info tooltip" />
                  </TooltipHost>
                </div>
              }
              onText="On"
              offText="Off"
            />

            <TextField label="Sample of your external email warning:" multiline autoAdjustHeight />
          </Stack>

          {/* Buttons */}
        </main>
      </div>
    );
  }
}
