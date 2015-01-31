var App = Ember.Application.create({
  LOG_TRANSITIONS: true
});

App.Router.map(function() {
  this.route('about');
  this.route('credits');
  this.resource('products');
  this.resource('contacts');
});


App.IndexController = Ember.Controller.extend({
  productsCount: 6,
  logo: './images/logo.png',
  time: function() {
    return (new Date()).toDateString()
  }.property(),
  open: function() {
    if (new Date().getDay() === 0) {
      return "Sorry, sundays closed.";
    }
    else {
      return "Now Open!!";
    }
  }.property()
});

App.AboutController = Ember.Controller.extend({
  contactName: "Jorge",
  avatar: "./images/contacts/adam.png"
});

App.ProductsRoute = Ember.Route.extend({
  model: function() {
    return App.PRODUCTS;
  }
});

App.ContactsRoute = Ember.Route.extend({
  model: function() {
    return App.CONTACTS;
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
    image: './images/contacts/adam.png',
    about: "Lorem ipsum color sit amet"
  },
  {
    name: "Martin",
    image: './images/contacts/martin.png',
    about: "Lorem ipsum color sit amet"
  },
  {
    name: "Patty",
    image: './images/contacts/patty.png',
    about: "Lorem ipsum color sit amet"
  }
]