/*jshint strict:true, evil:true, boss:false, laxbreak:true, laxcomma:true, latedef:true, immed:true, newcap:true, noarg:true, nonew:true, plusplus:true, regexp:true, undef:true, unused:true, trailing:true, eqeqeq:true, curly:true, camelcase:true, bitwise:true */

define([
      'modules/jquery-mozu'
    , "underscore"
    , 'modules/api'
  ]

, function ($, _, api) {

    "use strict";

    /**
     * Returns a rendered template that uses [[ mustache like ]] variable placeholders
     *
     * @requires jQuery
     *
     * @param  object       collection  A collection of key/value pairs
     * @param  string|html  template    The mustache markup that we want to render against
     * @return string|html              Rendered mustache template markup
     */
    var renderTemplate = function(collection, template) {

        // Render the template
        $.each(collection, function(key, value) {
            var regexString = "(\\[\\[(?:\\s+)?" + key.toLowerCase() + "(?:\\s+)?\\]\\])"
              , regexKey    = new RegExp(regexString, 'gi')
              ;

            template = template.replace(regexKey, value);
          });

        // cleanup unused template flags
        return template.replace(/(\[\[[\s\S]+?\]\])/gi, '');
      };


    $(document).ready(function () {

      $('[data-mz-packages-list-widget]').each(function () {

        var sectionTemplate = $('#mz-packages-list-template').html();
        var $renderTarget = $(this);

        api
          .get('categories', { filter: 'content.name cont Packages' })
          .then(function(cats) {
            window.cats = cats;
            console.log(window.cats);

            // Map all category data data to our categories var
            var categories = _.map(cats, function(cat) {

                // If the system says to not render this category...
                if (!cat.prop("isDisplayed")) {
                  return;
                }

                // Otherwise, lets add it to the render queue :D
                return {
                    name:         cat.prop("content").name
                  , description:  cat.prop("content").description
                  , images:       cat.prop("content").categoryImages
                  , catID:        cat.prop("categoryId")
                  , img:          '/resources/images/lps/packages/thumb-' + cat.prop("categoryId") + '.jpg'
                  , url:          '/c/' + cat.prop("categoryId")
                  };
              });

            // Iterate over each of our category ID's and append the template to the widget container
            $.each(categories, function(index, catObj) {

                // Render the template against $this object's data and append to the target DOM node
                $renderTarget.append( renderTemplate(catObj, sectionTemplate) );

              });

          });

    });
  });
});
