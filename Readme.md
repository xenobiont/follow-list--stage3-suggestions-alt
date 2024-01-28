# Task

## general goals:

- On startup, load accounts data from the API and display 3 suggestions
- On clicking "Refresh", load 3 other account suggestions into the 3 rows
- On click 'x' button on an account row, clear only that current account and display another
- Each row displays the account's avatar and links to their page

1. Implement http request as a stream and output to console a list of users from Github
   Start with `url$` observable

Hints:

- use .pipe method
- if you return a promise from rxjs operator inside the pipe, it gets converted to Observable automatically

url that allows to do this:'https://api.github.com/users'

2. Implement 'refresh' button functionality, the list of users should be updated each time when user clicks 'refresh' button.

use a stream of clicks
the list should still also be fetched when the page loads.
On clicking "Refresh", load 3 other account suggestions into the 3 rows

Hint: use 
https://api.github.com/users?since=${getRandomOffset()} to randomize the list of users you get from Github

3 Individual refresh (close) buttons should refresh only this particular row suggestion when user clicks on it