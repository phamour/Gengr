# Gengr
Generate grid graph from data

### Data format v1
Only basic data representing arcs are required, for **Arc list** input as well as for **Blockage list**.
Arcs are seperated into lines and each contains 2 fields delimited by whitespace(s): **source vertex id** and **target vertex id**.

**Note that** the vertex id is formated in human-readable version, which means it should vary from 1 to N.

- Example of a K3 graph (complet graph with 3 vertices):
  
  ```
  1 2
  2 3
  3 1
  ```

### Local static server (for memo)

- Install `connect` and `serve-static` via npm:

        $ npm install connect serve-static

- Create  `server.js` with following code:
  ```javascript
  var connect = require('connect');
  var serveStatic = require('serve-static');
  connect().use(serveStatic(__dirname)).listen(8000, function(){
      console.log('Server running on 8000...');
  });
  ```
        
- Launch server:

        $ node server
