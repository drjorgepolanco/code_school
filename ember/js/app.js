var App = Ember.Application.create({
  LOG_TRANSITIONS: true
});


// -----------------------------------------------------------------------------
// ROUTER
// ------

App.Router.map(function() {
  this.route('credits');
  this.resource('products', function() {
    this.resource('product', { path: '/:product_id' });
    this.route('onsale'); // /products/onsale -> link would be products.onsale
    this.route('deals');
  });
  this.resource('contacts', function() {
    this.resource('contact', { path: '/:contact_id' });
  });
});


// -----------------------------------------------------------------------------
// ROUTES
// ------

App.ProductsRoute = Ember.Route.extend({
  model: function() {
    // return App.PRODUCTS;
    return this.store.findAll('product');

    // Server sorting
    // return this.store.find('product', { order: 'title' });
  }
});

App.ProductRoute = Ember.Route.extend({
  model: function(params) {
    console.log(params);
    // return App.PRODUCTS.findBy('title', params.title);
    return this.store.find('product', params.product_id);
  }
});

App.ContactsRoute = Ember.Route.extend({
  model: function() {
    // return App.CONTACTS;
    return this.store.findAll('contact');
  }
});

App.ContactRoute = Ember.Route.extend({
  model: function(params) {
    // return App.CONTACTS.findBy('name', params.name);
    return this.store.find('contact', params.contact_id);
  }
});

App.IndexRoute = Ember.Route.extend({
  model: function() {
    return this.store.findAll('product');
  }
});

App.ProductsIndexRoute = Ember.Route.extend({
  model: function() {
    return this.store.findAll('product');
  }
});

App.ProductsOnsaleRoute = Ember.Route.extend({
  model: function() {
    return this.modelFor('products').filterBy('isOnSale');
  }
});

App.ProductsDealsRoute = Ember.Route.extend({
  model: function() {
    return this.modelFor('products').filter(function() {
      return product.get('price') < 500;
    });
  }
});

App.ContactsIndexRoute = Ember.Route.extend({
  model: function() {
    return this.store.find('contact', 2);
  }
});


// -----------------------------------------------------------------------------
// CONTROLLERS
// -----------

App.IndexController = Ember.ArrayController.extend({
  productsCount: function() {
    return this.get('length');
  }.property('length'), /* This will keep a watch on 'length' */
  //productsCount: Ember.computed.alias('length'), <-- shorthand version
  logo: './images/logo-small.png',
  time: function() {
    return (new Date()).toDateString()
  }.property(),
  onSale: function() {
    // return this.filter(function(product) {
    //   return product.get('isOnSale').slice(0, 3);
    // }); <-- long version
    return this.filterBy('isOnSale').slice(0, 3); // <-- shorthand version
  }.property('@each.isOnSale')
});

// App.ProductsIndexController = Ember.ArrayController.extend({
//   deals: function() {
//     return this.filter(function(product) {
//       return product.get('price') < 500;
//     });
//   }.property('@each.price')
// });

App.ContactsIndexController = Ember.ObjectController.extend({
  contactName: Ember.computed.alias('name'),
  avatar: "./images/contacts/avatar.png",
  open: function() {
    if (new Date().getDay() === 0) {
      return "Closed";
    }
    else {
      return "Open";
    }
  }.property()
});

// Array Controller
App.ProductsController = Ember.ArrayController.extend({
  sortProperties: ['title'] /* Default sorting A-Z */

  //sortProperties: ['title'], /* Reverse sorting Z-A */
  //sortAscending: false
});

// Object Controller
// App.ProductsController = Ember.ObjectController.extend({});

App.ContactsController = Ember.ArrayController.extend({
  sortProperties: ['name']
});

App.ReviewsController = Ember.ArrayController.extend({
  sortProperties: ['reviewedAt'],
  sortAscending: false
});

App.ContactProductsController = Ember.ArrayController.extend({
  sortProperties: ['title'],
  sortAscending: false
});

App.ProductController = Ember.ObjectController.extend({
  text:'', // <-- If left off, the property would be set on the model! NO NO
  selectedRating: 5,
  ratings: [1, 2, 3, 4, 5],
  actions: {
    createReview: function () {
      console.log('createReview Called');

      // Step 1: Build a new Review object
      var review = this.store.createRecord('review', {
        text: this.get('text'),
        product: this.get('model'),
        reviewedAt: new Date()
      });
      var controller = this; // Need to be able to reference the controller in the save callback

      // Step 2: Save the Review
      review.save().then(function(review) {
        // Step 3: Clear out the text variable
        // Will be called when the save call finishes
        controller.set('text', ''); // Clear out the text field
        controller.get('model.reviews').addObject(review); // Add the review to products review
      });
    },
    createRating: function () {
      var product = this.get('model'), selectedRating = this.get('selectedRating');
      product.get('ratings').addObject(selectedRating);
      product.save();
    }
  }
});


// -----------------------------------------------------------------------------
// VIEWS
// -----

