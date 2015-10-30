angular.module('starter.giadata', [])

// A service for accessing a G.I.A. API
.service('giaData', ['$http', '$interval',
  function($http, $interval) {
    return function(config) {
      // Make sure the config is an object
      config = {
        // Put into debug mode for latest gia output
        debug: config.debug || false,

        // This is the google script ID for the GIA API data adapter
        docId: config.docId || '',

        // @type string The querystring value to attach to the data URL
        qs: config.qs || '',

        // @type string The field in the data returned which tracks the update signature
        memoField: config.memoField || 'hash',

        // @type numeric The number of ms to wait between poll instances
        pollInterval: config.pollInterval || 100000,

        // @type function A callback routine to run when the data update is called
        onUpdate: config.onUpdate || null
      };

      // Private Properties
      // @type string A hash of the data to change when the data does
      var memo,

        // @type boolean the debug flag
        debug = config.debug,

        // Private Methods
        /**
         * return the full URL of the gia
         * @return string The full url for the gia socket
         */
        giaUrl = function() {
          return 'https://script.google.com/macros/s/' + config.docId + '/' +
            (debug ? 'dev' : 'exec') + '?prefix=JSON_CALLBACK' + config.qs;
        },

        // Append memo data to the query string
        // Also switch the data adapter to polling
        appendMemo = function(data) {
          // If the memo exists in the cachedData, set it to the local memo
          if (data[config.memoField]) {
            memo = data[config.memoField];
            // Append the memo to the querystring for the data source and switch to polling
            config.qs = '&action=poll&' + config.memoField + '=' + data[config.memoField];
          }
        },

        /**
         * Update the data services with the new data which has been retrieved
         * 
         * @param object newData The data returned from the gia data source
         * @return none
         */
        updateGiaData = function(newData) {
          if (newData && newData.hasOwnProperty(config.memoField)) {
            if (debug) {
              console.log('updateGiaData', newData);
            }

            // Update the locally stored memo
            appendMemo(newData);

            // Store the data locally
            if (window.localStorage) {
              window.localStorage.setItem(config.docId + '_data', JSON.stringify(newData));
            }

          }
          // If there's a callback routine for onUpdate, run it
          if (config.onUpdate instanceof Function) {
            config.onUpdate(newData);
          }
        },

        // @type function A safe JSON parse routine
        safeParse = function(parseData) {
          try {
            return JSON.parse(parseData);
          } catch (e) {
            return parseData;
          }
        },

        // @type function Get the local data store from the jsonp server
        getGiaData = function(callback) {
          $http.jsonp(giaUrl()).
          success(function(data) {
            if (debug) {
              console.log('success on getGiaData', data);
            }
            // If the data retrieved isn't just the memo, update it
            if (typeof data !== 'string') {
              updateGiaData(data);
            }
            if (typeof callback === 'function') {
              callback(data);
            }
          }).
          error(function(data, status) {
            if (debug) {
              console.log('error on getGiaData', data, status);
            }
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            updateGiaData({
              config: angular.extend({
                value: 'ERROR'
              }, {
                data: data
              }, {
                status: status
              })
            });
          });
        };
      // End Private Methods

      // function body:
      /**
       * Check the localStorage and load from that if possible (executes)
       * @return none
       */
      (function(localData) {
        // If there's a local store of information, assign it to the giadata 
        if (config.docId && window.localStorage) {
          // Get the localData as a parsed Object (This sometimes is a problem for IE)
          localData = safeParse(window.localStorage.getItem(config.docId + '_data'));
          if (localData && localData[config.memoField]) {
            if (debug) {
              console.log('localData has memo data');
            }
            updateGiaData(localData);
            // Start polling interval, if set
            if (config.pollInterval && typeof config.pollInterval === 'number') {
              $interval(getGiaData, config.pollInterval);
            }
          } else {
            if (debug) {
              console.log('no localData memo', localData);
            }
            updateGiaData(localData);
          }
        } else {
          if (debug) {
            console.log('no localDataDom');
          }
        }
      }());

      return {
        update: getGiaData
      };
    };
  }
]);