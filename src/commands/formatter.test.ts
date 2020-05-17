/**
 * @jest-environment jsdom
 */
import {
  getFontStyle,
  getCitation,
  removeEmailHeader,
  addQuotesToEmail,
  removeExternalSenderWarning
} from "./formatter";

var testHtmlBody =
  '<div style="font-family: Verdana, Geneva, sans-serif; font-size: 10pt; color: rgb(0, 0, 0);"><br></div><div id="appendonsend"></div><div style="font-family:Verdana,Geneva,sans-serif; font-size:10pt; color:rgb(0,0,0)"><br></div><hr tabindex="-1" style="display:inline-block; width:98%"><div id="divRplyFwdMsg" dir="ltr"><font face="Calibri, sans-serif" color="#000000" style="font-size:11pt"><b>From:</b> John Smith &lt;j.smith@gmail.com&gt;<br><b>Sent:</b> Thursday, April 23, 2020 4:14 PM<br><b>To:</b> Foo Bar &lt;foo.bar@gmail.com&gt;<br><b>Subject:</b> Re: Test inline reply</font><div>&nbsp;</div></div><div><div style="background-color:#FF0000; ">WARNING: This email was sent from outside the organization.</div><div><div dir="ltr"><div class="x_gmail_quote"><div style="font-family:Verdana,Geneva,sans-serif; font-size:10pt; color:rgb(0,0,0)"><br></div><div style="font-family:Verdana,Geneva,sans-serif; font-size:10pt; color:rgb(0,0,0)">Test</div></div></div></div></div>';

let doc: Document;

beforeEach(() => {
  var parser = new DOMParser();
  doc = parser.parseFromString(testHtmlBody, "text/html");
});

test("Extract font style from HTML body", () => {
  expect(getFontStyle(testHtmlBody)).toMatch(
    '<div style="font-family: Verdana, Geneva, sans-serif; font-size: 10pt; color: rgb(0, 0, 0);">'
  );
});

test("Get citation in email reply", () => {
  expect(getCitation(doc)).toBe("On Thursday, April 23, 2020 4:14 PM, John Smith &lt;j.smith@gmail.com&gt; wrote:");
});

test("Remove header in email reply", () => {
  removeEmailHeader(doc);
  expect(doc.getElementById("divRplyFwdMsg")).toBeNull();
});

test("Removing external sender warning", () => {
  removeExternalSenderWarning(
    doc.body,
    '<div style="background-color:#FF0000; ">WARNING: This email was sent from outside the organization.</div>'
  );
  expect(doc.body.innerHTML).toBe(
    '<div style="font-family: Verdana, Geneva, sans-serif; font-size: 10pt; color: rgb(0, 0, 0);"><br></div><div id="appendonsend"></div><div style="font-family:Verdana,Geneva,sans-serif; font-size:10pt; color:rgb(0,0,0)"><br></div><hr tabindex="-1" style="display:inline-block; width:98%"><div id="divRplyFwdMsg" dir="ltr"><font face="Calibri, sans-serif" color="#000000" style="font-size:11pt"><b>From:</b> John Smith &lt;j.smith@gmail.com&gt;<br><b>Sent:</b> Thursday, April 23, 2020 4:14 PM<br><b>To:</b> Foo Bar &lt;foo.bar@gmail.com&gt;<br><b>Subject:</b> Re: Test inline reply</font><div>&nbsp;</div></div><div><div><div dir="ltr"><div class="x_gmail_quote"><div style="font-family:Verdana,Geneva,sans-serif; font-size:10pt; color:rgb(0,0,0)"><br></div><div style="font-family:Verdana,Geneva,sans-serif; font-size:10pt; color:rgb(0,0,0)">Test</div></div></div></div></div>'
  );
});

test("Adding blockquote to HTML email", () => {
  addQuotesToEmail(doc.body);
  expect(doc.body.innerHTML).toMatch(/<blockquote(.|\n|\r)*<\/blockquote>/);
});
