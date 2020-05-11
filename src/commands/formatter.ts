/**
 * Reformats an email body to support inline replies
 *
 * @param {string} body
 *        The email body
 * @param {object} preferences
 *        User preferences
 *
 * @returns {string}
 *          The modified email body
 */
export function reformatEmailBody(body: string, preferences: object): string {
  console.log("reformatEmailBody: received preferences", preferences);

  // Remove email header if preferred
  // Remove external sender if preferred

  var newBody = addQuotesToEmail(body, "html");

  // Add a new line (unquoted) before the body for user input

  return newBody;
}

/**
 * Adds quotes to an email content
 *
 * @param {string} content
 *        The content of the email
 * @param {string} format
 *        The format of the email
 *
 * @returns {string}
 *          The quoted email content
 */
export function addQuotesToEmail(content, format = "html"): string {
  // If HTML, add blockquote
  // If plain text, remove redundant new lines if preferred, and then add "> " in front of everyline
  format;
  var blockquoteTag =
    '<blockquote class="x_gmail_quote" style="margin:0px 0px 0px 0.8ex; border-left:1px solid rgb(204,204,204); padding-left:1ex">';

  var newContent = blockquoteTag + content + "</blockquote>";
  return newContent;
}
