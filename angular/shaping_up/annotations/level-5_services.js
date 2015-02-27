/*\
 * -----------------------------------------------------------------------------
 * SERVICES 
 * ========
 *
 * Services give your Controller additional functionality, like...
 * - Fetching JSON data from a web service with      $http
 * - Logging messages to the JavaScript console with $log
 * - Filtering an array with                         $filter
 *
 * All built-in Services start with a $ sign
 *
\*/

/*\
 * -----------------------------------------------------------------------------
 * Introducing the $http Service
 * -----------------------------
 *
 * The $http Service is how we make an async request to a server...
\*/

// - By using $http as a function with an options object:
     $http({ method: 'GET', url: '/products.json' });

// - Or using one of the shortcut methods
     $http.get('/products.json', { apiKey: 'myApiKey' });

// - Both of these methods return a Promise with .success() and .error()

// - If we tell $http to fetch JSON, the result will be automatically decoded
//   into JavaScript objects and arrays


/*\
 * -----------------------------------------------------------------------------
 * How does a Controller use a Service like $http?
 * -----------------------------------------------
\*/

// Use this funky array syntax:                           ↙ ↙ ↙ <- ⇖
   app.controller('SomeController', [ '$http', function($http) { // ⇑
//                   The service name ⇗ ⇗ ⇗ becomes an argument -> ⇗  
   } ]);

// Specifying the different services our controller needs is called:
   Dependency Injection

// If we need more than one service:
   app.controller('SomeController', [ '$http', '$log', function($http, $log) {

   } ]);


/*\
 * =============================================================================
 * When Angular is Loaded Services are Registered
 * ----------------------------------------------
 *
 * When Angular loads it creates something called an 'Injector'
 *
 * When services loads they register themselves with the Injector as being
 * available libraries.
 *
 * When our application loads, it register our controller with the Injector
 * telling it that when it gets executed, it will need the $http and $log
 * services.
 * 
 * DEPENDENCY INJECTION: Inserting the services to the controller as arguments!!
 * Then when our page loads and the controller gets used, the Injector grabs the
 * services that the controller needs and passes them to it as arguments
 * DEPENDENCY INJECTION: Inserting the services to the controller as arguments!!
 * -----------------------------------------------------------------------------
 *                            DEPENDENCY INJECTION
 * -----------------------------------------------------------------------------
 *                               SomeController
 *                                    ↓ ⇑
 *                                    ↓ ⇑
 *                                  Injector
 *                               ⇗  ↗    ↖  ⇖
 *                             ⇗  ↗         ↖  ⇖
 *                           $http            $log
 * =============================================================================
\*/

(function() {
  var app = angular.module('store', [ 'store-products' ]);
  app.controller('StoreController', [ '$http', function($http) {
                   //                 ↗ ↗                 ↖ ↖
                  //               ↗ ↗                     ↖ ↖
                 //      StoreController                ...so $http gets
                //       needs the $http                  injected as an  
               //        service...                             argument   
              //           !!Now we can use it inside the controller!!
    var store = this;
    store.products = []; //     we need to initialize products to an empty array, 
    $http.get('/products.json').success(function(data) { //   since the page will
      store.products = data; //    ↗ ↗                     render before our data
    });  //        $htttp returns a Promise,             returns from our get req   
  }]);  //         so success() gets the data   
})();  //


/*\
 * -----------------------------------------------------------------------------
 * Additional $http functionality
 * ------------------------------
 *
 * In addition to get() requests, $http can post(), put(), delete()...
\*/

$http.post('/path/to/resource.json', { param: 'value' });

$http.delete('/path/to/resource.json');

// ...or any other HTTP method by using a config object:
$http({ method: 'OPTIONS', url: '/path/to/resource.json' });

$http({ method: 'PATCH',   url: '/path/to/resource.json' });

$http({ method: 'TRACE',   url: '/path/to/resource.json' });
