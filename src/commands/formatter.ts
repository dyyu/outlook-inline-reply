export function addQuoteToEmailBody(body: string) {
  var blockquoteTag =
    '<blockquote class="x_gmail_quote" style="margin:0px 0px 0px 0.8ex; border-left:1px solid rgb(204,204,204); padding-left:1ex">';

  var newBody = blockquoteTag + body + "</blockquote>";

  return newBody;
}
