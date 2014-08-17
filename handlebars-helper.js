/**
 * Handlebars template helper.
 *
 * Including this plugin will compile and cache Handlebar templates
 * in the DOM using the default selector [data-template-type=handlebars].
 *
 * Example template:

    <script id="addContacts" type="text/x-handlebars-template">
      {{data}}
    </script>

 * Example inits:

    // Compile and cache ALL templates on page with defualt selector:
    Handlebars.Templates.init();
    var output = Handlebars.Template.get( 'addContacts' );

    // or pass a custom selector:
    Handlebars.Templates.init( '#myTemplate' );
    var output = Handlebars.Template.get( 'myTemplate' );

 * @NOTE:
 * Add data-scrub to the template container to remove/replace generated
 * attributs (eg. id=""). This is useful when using .net user controls
 * as templates.
 *
 * The scrubber defaults to id="" if data-scrub is set, but contains no value
 *
 * Example:

    <-- template input -->
    <script id="addContacts" type="text/x-handlebars-template" data-scrub>
      <h3 id="$generated$id" data-id="people">{{title}}</h3>
      <div data-id="street">{{street}}</h3>
    </div>

    <-- scrubbed template output -->
    <h3 id="people">My Contacts</h3>
    <div id="street">123 Main Street</h3>

 *
 * rsg
 * inspired by: http://www.rajeshsegu.com/2012/11/js-organizing-and-loading-handlebars/
 */

define([
  'jquery',
  'handlebars'
],

function($, Handlebars) {

  'use strict';

  Handlebars.Templates = {

    TYPE: '[type=text/x-handlebars-template]',

    // store for compiled templates
    cache: {},

    init: function( selector ) {

      selector = ( selector ) ? selector : this.TYPE;

      // select the template(s) on the page
      var $rawTemplates = $( selector );

      if ( $rawTemplates.length ) {

        // compile each template into Handlebar functions
        // and add them to the cache
        $rawTemplates.each(function(i, rawTemplate) {
          Handlebars.Templates.prepare( rawTemplate );
        });

        return true;

      }

    },

    add: function( templateName, html ){

      var template = Handlebars.compile( html );

      // store the compiled template
      this.cache[ templateName ] = template;

      return template;

    },

    prepare: function( rawTemplate ) {

      var $rawTemplate = $( rawTemplate ),
          templateName = $rawTemplate.attr( 'id' ),
          html, template;

        // scrub generated attributes within the template.
        // set attrs to be scrubbed using data-scrub="myAttr"
        // scrubber defaults to id="" if data-scrub is set without a value
        html = this.scrub( $rawTemplate ).html();

        // compile and add compiled template to the cache store
        template = this.add( templateName, html );

        // cleanup DOM after caching
        $rawTemplate.remove();

        return template;

    },

    /**
     * Scrub templates to remove/replace generated attributes (eg. id="")
     *
     * @param  $object  $rawTemplate  the raw template, including its container as a jQuery object
     * @return $object                the scrubbed template
     */
    scrub: function( $rawTemplate ) {

      var data      = $rawTemplate.data(),  // use data-scrub="custom" to scrub custom attributes
          attr      = data.scrub || 'id',
          $setAttrs;

      // do nothing if data-scrub isn't set
      if ( typeof data.scrub == 'undefined' )
        return $rawTemplate;

      // store elements with attributes that need to be set
      $setAttrs = $rawTemplate.find( '[data-' + attr + ']' );

      // remove original attribute, eg id=""
      $rawTemplate.find( '[' + attr + ']' ).removeAttr( attr );

      // set new attributes using data-* and tidy up
      $setAttrs.each(function(){

        var $this = $( this ),
            value    = $this.data( attr );

        $this.attr( attr, value ).removeAttr( 'data-' + attr );

      });

      return $rawTemplate;

    },

    get: function( templateName, data ){

      // get the compiled template() function from the cache store
      var template = this.cache[ templateName ];

      if ( data && template )
          template = template( data );

      return template;

    },

    // remove template from the cache
    remove: function( templateName ){

      this.cache[ templateName ] = null;
      delete this.cache[ templateName ];

    }

  };

  return Handlebars.Templates;

});
