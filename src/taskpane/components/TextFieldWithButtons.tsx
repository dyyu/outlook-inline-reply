import * as React from "react";
import { TextField, ActionButton } from "office-ui-fabric-react";

export default class TextFieldWithButtons extends React.Component<
  {
    name;
    textLabel;
    textValue;
    textPlaceholder;
    buttonText;
    handler;
  },
  { textValue: string }
> {
  constructor(props) {
    super(props);
    this.state = {
      textValue: ""
    };
  }
  componentDidMount() {
    this.setState(_prevState => ({
      textValue: this.props.textValue
    }));
  }

  componentWillReceiveProps(nextProps) {
    this.setState(_prevState => ({
      textValue: nextProps.textValue
    }));
  }

  handleChange = ({ target }) => {
    this.setState({
      textValue: target.value
    });
  };

  render() {
    return (
      <ul className="ms-List ms-welcome__features ms-u-slideUpIn10">
        <TextField
          label={this.props.textLabel}
          multiline
          autoAdjustHeight
          placeholder={this.props.textPlaceholder}
          value={this.state.textValue}
          onChange={this.handleChange}
        />
        {/* <IconButton
          iconProps={{ iconName: "Save" }}
          title={this.props.buttonText}
          onClick={() => this.props.handler(this.props.name, this.state.textValue)}
        /> */}
        <ActionButton
          iconProps={{ iconName: "Save" }}
          onClick={() => this.props.handler(this.props.name, this.state.textValue)}
          allowDisabledFocus
        >
          {this.props.buttonText}
        </ActionButton>
      </ul>
    );
  }
}
