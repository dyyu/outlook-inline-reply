export function reformatEmailBody(body: string, preferences: {}) {
  console.log("reformatEmailBody: received preferences", preferences);

  // Remove email header if preferred
  // Remove external sender if preferred

  var newBody = addQuotesToEmail(body, "html");

  // Add a new line (unquoted) before the body for user input

  return newBody;
}

export function addQuotesToEmail(content, format = "html") {
  // If HTML, add blockquote
  // If plain text, remove redundant new lines if preferred, and then add "> " in front of everyline
  format;
  var blockquoteTag =
    '<blockquote class="x_gmail_quote" style="margin:0px 0px 0px 0.8ex; border-left:1px solid rgb(204,204,204); padding-left:1ex">';

  var newContent = blockquoteTag + content + "</blockquote>";
  return newContent;
}
