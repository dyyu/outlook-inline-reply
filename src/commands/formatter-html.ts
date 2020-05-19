/* eslint-env browser */

import * as userSettings from "../common/user-settings";

/**
 * Reformats an email body to support inline replies
 *
 * @param {string} body
 *        The email body
 * @param {userSettings.Preferences} preferences
 *        User preferences
 *
 * @returns {string}
 *          The modified email body
 */
export function reformatEmailHtml(body: string, preferences: userSettings.Preferences): string {
  var parser = new DOMParser();
  var contentToQuote = parser.parseFromString(body, "text/html");
  var modifiedBody = "";

  console.log("reformatEmailBody: received preferences", preferences);
  console.log("reformatEmailBody: original content:\n", contentToQuote.body.innerHTML);

  // Obtain the div font style
  var fontStyle = getFontStyle(contentToQuote.body.innerHTML);
  console.log("divStyle:", fontStyle);
  modifiedBody += `${fontStyle}<br><br>`;

  // Extract email header and replace it with "On DATE TIME, NAME <EMAIL> wrote"
  if (preferences.replaceHeader) {
    // Extract the sender and the time from the quoted email
    var citation = getEmailCitation(contentToQuote);
    console.log("citation:", citation);
    modifiedBody += citation;

    // Remove the email header
    removeEmailHeader(contentToQuote);
  }

  // Close the div of the fonts style
  modifiedBody += "</div>";

  // Remove external sender warning
  if (preferences.removeExternalWarning)
    removeExternalSenderWarning(contentToQuote.body, preferences.externalWarningHtml);

  // Add quotes to email
  addQuotesToEmail(contentToQuote.body);

  // Combine the new body to return, with a new line for user input
  modifiedBody += contentToQuote.body.innerHTML;

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
  // The font style is in the first <div style=... > tag
  var result = body.match(/<div style[^>]+>/);

  // If there is no font style, just return an empty div tag
  if (result == null) return "<div>";

  return result[0];
}

/**
 * Gets the citation string from the expanded email body
 *
 * @param {Document} doc
 *        The email HTML structure
 *
 * @returns {string}
 *          The citation string with the format "On TIMESTAMP, SENDER <EMAIL> wrote:"
 */
export function getEmailCitation(doc: Document) {
  var headerParts = doc.getElementById("divRplyFwdMsg").innerHTML.split("<br>");
  console.log("Header:", headerParts);

  var timestamp = "A";

  // Extract sender name and email
  var nameRe = /(?<=<b>(.)+:<\/b> ).*&lt;\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b&gt;/;
  var matchResult = headerParts[0].match(nameRe);
  if (matchResult == null) {
    console.log("Sender not found!");
    return "";
  }
  var senderString = matchResult[0];
  console.log("Sender found:", senderString);

  // Extract sent time and date
  var timestampRe = /(?<=<b>(.)+:<\/b> )(.)+/;
  matchResult = headerParts[1].match(timestampRe);
  if (matchResult == null) {
    console.log("Timestamp not found!");
    return "";
  }
  var timestamp = matchResult[0];
  console.log("Timestamp found:", timestamp);

  // Put the citation string together
  var citation = `On ${timestamp}, ${senderString} wrote:`;

  return citation;
}

/**
 * Removes the email header of an expanded email body
 *
 * @param {Document} doc
 *        The email HTML structure
 *
 * @returns {boolean}
 *          true on success, false otherwise
 */
export function removeEmailHeader(doc: Document): boolean {
  // Remove the <div id="divRplyFwdMsg" ...> tag
  doc.getElementById("divRplyFwdMsg").remove();

  // Remove the horizontal rule
  var hrList = doc.getElementsByTagName("hr");
  if (hrList.length > 0) {
    hrList[0].parentNode.removeChild(hrList[0]);
  }

  return true;
}

/**
 * Removes the warning about an external sender
 *
 * @param {HTMLElement} body
 *        The email HTML body
 * @param {string} externalSenderWarning
 *        The pattern of the external sender warning
 *
 * @returns {boolean}
 *          true on success, false otherwise
 */
export function removeExternalSenderWarning(body: HTMLElement, externalSenderWarning: string): boolean {
  // TODO: only look in the first quoted message!

  // Remove the external warning when it's exactly seen
  body.innerHTML = body.innerHTML.replace(externalSenderWarning, "");

  return true;
}

/**
 * Adds quotes to an email content
 *
 * @param {HTMLElement} body
 *        The content of the email
 *
 * @returns {boolean}
 *          true on success, false otherwise
 */
export function addQuotesToEmail(body: HTMLElement): boolean {
  // If HTML, add blockquote
  // If plain text, remove redundant new lines if preferred, and then add "> " in front of everyline

  // var blockquoteTag =
  // '<blockquote class="x_gmail_quote" style="margin:0px 0px 0px 0.8ex; border-left:1px solid rgb(204,204,204); padding-left:1ex">';
  // var blockquoteTag =
  //   '<blockquote style="border-left: 3px solid rgb(200, 200, 200); border-top-color: rgb(200, 200, 200); border-right-color: rgb(200, 200, 200); border-bottom-color: rgb(200, 200, 200); padding-left: 1ex; margin-left: 0.8ex; color: rgb(102, 102, 102);">';

  // var newContent = blockquoteTag + content + "</blockquote>";

  var blockquote = document.createElement("blockquote");

  // Outlook style blockquote
  blockquote.style.borderLeft = "3px solid rgb(200, 200, 200)";
  blockquote.style.borderColor = "rgb(200, 200, 200)";
  blockquote.style.paddingLeft = "1ex";
  blockquote.style.marginLeft = "0.8ex";
  blockquote.style.color = "rgb(102, 102, 102)";

  // Move all the current children elements into the blockquote element
  while (body.firstChild) {
    blockquote.appendChild(body.firstChild);
  }

  // Append the blockquote element to the body
  body.appendChild(blockquote);

  return true;
}
