# Handlebars Helper

A helper to compile handlbar templates included in the DOM.

# Compiles at Runtime
The project this was originally written for was integrated with a CMS that made pre-comilation complex. We opted to complile at runtime given the limitations. For performance, handlbar templates should be pre-compiled when possible.

# Use
The Handlebars namespace must exist. Simply load `handlebars.js` first.

Send your templates to the client to be included in the DOM.

Example template:
```html
<html>
  <title>My Page</title>
</html>
<body>
  
  <h1>My Body</h1>

  <script id="addContacts" type="text/x-handlebars-template">
    {{data}}
  </script>
</body>
</html>
```

Example inits:
```javascript
// Compile and cache ALL templates on page with defualt selector:
Handlebars.Templates.init();
var output = Handlebars.Template.get( 'addContacts' );

// or pass a custom selector:
Handlebars.Templates.init( '#myTemplate' );
var output = Handlebars.Template.get( 'myTemplate' );
```

Add data-scrub to the template container to remove/replace generated attributs (eg. id=""). This is useful when using .net user controls as templates.

The scrubber defaults to id="" if data-scrub is set, but contains no value

Scrubber example:
```html
<-- template input -->
<script id="addContacts" type="text/x-handlebars-template" data-scrub>
  <h3 id="$generated$id" data-id="people">{{title}}</h3>
  <div data-id="street">{{street}}</h3>
</div>

<-- scrubbed template output -->
<h3 id="people">My Contacts</h3>
    <div id="street">123 Main Street</h3>
```

Original inspiration by from http://www.rajeshsegu.com/2012/11/js-organizing-and-loading-handlebars/