App.ProductView = Ember.View.extend({
  classNames: ['row'],
  classNameBindings: ['isOnSale'],
  isOnSale: Ember.computed.alias('controller.isOnSale')
});


// -----------------------------------------------------------------------------
// COMPONENTS
// ----------

App.ProductDetailsComponent = Ember.Component.extend({
  reviewsCount: Ember.computed.alias('product.reviews.length'),
  hasReviews: function () {
    return this.get('reviewsCount') > 0;
  }.property('reviewsCount')
});

App.ContactDetailsComponent = Ember.Component.extend({
  productsCount: Ember.computed.alias('contact.products.length'),
  isProductive: function () {
    return this.get('productsCount') > 3;
  }.property('productsCount')
});

// -----------------------------------------------------------------------------
// MODELS
// ------

App.Product = DS.Model.extend({
  title: DS.attr('string'),
  price: DS.attr('number'),
  description: DS.attr('string'),
  isOnSale: DS.attr('boolean'),
  image: DS.attr('string'),
  reviews: DS.hasMany('review', {async: true}),
  crafter: DS.belongsTo('contact', {async: true}),
  ratings: DS.attr(),
  rating: function () {
    return this.get('ratings').reduce(function (previousValue, rating) {
      return previousValue + rating;
    }, 0) / this.get('ratings').length;
  }.property('ratings.@each')
});

App.Review = DS.Model.extend({
  text: DS.attr('string'),
  reviewedAt: DS.attr('date'),
  product: DS.belongsTo('product')
});

App.Contact = DS.Model.extend({
  name: DS.attr('string'),
  avatar: DS.attr('string'),
  about: DS.attr('string'),
  products: DS.hasMany('product', {async: true})
});


// -----------------------------------------------------------------------------
// DATA ADAPTERS
// -------------

App.ApplicationAdapter = DS.FixtureAdapter.extend();

// To communicate with an HTTP server using JSON
//  App.ApplicationAdapter = DS.RESTAdapter.extend();


// -----------------------------------------------------------------------------
// FIXTURES
// --------


App.Product.FIXTURES = [
  {
    id: 1,
    title: 'Flint',
    price: 99,
    description: 'Flint is a hard, sedimentary cryptocrystalline form of the ' + 
                 'mineral quartz, categorized as a variety of chert.',
    isOnSale: true,
    image: './images/products/flint.png',
    reviews: [1, 2],
    crafter: 1,
    ratings: [2,1,3,3]
  },
  {
    id: 2,
    title: 'Kindling',
    price: 249,
    description: 'Easily..',
    isOnSale: false,
    image: './images/products/kindling.png',
    reviews: [],
    crafter: 1,
    ratings: [2,1,3,3]
  },
  {
    id: 3,
    title: 'Birch Bark Shaving',
    price: 118,
    description: 'Fresh and easily combustable',
    isOnSale: false,
    image: './images/products/birch.png',
    reviews: [],
    crafter: 2,
    ratings: [2,1,3,3]
  },
  {
    id: 4,
    title: 'Bow-drill',
    price: 207,
    description: 'The bow drill is an ancient tool. While it was usually used' +
                 'to make fire, it was also used for primitive woodworking and dentistry.',
    isOnSale: true,
    image: './images/products/bow-drill.png',
    reviews: [],
    crafter: 1,
    ratings: [1,3,3]
  },
  {
    id: 5,
    title: 'Matches',
    price: 81,
    description: 'One end is coated with a material that can be ignited by ' + 
                 'frictional heat generated by striking the match against a suitable surface.',
    isOnSale: true,
    image: './images/products/matches.png',
    reviews: [],
    crafter: 2
    ,
    ratings: [2,2,5]
  },
  {
    id: 6,
    title: 'Tinder',
    price: 116,
    description: 'Tinder is easily combustible material used to ignite fires by rudimentary methods.',
    isOnSale: true,
    image: './images/products/tinder.png',
    reviews: [],
    crafter: 1,
    ratings: [2,1,3]
  }
];

App.Review.FIXTURES = [
  {
    id: 1,
    product: 1,
    text: "Started a fire in no time!"
  },
  {
    id: 2,
    product: 1,
    text: "Not the brightest flame, but warm!"
  }
];

App.Contact.FIXTURES = [
  {
    id: 1,
    name: "Giamia",
    avatar: './images/contacts/giamia.png',
    about: 'Although Giamia came from a humble spark of lightning,' +
           ' he quickly grew to be a great craftsman, providing all' +  
           ' the warming instruments needed by those close to him.',
    products: [1, 2, 4, 6]
  },
  {
    id: 2,
    name: "Anostagia",
    avatar: './images/contacts/anostagia.png',
    about: 'Knowing there was a need for it, Anostagia drew on her' + 
           ' experience and spearheaded the Flint & Flame storefront.' + 
           ' In addition to coding the site, she also creates a few' + 
           ' products available in the store.',
    products: [3, 5]
  }
];
