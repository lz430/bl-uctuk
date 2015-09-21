define(['modules/jquery-mozu'], function($) {
  if (!('localStorage' in window) || !('sessionStorage' in window)) {

    var Storage = function(type) {

      function setData(data) {
        data = JSON.stringify(data);
        if (type == 'session') {
          window.name = data;
        } else {
          $.cookie('localStorage', data, { path: '/', expires: 365 });
        }
      }

      function clearData() {
        if (type == 'session') {
          window.name = '';
        } else {
          $.cookie('localStorage', '', { path: '/', expires: 365 });
        }
      }

      function getData() {
        var data = type == 'session' ? window.name : $.cookie('localStorage');
        return data ? JSON.parse(data) : {};
      }


      // initialise if there's already data
      var data = getData();

      return {
        length: 0,
        clear: function() {
          data = {};
          this.length = 0;
          clearData();
        },
        getItem: function(key) {
          return data[key] === undefined ? null : data[key];
        },
        key: function(i) {
          // not perfect, but works
          var ctr = 0;
          for (var k in data) {
            if (ctr == i) return k;
            else ctr++;
          }
          return null;
        },
        removeItem: function(key) {
          delete data[key];
          this.length--;
          setData(data);
        },
        setItem: function(key, value) {
          data[key] = value + ''; // forces the value to a string
          this.length++;
          setData(data);
        }
      };
    };

    if (!('localStorage' in window)) window.localStorage = new Storage('local');
    if (!('sessionStorage' in window)) window.sessionStorage = new Storage('session');

  }
});