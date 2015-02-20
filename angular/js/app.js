// (function() {
  
//   var app = angular.module('gemStore', []);
  
//   app.controller('StoreController', function() {
//     this.products = gems;
//   });

//   var gems = [
//     {
//       name: 'Dodecahedron',
//       price: 2,
//       description: "Saul, Saul... this man that we spoke of before, this... this" + 
//                    "person that you said could... could disappear me, get me a "  +
//                    "whole new life and make sure that I'm never found. Yeah I "   + 
//                    "need him, Saul. Gus is gonna murder my whole family. I need " + 
//                    "this man now. Saul... now, Saul!",
//       canPurchase: true,
//       soldOut: false,
//       images: [
//         {
//           full: 'images/gem-1.jpeg',
//           thumb: 'images/gem-2.jpeg'
//         }
//       ]
//     },
//     {
//       name: 'Pentagonal Gem',
//       price: 5.95,
//       description: "Anything suspicious? Well... then should we go? Any uh... "       + 
//                    "Cartel news these days? Seems like I'm always reading something"  + 
//                    " or other in the paper. I don't want to talk about it. To you or" + 
//                    " anyone else. I'm done explaining myself. Gus is dead. We've got" + 
//                    " work to do.",
//       canPurchase: true,
//       soldOut: false,
//       images: [
//         {
//           full: 'images/gem-3.jpeg',
//           thumb: 'images/gem-4.jpeg'
//         }
//       ]
//     }
//   ];

// })();

(function() {
  var app = angular.module('gemStore', []);

  app.controller('StoreController', function(){
    this.products = gems;
  });

  var gems = [{
      name: 'Azurite',
      description: "Some gems have hidden qualities beyond their luster, beyond their shine... Azurite is one of those gems.",
      shine: 8,
      price: 110.50,
      rarity: 7,
      color: '#CCC',
      faces: 14,
      images: [
        "images/azurite.gif",
        "images/gem-05.gif",
        "images/gem-09.gif"
      ],
      reviews: [{
        stars: 5,
        body: "I love this gem!",
        author: "joe@example.org",
        createdOn: 1397490980837
      }, {
        stars: 1,
        body: "This gem sucks.",
        author: "tim@example.org",
        createdOn: 1397490980837
      }]
    }, {
      name: 'Bloodstone',
      description: "Origin of the Bloodstone is unknown, hence its low value. It has a very high shine and 12 sides, however.",
      shine: 9,
      price: 22.90,
      rarity: 6,
      color: '#EEE',
      faces: 12,
      images: [
        "images/Bloodstone.gif",
        "images/gem-03.gif",
        "images/gem-04.gif"
      ],
      reviews: [{
        stars: 3,
        body: "I think this gem was just OK, could honestly use more shine, IMO.",
        author: "JimmyDean@example.org",
        createdOn: 1397490980837
      }, {
        stars: 4,
        body: "Any gem with 12 faces is for me!",
        author: "gemsRock@example.org",
        createdOn: 1397490980837
      }]
    }, {
      name: 'Zircon',
      description: "Zircon is our most coveted and sought after gem. You will pay much to be the proud owner of this gorgeous and high shine gem.",
      shine: 70,
      price: 1100,
      rarity: 2,
      color: '#000',
      faces: 6,
      images: [
        "images/zircon.gif",
        "images/gem-07.gif",
        "images/gem-10.gif"
      ],
      reviews: [{
        stars: 1,
        body: "This gem is WAY too expensive for its rarity value.",
        author: "turtleguyy@example.org",
        createdOn: 1397490980837
      }, {
        stars: 1,
        body: "BBW: High Shine != High Quality.",
        author: "LouisW407@example.org",
        createdOn: 1397490980837
      }, {
        stars: 1,
        body: "Don't waste your rubles!",
        author: "nat@example.org",
        createdOn: 1397490980837
      }]
    }];
})();
