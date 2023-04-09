# CZ2006 : Software Engineering

## Setup Instructions
The project is a Firebase project which requires Firebase to be installed in local PC. <br />
Detail set up guide on <a href="https://firebase.google.com/docs/web/setup">https://firebase.google.com/docs/web/setup</a>
<hr>

## URA API Token
Due to security concerns, the ura.gov.sg data API we chose requires a daily regeneration of a new token after midnight 12 am. Therefore, if the token is not updated, it is typical for the car park locations not to be displayed.

Steps to update the token:
1. visit to <a href="http://www.ura.gov.sg/uraDataService/getToken.jsp?">http://www.ura.gov.sg/uraDataService/getToken.jsp?</a>
2. input the access key:  d42d13f1-6cfa-489b-9940-508afe48dcf8
3. go to main.js in the project, search for "token" and replace it with the new generated token
<hr>

## Npm Command
<b>npm install</b> - to install all the dependencies included in package.json <br/>
<b>Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass </b> - you may need to run this before running the command below <br/>
<b>firebase serve </b> - run the firebase project in localhost <br/>
<b>firebase deploy </b> - deploy the firebase project to <a href="https://sc2006-1d9b8.web.app/">https://sc2006-1d9b8.web.app/</a>
<hr>

## Running the project in localhost using the disabled web security Google Chrome
As Google Chrome is enforcing Same-origin policy, it is blocking access to our URA API which is where we fetch our carpark locations from. 
To solve this, we can launch an instance of Google Chrome that disables this security check. 


For Mac Users, open terminal and run this command: <br />
open -na Google\ Chrome --args --user-data-dir=$HOME/Developer/chrome-dev-session --disable-web-security --disable-site-isolation-trials

For Windows Users, use "Run" in windows to run this command:<br />
chrome.exe --user-data-dir="C:/Chrome dev session" --disable-web-security
