/*global store,jQuery*/
var dataLayer = dataLayer || [];
var output = output || {};
output.errors = output.errors || [];

window.btoa = window.btoa || function () {
  var object = typeof exports != 'undefined' ? exports : this; // #8: web workers
  var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

  function InvalidCharacterError(message) {
    this.message = message;
  }
  InvalidCharacterError.prototype = new Error;
  InvalidCharacterError.prototype.name = 'InvalidCharacterError';

  // encoder
  // [https://gist.github.com/999166] by [https://github.com/nignag]
  object.btoa || (
    object.btoa = function (input) {
      var str = String(input);
      for (
        // initialize result and counter
        var block, charCode, idx = 0, map = chars, output = '';
        // if the next str index does not exist:
        //   change the mapping table to "="
        //   check if d has no fractional digits
        str.charAt(idx | 0) || (map = '=', idx % 1);
        // "8 - idx % 1 * 8" generates the sequence 2, 4, 6, 8
        output += map.charAt(63 & block >> 8 - idx % 1 * 8)
        ) {
        charCode = str.charCodeAt(idx += 3/4);
        if (charCode > 0xFF) {
          throw new InvalidCharacterError("'btoa' failed: The string to be encoded contains characters outside of the Latin1 range.");
        }
        block = block << 8 | charCode;
      }
      return output;
    });
};

generatePushID = (function() {
  // Modeled after base64 web-safe chars, but ordered by ASCII.
  var PUSH_CHARS = "-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz";

  // Timestamp of last push, used to prevent local collisions if you push twice in one ms.
  var lastPushTime = 0;

  // We generate 72-bits of randomness which get turned into 12 characters and appended to the
  // timestamp to prevent collisions with other clients.  We store the last characters we
  // generated because in the event of a collision, we"ll use those same characters except
  // "incremented" by one.
  var lastRandChars = [];

  return function() {
    var now = new Date().getTime();
    var duplicateTime = (now === lastPushTime);
    lastPushTime = now;

    var timeStampChars = new Array(8);
    for (var i = 7; i >= 0; i--) {
      timeStampChars[i] = PUSH_CHARS.charAt(now % 64);
      // NOTE: Can"t use << here because javascript will convert to int and lose the upper bits.
      now = Math.floor(now / 64);
    }
    if (now !== 0) throw new Error("We should have converted the entire timestamp.");

    var id = timeStampChars.join("");

    if (!duplicateTime) {
      for (i = 0; i < 12; i++) {
        lastRandChars[i] = Math.floor(Math.random() * 64);
      }
    } else {
      // If the timestamp hasn"t changed since last push, use the same random number, except incremented by 1.
      for (i = 11; i >= 0 && lastRandChars[i] === 63; i--) {
        lastRandChars[i] = 0;
      }
      lastRandChars[i]++;
    }
    for (i = 0; i < 12; i++) {
      id += PUSH_CHARS.charAt(lastRandChars[i]);
    }
    if(id.length != 20) throw new Error("Length should be 20.");

    return id;
  };
})();

