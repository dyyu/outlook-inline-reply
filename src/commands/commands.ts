/*
 * Original work Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
 * Modified work Copyright dyyu. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */
import { reformatEmailBody } from "./formatter";
/* global Office, self, window */

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
 *
 * @param {Office.AddinCommands.Event} event
 *        Context information for this UI-less command
 *
 */
function reformatEmail(event) {
  // Fetch user preferences
  var preferences = Office.context.roamingSettings.get("preferences");
  self.console.info("Preferences:", preferences);

  // Create shorthands
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

      // Process the email body
      if (emailFormat == Office.CoercionType.Html) {
        var newBody = reformatEmailBody(result.value, true, preferences);
      } else if (emailFormat == Office.CoercionType.Text) {
        var newBody = reformatEmailBody(result.value, false, preferences);
      }

      // Write to the new body
      item.body.setAsync(newBody, { coercionType: emailFormat }, function(result) {
        self.console.info("Set email body", result.status);

        // Show a notification message
        item.notificationMessages.replaceAsync(
          "reformatEmail",
          getNotificationMessage("Email is now reformatted for inline reply.")
        );

        // Be sure to indicate when the add-in command function is complete
        event.completed();
      });
    });
  });
}

/**
 * Returns an object containing the notifcation settings
 *
 * @param {string} message
 *        Text message to show in the notification
 *
 * @returns {object}
 *          The objecting containing notification info
 */
function getNotificationMessage(message: string) {
  return {
    type: Office.MailboxEnums.ItemNotificationMessageType.InformationalMessage,
    message: message,
    icon: "Icon.80x80",
    persistent: false
  };
}

/**
 * Gets the global scope
 *
 * @returns {window}
 *          The global scope
 */
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
