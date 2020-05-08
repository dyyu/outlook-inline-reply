import * as React from "react";

export interface HeaderProps {
  title: string;
  logo: string;
  message: string;
}

export default class Header extends React.Component<HeaderProps> {
  render() {
    const { title, logo, message } = this.props;

    // Referring to variables we might still use in the future
    title;
    logo;

    return (
      <section className="ms-welcome__header ms-bgColor-neutralLighter ms-u-fadeIn">
        {/* <img width="90" height="90" src={logo} alt={title} title={title} /> */}
        <h1 className="ms-fontSize-su ms-fontWeight-light ms-fontColor-neutralPrimary">{message}</h1>
      </section>
    );
  }
}