/* Copyright (c) 2010-2016 Marcus Westin */
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.store = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
"use strict";module.exports=function(){function e(){try{return o in n&&n[o]}catch(e){return!1}}var t,r={},n="undefined"!=typeof window?window:global,i=n.document,o="localStorage",a="script";if(r.disabled=!1,r.version="1.3.20",r.set=function(e,t){},r.get=function(e,t){},r.has=function(e){return void 0!==r.get(e)},r.remove=function(e){},r.clear=function(){},r.transact=function(e,t,n){null==n&&(n=t,t=null),null==t&&(t={});var i=r.get(e,t);n(i),r.set(e,i)},r.getAll=function(){},r.forEach=function(){},r.serialize=function(e){return JSON.stringify(e)},r.deserialize=function(e){if("string"==typeof e)try{return JSON.parse(e)}catch(t){return e||void 0}},e())t=n[o],r.set=function(e,n){return void 0===n?r.remove(e):(t.setItem(e,r.serialize(n)),n)},r.get=function(e,n){var i=r.deserialize(t.getItem(e));return void 0===i?n:i},r.remove=function(e){t.removeItem(e)},r.clear=function(){t.clear()},r.getAll=function(){var e={};return r.forEach(function(t,r){e[t]=r}),e},r.forEach=function(e){for(var n=0;n<t.length;n++){var i=t.key(n);e(i,r.get(i))}};else if(i&&i.documentElement.addBehavior){var c,u;try{u=new ActiveXObject("htmlfile"),u.open(),u.write("<"+a+">document.w=window</"+a+'><iframe src="/favicon.ico"></iframe>'),u.close(),c=u.w.frames[0].document,t=c.createElement("div")}catch(l){t=i.createElement("div"),c=i.body}var f=function(e){return function(){var n=Array.prototype.slice.call(arguments,0);n.unshift(t),c.appendChild(t),t.addBehavior("#default#userData"),t.load(o);var i=e.apply(r,n);return c.removeChild(t),i}},d=new RegExp("[!\"#$%&'()*+,/\\\\:;<=>?@[\\]^`{|}~]","g"),s=function(e){return e.replace(/^d/,"___$&").replace(d,"___")};r.set=f(function(e,t,n){return t=s(t),void 0===n?r.remove(t):(e.setAttribute(t,r.serialize(n)),e.save(o),n)}),r.get=f(function(e,t,n){t=s(t);var i=r.deserialize(e.getAttribute(t));return void 0===i?n:i}),r.remove=f(function(e,t){t=s(t),e.removeAttribute(t),e.save(o)}),r.clear=f(function(e){var t=e.XMLDocument.documentElement.attributes;e.load(o);for(var r=t.length-1;r>=0;r--)e.removeAttribute(t[r].name);e.save(o)}),r.getAll=function(e){var t={};return r.forEach(function(e,r){t[e]=r}),t},r.forEach=f(function(e,t){for(var n,i=e.XMLDocument.documentElement.attributes,o=0;n=i[o];++o)t(n.name,r.deserialize(e.getAttribute(n.name)))})}try{var v="__storejs__";r.set(v,v),r.get(v)!=v&&(r.disabled=!0),r.remove(v)}catch(l){r.disabled=!0}return r.enabled=!r.disabled,r}();
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[1])(1)
});

