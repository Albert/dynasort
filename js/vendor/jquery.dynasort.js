(function( $ ){

  var methods = {
    init : function( options ) {
      return this.each(function(){
        $("<div/>").html('<a href="#">asdf</a>').appendTo("#graph");
      });
    },
    show : function( ) {
    },
    hide : function( ) {
    },
    update : function( ) {
    }
  };

  $.fn.dynasort = function( method ) {

    if ( methods[method] ) {
      return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else if ( typeof method === 'object' || ! method ) {
      return methods.init.apply( this, arguments );
    } else {
      $.error( 'Method ' +  method + ' does not exist on jQuery.dynasort' );
    }

  };

})( jQuery );

$(document).ready(function(){
  $("#graph").dynasort();
});
