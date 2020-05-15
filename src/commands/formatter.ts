import * as userSettings from "../common/userSettings";

/**
 * Reformats an email body to support inline replies
 *
 * @param {string} body
 *        The email body
 * @param {boolean} isHtml
 *        True for HTML body, False for plain text
 * @param {userSettings.Preferences} preferences
 *        User preferences
 *
 * @returns {string}
 *          The modified email body
 */
export function reformatEmailBody(body: string, isHtml: boolean, preferences: userSettings.Preferences): string {
  if (!isHtml) {
    console.warn("Not supported yet. Doing nothing.");
  }

  console.log("reformatEmailBody: received preferences", preferences);
  console.log("reformatEmailBody: original content:\n", body);

  var modifiedBody = "";
  var contentToQuote = body;

  // Obtain the div text style
  var fontStyle = getFontStyle(body);
  console.log("divStyle:", fontStyle);
  modifiedBody += `${fontStyle}<br>`;

  // Extract email header and replace it with "On DATE TIME, NAME <EMAIL> wrote"
  if (preferences.replaceHeader) {
    // Extract the sender and the time from the quoted email
    var citation = getCitation(body);
    modifiedBody += citation;

    // Remove the email header
    var contentToQuote = getHeaderlessContent(contentToQuote);
  }
  modifiedBody += "</div>";

  // Remove external sender warning
  if (preferences.removeExternalWarning)
    contentToQuote = removeExternalSenderWarning(contentToQuote, preferences.externalWarningHtml);

  // Add quotes to email
  var quotedContent = addQuotesToEmail(contentToQuote);

  // Combine the new body to return, with a new line for user input
  modifiedBody += quotedContent;

  return modifiedBody;
}

/**
 * Extracts the font style from the email body
 *
 * @param {string} body
 *        The email body
 *
 * @returns {string}
 *          The <div> tag containing the font style
 */
export function getFontStyle(body: string) {
  var result = body.match(/<div style[^>]+>/);
  if (result == null) return "<div>";

  return result[0];
}

/**
 * Gets the citation string from the expanded email body
 *
 * @param {string} body
 *        The email body
 *
 * @returns {string}
 *          The citation string with the format "On TIMESTAMP, SENDER <EMAIL> wrote:"
 */
export function getCitation(body: string) {
  // Extract sender name and email
  var nameRe = /(?<=<b>(.)+:<\/b> )(.)*&lt;\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b&gt;/;
  var matchResult = body.match(nameRe);
  if (matchResult == null) return "";
  var senderString = matchResult[0];
  var nextIndex = matchResult.index + senderString.length;
  console.log("Sender found:", senderString);

  // Extract sent time and date
  var timestampRe = /(?<=<b>(.)+:<\/b> )(.)+(?=<br>)/;
  matchResult = body.substring(nextIndex).match(timestampRe);
  if (matchResult == null) return "";
  var timestamp = matchResult[0];
  console.log("Timestamp found:", timestamp);

  // Put the citation string together
  var citation = `On ${timestamp}, ${senderString} wrote:`;

  return citation;
}

/**
 * Removes the email header of an expanded email body
 *
 * @param {string} body
 *        The email body
 *
 * @returns {string}
 *          The modified body with the email header removed
 */
export function getHeaderlessContent(body: string) {
  var pattern = /<hr (.)+>(\n)*<div (.)+(\n)*(<b>(.)+(\n)*)+((.)*\n)<\/div>/;
  return body.replace(pattern, "");
}

/**
 * Removes the warning about an external sender
 *
 * @param {string} content
 *        The email body
 * @param {string} externalSenderWarning
 *        The pattern of the external sender warning
 *
 * @returns {string}
 *          The email body with the external sender warning removed
 */
export function removeExternalSenderWarning(content: string, externalSenderWarning: string) {
  // TODO: only look in the first quoted message!
  return content.replace(externalSenderWarning, "");
}

/**
 * Adds quotes to an email content
 *
 * @param {string} content
 *        The content of the email
 *
 * @returns {string}
 *          The quoted email content
 */
export function addQuotesToEmail(content: string): string {
  // If HTML, add blockquote
  // If plain text, remove redundant new lines if preferred, and then add "> " in front of everyline

  // var blockquoteTag =
  // '<blockquote class="x_gmail_quote" style="margin:0px 0px 0px 0.8ex; border-left:1px solid rgb(204,204,204); padding-left:1ex">';
  var blockquoteTag =
    '<blockquote style="border-left: 3px solid rgb(200, 200, 200); border-top-color: rgb(200, 200, 200); border-right-color: rgb(200, 200, 200); border-bottom-color: rgb(200, 200, 200); padding-left: 1ex; margin-left: 0.8ex; color: rgb(102, 102, 102);">';

  var newContent = blockquoteTag + content + "</blockquote>";
  return newContent;
}
