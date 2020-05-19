/**
 * @jest-environment jsdom
 */
import {
  getFontStyle,
  getEmailCitation,
  removeEmailHeader,
  addQuotesToEmail,
  removeExternalSenderWarning,
  reformatEmailHtml
} from "./formatter-html";

import { Preferences } from "../common/user-settings";

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
  expect(getEmailCitation(doc)).toBe("On Thursday, April 23, 2020 4:14 PM, John Smith &lt;j.smith@gmail.com&gt; wrote:");
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

test.each`
  preferences                                                                                                                                                                                                                      | expected
  ${<Preferences>{ polishPlainText: false, replaceHeader: false, removeExternalWarning: false, externalWarningHtml: '<div style="background-color:#FF0000; ">WARNING: This email was sent from outside the organization.</div>' }} | ${'<div style="font-family: Verdana, Geneva, sans-serif; font-size: 10pt; color: rgb(0, 0, 0);"><br><br></div><blockquote style="border-left: 3px solid rgb(200, 200, 200); border-color: rgb(200, 200, 200); padding-left: 1ex; margin-left: 0.8ex; color: rgb(102, 102, 102);"><div style="font-family: Verdana, Geneva, sans-serif; font-size: 10pt; color: rgb(0, 0, 0);"><br></div><div id="appendonsend"></div><div style="font-family:Verdana,Geneva,sans-serif; font-size:10pt; color:rgb(0,0,0)"><br></div><hr tabindex="-1" style="display:inline-block; width:98%"><div id="divRplyFwdMsg" dir="ltr"><font face="Calibri, sans-serif" color="#000000" style="font-size:11pt"><b>From:</b> John Smith &lt;j.smith@gmail.com&gt;<br><b>Sent:</b> Thursday, April 23, 2020 4:14 PM<br><b>To:</b> Foo Bar &lt;foo.bar@gmail.com&gt;<br><b>Subject:</b> Re: Test inline reply</font><div>&nbsp;</div></div><div><div style="background-color:#FF0000; ">WARNING: This email was sent from outside the organization.</div><div><div dir="ltr"><div class="x_gmail_quote"><div style="font-family:Verdana,Geneva,sans-serif; font-size:10pt; color:rgb(0,0,0)"><br></div><div style="font-family:Verdana,Geneva,sans-serif; font-size:10pt; color:rgb(0,0,0)">Test</div></div></div></div></div></blockquote>'}
  ${<Preferences>{ polishPlainText: false, replaceHeader: true, removeExternalWarning: false, externalWarningHtml: '<div style="background-color:#FF0000; ">WARNING: This email was sent from outside the organization.</div>' }}  | ${'<div style="font-family: Verdana, Geneva, sans-serif; font-size: 10pt; color: rgb(0, 0, 0);"><br><br>On Thursday, April 23, 2020 4:14 PM, John Smith &lt;j.smith@gmail.com&gt; wrote:</div><blockquote style="border-left: 3px solid rgb(200, 200, 200); border-color: rgb(200, 200, 200); padding-left: 1ex; margin-left: 0.8ex; color: rgb(102, 102, 102);"><div style="font-family: Verdana, Geneva, sans-serif; font-size: 10pt; color: rgb(0, 0, 0);"><br></div><div id="appendonsend"></div><div style="font-family:Verdana,Geneva,sans-serif; font-size:10pt; color:rgb(0,0,0)"><br></div><div><div style="background-color:#FF0000; ">WARNING: This email was sent from outside the organization.</div><div><div dir="ltr"><div class="x_gmail_quote"><div style="font-family:Verdana,Geneva,sans-serif; font-size:10pt; color:rgb(0,0,0)"><br></div><div style="font-family:Verdana,Geneva,sans-serif; font-size:10pt; color:rgb(0,0,0)">Test</div></div></div></div></div></blockquote>'}
  ${<Preferences>{ polishPlainText: false, replaceHeader: false, removeExternalWarning: true, externalWarningHtml: '<div style="background-color:#FF0000; ">WARNING: This email was sent from outside the organization.</div>' }}  | ${'<div style="font-family: Verdana, Geneva, sans-serif; font-size: 10pt; color: rgb(0, 0, 0);"><br><br></div><blockquote style="border-left: 3px solid rgb(200, 200, 200); border-color: rgb(200, 200, 200); padding-left: 1ex; margin-left: 0.8ex; color: rgb(102, 102, 102);"><div style="font-family: Verdana, Geneva, sans-serif; font-size: 10pt; color: rgb(0, 0, 0);"><br></div><div id="appendonsend"></div><div style="font-family:Verdana,Geneva,sans-serif; font-size:10pt; color:rgb(0,0,0)"><br></div><hr tabindex="-1" style="display:inline-block; width:98%"><div id="divRplyFwdMsg" dir="ltr"><font face="Calibri, sans-serif" color="#000000" style="font-size:11pt"><b>From:</b> John Smith &lt;j.smith@gmail.com&gt;<br><b>Sent:</b> Thursday, April 23, 2020 4:14 PM<br><b>To:</b> Foo Bar &lt;foo.bar@gmail.com&gt;<br><b>Subject:</b> Re: Test inline reply</font><div>&nbsp;</div></div><div><div><div dir="ltr"><div class="x_gmail_quote"><div style="font-family:Verdana,Geneva,sans-serif; font-size:10pt; color:rgb(0,0,0)"><br></div><div style="font-family:Verdana,Geneva,sans-serif; font-size:10pt; color:rgb(0,0,0)">Test</div></div></div></div></div></blockquote>'}
  ${<Preferences>{ polishPlainText: false, replaceHeader: true, removeExternalWarning: true, externalWarningHtml: '<div style="background-color:#FF0000; ">WARNING: This email was sent from outside the organization.</div>' }}   | ${'<div style="font-family: Verdana, Geneva, sans-serif; font-size: 10pt; color: rgb(0, 0, 0);"><br><br>On Thursday, April 23, 2020 4:14 PM, John Smith &lt;j.smith@gmail.com&gt; wrote:</div><blockquote style="border-left: 3px solid rgb(200, 200, 200); border-color: rgb(200, 200, 200); padding-left: 1ex; margin-left: 0.8ex; color: rgb(102, 102, 102);"><div style="font-family: Verdana, Geneva, sans-serif; font-size: 10pt; color: rgb(0, 0, 0);"><br></div><div id="appendonsend"></div><div style="font-family:Verdana,Geneva,sans-serif; font-size:10pt; color:rgb(0,0,0)"><br></div><div><div><div dir="ltr"><div class="x_gmail_quote"><div style="font-family:Verdana,Geneva,sans-serif; font-size:10pt; color:rgb(0,0,0)"><br></div><div style="font-family:Verdana,Geneva,sans-serif; font-size:10pt; color:rgb(0,0,0)">Test</div></div></div></div></div></blockquote>'}
`("Reformat an HTML email", ({ preferences, expected }) => {
  expect(reformatEmailHtml(testHtmlBody, preferences)).toBe(expected);
});