(function($) {
  var loggedInUser;
  $.fn.serializeObject = function() {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
      if (o[this.name] !== undefined) {
        if (!o[this.name].push) {
          o[this.name] = [o[this.name]];
        }
        o[this.name].push(this.value || '');
      } else {
        o[this.name] = this.value || '';
      }
    });
    return o;
  };

  // Init
  function init() {
    // Determine Logged In User
    loggedInUser = store.get("loggedInUser");
    if (typeof loggedInUser !== "undefined") {
      login(loggedInUser);
    } else {
      $("#loginForm").show();
    }
  }

  // Get USer ID
  function getUserId(username) {
    var userId;

    userId = "";
    for (var i = 0; i < 10; i++) {
      userId += username;
    }
    return btoa(userId).substring(5, 15);
  }

  // Login
  function login(loggedInUser) {
    var $loginForm;

    store.set("loggedInUser", loggedInUser);
    digitalData.userId = getUserId(loggedInUser);
    $loginForm = $("#loginForm");
    $loginForm.after("<span id=\"loggedInUser\" class=\"navbar-text navbar-right\">Logged in as: <strong>" + loggedInUser + "</strong></span>");
    $loginForm.hide();

    $("#loggedInUser").append(" <a id=\"logoutLink\" href=\"javascript:void(0);\">Logout</a>");
    $("#logoutLink").on("click", logout);
  }

  // Logout
  function logout() {
    store.remove("loggedInUser");
    $("#loggedInUser").remove();

    measure({event: "logout"});

    setTimeout(function() {
      location.reload();
    }, 500);
  }

  init();

  // Demo itself features
  $("#loginForm").on("submit", function(event) {
    var eventData;

    event.preventDefault();

    eventData = $(this).serializeObject();
    login(eventData.username);
    delete eventData.password;
    eventData.userId = getUserId(eventData.username);
    delete eventData.username;
    eventData.formId = "loginForm";
    eventData.event = "login";

    measure(eventData);
    this.reset();
  });

  $("#subscribeButton").on("click", function(event) {
    var eventData,
      $form;

    event.preventDefault();

    $form = $("#subscriptionForm");
    eventData = $form.serializeObject();
    eventData.userId = getUserId(eventData.email);

    eventData.formId = "subscriptionForm";
    eventData.event = "subscriptionSent";

    measure(eventData);
  });

  $("#leadForm").on("submit", function(event) {
    var eventData;

    event.preventDefault();

    eventData = $(this).serializeObject();
    eventData.userId = getUserId(eventData.contact);

    eventData.formId = "leadForm";
    eventData.event = "leadSent";

    measure(eventData);
    this.reset();
  });

  $("#contactForm").on("submit", function(event) {
    var eventData;

    event.preventDefault();

    eventData = $(this).serializeObject();
    eventData.formId = "contactForm";
    eventData.event = "contactSent";

    measure(eventData);
    this.reset();
  });

  $(".download").on("click", function(event) {
    var $target,
      linkHref,
      fileType;

    event.preventDefault();

    $target = $(event.target);
    linkHref = $target.attr("href");
    fileType = linkHref.split(".").pop().toUpperCase();

    measure({event: "fileDownload", fileName: linkHref, fileType: fileType});
    setTimeout(function() {
      window.location = linkHref;
    }, 500);
  });

  var $wizardStep1 = $("#wizardStep1");
  if (typeof $wizardStep1.get(0) !== "undefined") {
    $wizardStep1.bootstrapValidator({
      feedbackIcons: {
        valid: "glyphicon glyphicon-ok",
        invalid: "glyphicon glyphicon-remove",
        validating: "glyphicon glyphicon-refresh"
      },
      live: "disabled", // only validate submitted form
      fields: {
        // Validations configuration
        name: {
          validators: {
            notEmpty: {
              message: "The text is required and cannot be empty"
            },
            stringLength: {
              min: 6,
              max: 30,
              message: "The text must be more than 6 and less than 30 characters long"
            }
          }
        },
        email: {
          validators: {
            notEmpty: {
              message: "The email is required and cannot be empty"
            },
            emailAddress: {
              message: "The input is not a valid email address"
            }
          }
        }
      }
    })
      .on("error.validator.bv", function(e, data) {
        var value;
        switch (data.field) {
        default:
          value = data.element[0].value;
        }
        output.errors.push({
          fieldName: data.field,
          failedRule: data.validator,
          fieldValue: value
        });
      })
      .on("error.form.bv", function(event) {
        event.preventDefault();

        output.event = "validationFailed";
        measure(output);
        output.errors = [];
      })
      .on("success.form.bv", function(event) {
        var pushId;
        event.preventDefault();

        output = $(this).serializeObject();
        output.event = "wizardStep1Sent";
        output.formId = "Wizard";
        output.formStep = "1";

        measure(output);

        output.errors = [];
        $("#step1").hide();
        $("#step1tab").removeClass("active");
        $("#step2tab").addClass("active");
        $("#step2").show();
      });
  }

  $("#wizardStep2").on("submit", function(event) {
    var eventData;

    event.preventDefault();

    eventData = $(this).serializeObject();
    eventData.formId = "Wizard";
    eventData.event = "wizardStep2Sent";

    measure(eventData);

    $("#step2").hide();
    $("#step2tab").removeClass("active");
    $("#step3tab").addClass("active");
    $("#step3").show();
  });

  $("#wizardStep1 :input").change(function(event) {
    var $target;
    $target = $(event.target);
    measure({
      event: "inputChange",
      fieldName: $("label[for=" + $target.attr("id") + "]").text(),
      fieldValue: $target.val()
    });
  });

  $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
    measure({
      event: "tabClick",
      tabName: $(e.target).text().trim()
    });
  })

})(jQuery);