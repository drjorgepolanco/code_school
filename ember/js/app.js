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

App.ProductsIndexController = Ember.ArrayController.extend({
  deals: function() {
    return this.filter(function(product) {
      return product.get('price') < 500;
    });
  }.property('@each.price')
});

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
  crafter: DS.belongsTo('contact', {async: true})
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
    description: 'Flint is...',
    isOnSale: true,
    image: './images/products/flint.png',
    reviews: [1, 2],
    crafter: 1
  },
  {
    id: 2,
    title: 'Kindling',
    price: 249,
    description: 'Easily..',
    isOnSale: false,
    image: './images/products/kindling.png',
    reviews: [],
    crafter: 1
  },
  {
    id: 3,
    title: 'Birch',
    price: 118,
    description: 'Birch is lorem ipsum color sit amet...',
    isOnSale: false,
    image: './images/products/birch.png',
    reviews: [],
    crafter: 2
  },
  {
    id: 4,
    title: 'Bow-drill',
    price: 207,
    description: 'The Bow-drill is the most awesome..',
    isOnSale: true,
    image: './images/products/bow-drill.png',
    reviews: [],
    crafter: 1
  },
  {
    id: 5,
    title: 'Matches',
    price: 81,
    description: 'Matches is lorem ipsum color sit amet...',
    isOnSale: true,
    image: './images/products/matches.png',
    reviews: [],
    crafter: 2
  },
  {
    id: 6,
    title: 'Tinder',
    price: 116,
    description: 'The Tinder really lorem the most awesome..',
    isOnSale: true,
    image: './images/products/tinder.png',
    reviews: [],
    crafter: 1
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
    about: "Lorem ipsum color sit amet",
    products: [1, 2, 4, 6]
  },
  {
    id: 2,
    name: "Anostagia",
    avatar: './images/contacts/anostagia.png',
    about: "Lorem ipsum color sit amet",
    products: [3, 5]
  }
];
