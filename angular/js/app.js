(function() {
  
  var app = angular.module('gemStore', []);
  
  app.controller('StoreController', function() {
    this.product = gem;
  });
  
  var gem = {
    name: 'Dodecahedron',
    price: 2.95,
    description: "Saul, Saul... this man that we spoke of before, this... this" + 
                 "person that you said could... could disappear me, get me a "  +
                 "whole new life and make sure that I'm never found. Yeah I "   + 
                 "need him, Saul. Gus is gonna murder my whole family. I need " + 
                 "this man now. Saul... now, Saul!"
  }

})();