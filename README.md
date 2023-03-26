# CZ2006 : Software Engineering

## Setup Instructions
As Google Chrome is enforcing Same-origin policy, it is blocking access to our URA API which is where we fetch our carpark locations from. 
To solve this, we can launch an instance of Google Chrome that disables this security check. Run the terminal command below.


For Mac Users: <br />
open -na Google\ Chrome --args --user-data-dir=$HOME/Developer/chrome-dev-session --disable-web-security --disable-site-isolation-trials

For Windows Users: <br />
chrome.exe --user-data-dir="C:/Chrome dev session" --disable-web-security
