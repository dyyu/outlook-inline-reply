import * as React from "react";
import { Toggle } from "office-ui-fabric-react/lib/Toggle";
import { TooltipHost } from "office-ui-fabric-react/lib/Tooltip";
import { Icon } from "office-ui-fabric-react/lib/Icon";

export interface ToggleListItem {
  name: string;
  label: string;
  tooltip: string;
}

export interface ToggleListProps {
  items: ToggleListItem[];
  checked: {};
  handler: any;
}

export default class ToggleList extends React.Component<ToggleListProps> {
  render() {
    const { items, checked, handler } = this.props;

    const listItems = items.map((item, index) => (
      <Toggle
        key={index}
        label={
          <div>
            {item.label}{" "}
            <TooltipHost content={item.tooltip}>
              <Icon iconName="Info" aria-label="Info tooltip" />
            </TooltipHost>
          </div>
        }
        onText="On"
        offText="Off"
        checked={checked[item.name]}
        onChange={() => handler(item.name, !checked[item.name])}
      />
    ));
    return <ul className="ms-List ms-welcome__features ms-u-slideUpIn10">{listItems}</ul>;
  }
}
