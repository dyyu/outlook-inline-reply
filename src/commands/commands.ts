/*
 * Original work Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
 * Modified work Copyright dyyu. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */
/* global global, Office, self, window */

// The initialize function must be run each time a new page is loaded.
Office.initialize = function(reason) {
  self.console.info("Office.initialize: " + reason);
};

Office.onReady(() => {
  self.console.info("Office.onReady");
  // If needed, Office.js is ready to be called
});

/**
 * Shows a notification when the add-in command is executed.
 * @param event {Office.AddinCommands.Event}
 */
function reformatEmail(event) {
  var item = Office.context.mailbox.item;

  // Check whether the body is plaintext or html
  item.body.getTypeAsync(function(result) {
    var emailFormat = result.value;
    self.console.info("Email format is", emailFormat);

    // Get the current body (this does not include the message history if it's hidden)
    item.body.getAsync(emailFormat, function(result) {
      self.console.info("Get email body", result.status);

      // Do nothing if the there's an error getting the body
      if (result.status == Office.AsyncResultStatus.Failed) event.completed();

      // TODO: Replace the quoted email header with a single line:
      // E.g., On Thursday, April 23, 2020 at 4:15 PM Jane <jane@protonmail.ch> wrote:

      // Add the quotes
      if (emailFormat == Office.CoercionType.Html) {
        // Add the blockquote tag
        var blockquoteTag =
          '<blockquote class="x_gmail_quote" style="margin:0px 0px 0px 0.8ex; border-left:1px solid rgb(204,204,204); padding-left:1ex">';
        var newBody = blockquoteTag + result.value + "</blockquote>";
      } else if (emailFormat == Office.CoercionType.Text) {
        // TODO: handle plain text email
      }

      // Write to the new body
      item.body.setAsync(newBody, { coercionType: emailFormat }, function(result) {
        self.console.info("Set email body", result.status);

        // Show a notification message
        item.notificationMessages.replaceAsync(
          "reformatEmail",
          notificationMessage("Email is now reformatted for inline reply.")
        );

        // Be sure to indicate when the add-in command function is complete
        event.completed();
      });
    });
  });
}

function notificationMessage(message) {
  return {
    type: Office.MailboxEnums.ItemNotificationMessageType.InformationalMessage,
    message: message,
    icon: "Icon.80x80",
    persistent: false
  };
}

function getGlobal() {
  return typeof self !== "undefined"
    ? self
    : typeof window !== "undefined"
    ? window
    : typeof global !== "undefined"
    ? global
    : undefined;
}

const g = getGlobal() as any;

// the add-in command functions need to be available in global scope
g.reformatEmail = reformatEmail;
