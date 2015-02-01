var App = Ember.Application.create({
  LOG_TRANSITIONS: true
});

App.Router.map(function() {
  this.route('credits');
  this.resource('products', function() {
    this.resource('product', { path: '/:title' });
  });
  this.resource('contacts', function() {
    this.resource('contact', { path: '/:name' });
  });
  
});


App.IndexController = Ember.Controller.extend({
  productsCount: 6,
  logo: './images/logo-small.png',
  time: function() {
    return (new Date()).toDateString()
  }.property()
});

App.ProductsRoute = Ember.Route.extend({
  model: function() {
    return App.PRODUCTS;
  }
});

App.ProductRoute = Ember.Route.extend({
  model: function(params) {
    console.log(params);
    return App.PRODUCTS.findBy('title', params.title);
  }
});

App.ContactsRoute = Ember.Route.extend({
  model: function() {
    return App.CONTACTS;
  }
});

App.ContactsIndexController = Ember.Controller.extend({
  contactName: "Jorge",
  avatar: "./images/contacts/adam.png",
  open: function() {
    if (new Date().getDay() === 0) {
      return "Closed";
    }
    else {
      return "Open";
    }
  }.property()
});


App.ContactRoute = Ember.Route.extend({
  model: function(params) {
    return App.CONTACTS.findBy('name', params.name);
  }
});

App.PRODUCTS = [
  {
    title: 'Flint',
    price: 99,
    description: 'Flint is...',
    isOnSale: true,
    image: './images/products/flint.png'
  },
  {
    title: 'Kindling',
    price: 249,
    description: 'Easily..',
    isOnSale: false,
    image: './images/products/kindling.png'
  }
];

App.CONTACTS = [
  {
    name: "Adam",
    avatar: './images/contacts/adam.png',
    about: "Lorem ipsum color sit amet"
  },
  {
    name: "Martin",
    avatar: './images/contacts/martin.png',
    about: "Lorem ipsum color sit amet"
  }
]