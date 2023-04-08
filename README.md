# CZ2006 : Software Engineering

## Setup Instructions
The project is a Firebase project which requires Firebase to be installed in local PC. <br />
Detail set up guide on <a href="https://firebase.google.com/docs/web/setup">https://firebase.google.com/docs/web/setup</a>

<hr>

As Google Chrome is enforcing Same-origin policy, it is blocking access to our URA API which is where we fetch our carpark locations from. 
To solve this, we can launch an instance of Google Chrome that disables this security check. Run the terminal command below.


For Mac Users: <br />
open -na Google\ Chrome --args --user-data-dir=$HOME/Developer/chrome-dev-session --disable-web-security --disable-site-isolation-trials

For Windows Users: <br />
chrome.exe --user-data-dir="C:/Chrome dev session" --disable-web-security
