angular.module('starter.services', [])
.factory('Instances', function () {
  // @todo: get the previous giaInstances from localStorage
  /**
   * Array of objects which define the various instances which will be used to access data
   * @type {Array}
   *   keys: 
   *     name: string,
   *     docId: string,
   *     debug: bool,
   *     memoField: string,
   *     pollInterval: number
   */
  var instances = [{
    name: 'default',
    docId: 'AKfycbwlT7SrhhUeCWIVWm68aCM6YFVVGAOMzSQ_EYK7B7UbS7wUb9fv',
    debug: true,
    memoField: 'hash',
    pollInterval: 100000
  }],

  /**
   * Update procedure for instance
   *
   * @param number index   The index of the instance to update
   * @param object newData The data to update it with
   *
   * @return none
   */
    update = function (index, newData) {
      if (instances[index]) {
        instances[index] = newData;
      }
    },

  /**
   * Create procedure for instance
   *
   * @param object newData The data to create it with
   *
   * @return none
   */
    create = function (newData) {
      instances.push(newData);
    },
  /**
   * Remove procedure for instance
   *
   * @param number index The index of the instance to remove
   *
   * @return none
   */
    remove = function (index) {
      if (instances[index]) {
        instances.splice(1, index);
      }
    };

  // Return the public portions of the factory
  return {
    all: function () {
      return instances;
    },
    add: create,
    change: update,
    del: remove
  };
});
