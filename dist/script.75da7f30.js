// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"script.js":[function(require,module,exports) {
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

console.log("It works");
var endpoint = "./people.json";
var addButton = document.querySelector(".add-buttton");
var birthdayData = document.querySelector("tbody");
var select = document.querySelector('.select-by-month');
var input = document.querySelector('[name="filter"]');

function fetchBirthday() {
  return _fetchBirthday.apply(this, arguments);
}

function _fetchBirthday() {
  _fetchBirthday = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
    var response, data, destroyPopup, _destroyPopup, populateBirthday, generatedBirthday, peopleData, addPeople, addEditPopup, editAddPopup, popupBirthday, editPopup, deletedPopup, deletedData, initLocalStorage, updateLocalStorage, searchInput, selectForMonth;

    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _destroyPopup = function _destroyPopup3() {
              _destroyPopup = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(openPopup) {
                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                  while (1) {
                    switch (_context3.prev = _context3.next) {
                      case 0:
                        openPopup.classList.remove('open');
                        openPopup.remove();
                        openPopup = null;

                      case 3:
                      case "end":
                        return _context3.stop();
                    }
                  }
                }, _callee3);
              }));
              return _destroyPopup.apply(this, arguments);
            };

            destroyPopup = function _destroyPopup2(_x) {
              return _destroyPopup.apply(this, arguments);
            };

            _context4.next = 4;
            return fetch(endpoint);

          case 4:
            response = _context4.sent;
            _context4.next = 7;
            return response.json();

          case 7:
            data = _context4.sent;

            populateBirthday = function populateBirthday(people) {
              return people.map(function (person) {
                var daySuffix = function daySuffix(df) {
                  if (df > 3 && df < 21) return "th";

                  switch (df % 10) {
                    case 1:
                      return "st";

                    case 2:
                      return "nd";

                    case 3:
                      return "rd";

                    default:
                      return "th";
                  }
                };

                var calculateAge = function calculateAge(age) {
                  var msDate = Date.now() - age.getTime();
                  var ageDate = new Date(msDate);
                  return Math.abs(ageDate.getFullYear() - 1970) + 1;
                };

                var year = calculateAge(new Date(person.birthday));
                var date = new Date(person.birthday);
                var month = date.toLocaleString('default', {
                  month: 'long'
                });
                var birthDay = date.getDate(); // const dateDiffInDays = function(date1, date2) {
                //     dt1 = new Date(date1);
                //     dt2 = new Date(date2);
                //     return Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate()) ) /(1000 * 60 * 60 * 24));
                // }
                // const totalDays = dateDiffInDays(new Date(person.birthDays));
                // const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
                // const firstDate = new Date(date.getDate());
                // const secondDate = new Date();
                // const diffDays = Math.round(Math.abs((firstDate - secondDate) / oneDay));
                // const firstDate = new Date(person.birthday);
                // const secondDate = new Date();
                // const difference = firstDate.getTime() - secondDate.getTime();
                // var diffDays = Math.ceil(difference / (1000 * 3600 * 24));

                function diff_days(dt2, dt1) {
                  var diff = (dt2.getTime() - dt1.getTime()) / 1000;
                  diff /= 60 * 60 * 24;
                  return Math.abs(Math.round(diff));
                }

                dt1 = new Date();
                dt2 = new Date(person.birthday);
                var diffDays = diff_days(dt1, dt2);
                return "\n                <tr data-id=\"".concat(person.id, "\" class=\"table-row\">\n                    <td class=\"picture\"><img src=\"").concat(person.picture, "\" alt=\"").concat(person.firstName, "\"></td>\n                    <td class=\"lastname\" data-value=\"").concat(person.lastName, "\">").concat(person.lastName, "</td>\n                    <td class=\"firstname\" data-value=\"").concat(person.firstName, "\">").concat(person.firstName, "</td>\n                    <td class=\"birthday\">Turns ").concat(year, " on the ").concat(birthDay, "<sup>").concat(daySuffix(birthDay), "</sup> of ").concat(month, "</td>\n                    <td class=\"leftDay\">Days ").concat(diffDays, "<br></td>\n                    <td class=\"edit-btn\">\n                        <button class=\"edit\" value=\"").concat(person.id, "\">\n                            <img class=\"edit\" src=\"./images/edit_icon.png\" alt=\"").concat(person.firstName, "\"> \n                        </button>\n                    </td>\n                    <td class=\"delete-btn\">\n                        <button class=\"delete\" value=\"").concat(person.id, "\">\n                            <img class=\"delete\" src=\"./images/delete_icon.png\" alt=\"").concat(person.firstName, "\">  \n                        </button>\n                    </td>\n                </tr>\n        ");
              }).join('');
            };

            generatedBirthday = function generatedBirthday() {
              var html = populateBirthday(data);
              birthdayData.innerHTML = html;
            };

            generatedBirthday();
            peopleData = [];

            addPeople = function addPeople(e) {
              e.preventDefault();
              console.log(e);
              var el = e.target;
              var newPeople = {
                picture: el.picture.value,
                lastName: el.lastName.value,
                firstName: el.firstName.value,
                birthday: el.birthday.getDay(),
                id: Date.now()
              };
              peopleData.push(newPeople);
              console.log(newPeople);
              el.reset();
              birthdayData.dispatchEvent(new CustomEvent('updatedBirthday'));
            };

            addEditPopup = function addEditPopup(e) {
              if (e.target.closest('button.add-buttton')) {
                console.log("It opens");
                editAddPopup(e);
              }
            };

            birthdayData.addEventListener('click', addEditPopup); // open add modal 

            editAddPopup = function editAddPopup() {
              var addFormPopup = document.createElement('form');
              addFormPopup.classList.add('popup');
              addFormPopup.classList.add('open');
              addFormPopup.insertAdjacentHTML('afterbegin', "\n        <fieldset> \n            <div class=\"form-group\">\n                <label for=\"addLastname\" class=\"lastname-label\" value=\"".concat(addFormPopup.firstName, "\">Lastname</label>\n                <input type=\"text\" class=\"form-control\" id=\"addLastname\">\n            </div>\n            <div class=\"form-group\">\n                <label for=\"addFirstname\" class=\"firstname-label\" value=\"").concat(addFormPopup.lastName, "\">Firstname</label>\n                <input type=\"text\" class=\"form-control\"  id=\"addFirstname\" aria-describedby=\"firstnameHelp\">\n            </div>\n            <div class=\"form-group\">\n                <label for=\"addBirthday\" class=\"birthday-label\">Birthday</label>\n                <input type=\"date\" class=\"form-control\" id=\"addBirthday\">\n            </div>\n            <div class=\"form-group\">\n                <label for=\"addAvatar\" class=\"avatar\" value=\"").concat(addFormPopup.picture, "\">Picture(Url)</label>\n                <input type=\"url\" class=\"form-control\" id=\"addAvatar\">\n            </div>\n            <div class=\"d-flex flex-row\">\n                <button type=\"submit\" class=\"submit-btn\">Save</button>\n                <button class=\"close-btn\" name=\"close\" type=\"button\">Close</button>\n            </div>\n        </fiedset>\n        ")); // submit form 

              addFormPopup.addEventListener('submit', function (e) {
                e.preventDefault();
                var submitAddForm = e.target;
                submitAddForm.lastName = addFormPopup.addLastname.value;
                submitAddForm.firstName = addFormPopup.addFirstname.value; //submitAddForm.birthday = addFormPopup.addBirthday.value;

                submitAddForm.picture = addFormPopup.addAvatar.value;
                var newPeople = {
                  picture: submitAddForm.picture,
                  lastName: submitAddForm.lastName,
                  firstName: submitAddForm.firstName,
                  // birthday: submitAddForm.birthday,
                  id: Date.now()
                };
                data.push(newPeople);
                console.log(data);
                generatedBirthday(newPeople);
                destroyPopup(addFormPopup);
                updateLocalStorage(); // birthdayData.dispatchEvent(new CustomEvent('updatedBirthday'));
              }, {
                once: true
              }); // open form

              document.body.appendChild(addFormPopup);
              addFormPopup.classList.add('open'); // close form

              if (addFormPopup.close) {
                var closeAddBtn = addFormPopup.close;
                closeAddBtn.addEventListener('click', function (e) {
                  destroyPopup(addFormPopup);
                  console.log('It is canceled');
                }, {
                  once: true
                });
              }
            };

            addButton.addEventListener("click", editAddPopup); // editting popup

            popupBirthday = function popupBirthday(e) {
              if (e.target.closest('button.edit')) {
                var tableRow = e.target.closest('tr');
                console.log(tableRow);
                var id = tableRow.dataset.id;
                editPopup(id);
              }
            }; // open modal 


            editPopup = function editPopup(editId) {
              var editIdPopup = data.find(function (person) {
                return person.id === editId || person.id == editId;
              });
              return new Promise( /*#__PURE__*/function () {
                var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(resolve) {
                  var formPopup, closeBtn;
                  return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                      switch (_context.prev = _context.next) {
                        case 0:
                          formPopup = document.createElement('form');
                          formPopup.classList.add('popup');
                          formPopup.classList.add('open');
                          console.log(editIdPopup.lastName);
                          formPopup.insertAdjacentHTML('afterbegin', "\n                <fieldset> \n                        <div class=\"form-group\">\n                            <label for=\"lastname\">Lastname</label>\n                            <input type=\"text\" class=\"form-control\" id=\"lastnameId\" value=\"".concat(editIdPopup.lastName, "\">\n                        </div>\n                        <div class=\"form-group\">\n                            <label for=\"firstname\">Firstname</label>\n                            <input type=\"text\" class=\"form-control\" id=\"firstnameId\" aria-describedby=\"firstnameHelp\" value=\"").concat(editIdPopup.firstName, "\">\n                        </div>\n                        <div class=\"form-group\">\n                            <label for=\"birthday\">Birthday</label>\n                            <input type=\"date\" class=\"form-control\" id=\"birthdayId\" name=\"birthday-date\">\n                        </div>\n                        <div class=\"form-group\">\n                            <label for=\"url\">Your avatar image</label>\n                            <input type=\"url\" class=\"form-control\" id=\"urlId\" value=\"").concat(editIdPopup.picture, "\">\n                        </div>\n                        <div class=\"d-flex flex-row\">\n                            <button type=\"submit\" class=\"submitbtn\" name=\"submit\">Submit</button>\n                            <button class=\"close-btn\" name=\"close\" type=\"button\">Close</button>\n                        </div>\n            \n                </fiedset>\n            ")); // submit form 

                          formPopup.addEventListener('submit', function (e) {
                            e.preventDefault();
                            console.log(e.target);
                            editIdPopup.lastName = formPopup.lastnameId.value;
                            editIdPopup.firstName = formPopup.firstnameId.value;
                            editIdPopup.birthday = formPopup.birthdayId.value;
                            editIdPopup.picture = formPopup.urlId.value;
                            generatedBirthday(editIdPopup); // resolve(e.target.displayList(editIdPopup));

                            destroyPopup(formPopup); // birthdayData.dispatchEvent(new CustomEvent('updatedBirthday'));

                            updateLocalStorage();
                          }, {
                            once: true
                          }); // open form

                          document.body.appendChild(formPopup);
                          formPopup.classList.add('open'); // await wait(50);
                          // close form

                          if (formPopup.close) {
                            closeBtn = formPopup.close;
                            closeBtn.addEventListener('click', function (e) {
                              destroyPopup(formPopup);
                              console.log('It is canceled');
                            }, {
                              once: true
                            });
                          }

                        case 9:
                        case "end":
                          return _context.stop();
                      }
                    }
                  }, _callee);
                }));

                return function (_x2) {
                  return _ref.apply(this, arguments);
                };
              }());
            }; // Confirm delete


            deletedPopup = function deletedPopup(e) {
              var deletedTr = e.target.closest('button.delete');

              if (deletedTr) {
                var tr = e.target.closest('tr');
                var deletedFromId = tr.dataset.id;
                deletedData(deletedFromId);
              }
            };

            deletedData = function deletedData(deletedId) {
              var deletePeople = data.find(function (person) {
                return person.id !== deletedId || person.id != deletedId;
              });
              console.log(data);
              return new Promise( /*#__PURE__*/function () {
                var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(resolve) {
                  var openDiv, confirmDelete;
                  return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                      switch (_context2.prev = _context2.next) {
                        case 0:
                          openDiv = document.createElement('article');
                          openDiv.classList.add('open');
                          openDiv.insertAdjacentHTML('afterbegin', "\n                <article class=\"delete-confirm\" data-id=\"".concat(openDiv.id, "\">\n                    <p>Are you sure you want to delete it!</p>\n                    <button class=\"delete-button\" name=\"deleteBtn\" type=\"button\" data-id=\"").concat(openDiv.id, "\">Delete</button>\n                    <button class=\"cancel-button cancel\" name=\"cancel\" type=\"button\" data-id=\"").concat(openDiv.id, "\">Cancel</button>\n                </article>\n            "));

                          confirmDelete = function confirmDelete(e) {
                            var cancelBtn = e.target.closest('button.cancel-button');

                            if (cancelBtn) {
                              console.log("You cancel it");
                              destroyPopup(openDiv);
                            }
                          };

                          openDiv.addEventListener('click', function () {
                            var deletePersonBirthday = data.filter(function (person) {
                              return person.id != deletedId;
                            });
                            var deleteConfirm = document.querySelector("button.delete-button");

                            if (deleteConfirm) {
                              data = deletePersonBirthday;
                              generatedBirthday(data);
                              destroyPopup(openDiv);
                              console.log("You delete it"); // birthdayData.dispatchEvent(new CustomEvent('updatedBirthday'));

                              updateLocalStorage();
                            }
                          });
                          openDiv.addEventListener('click', confirmDelete);
                          document.body.appendChild(openDiv); //await wait(20);

                          openDiv.classList.add('popup');

                        case 8:
                        case "end":
                          return _context2.stop();
                      }
                    }
                  }, _callee2);
                }));

                return function (_x3) {
                  return _ref2.apply(this, arguments);
                };
              }());
            };

            console.log(data);

            initLocalStorage = function initLocalStorage() {
              var stringForm = localStorage.getItem('data');
              var listItems = JSON.parse(stringForm);

              if (listItems) {
                peopleData = listItems;
                console.log(peopleData);
              } else {
                peopleData = data;
              }

              generatedBirthday(peopleData);
              updateLocalStorage();
            };

            updateLocalStorage = function updateLocalStorage() {
              localStorage.setItem('data', JSON.stringify(data));
            }; // Filter input


            searchInput = function searchInput(e) {
              var filterInput = input.value;
              console.log(filterInput);
              var filterBirthday = data.filter(function (data) {
                return data.lastName.toLowerCase().includes(filterInput.toLowerCase());
              });
              var filterFromHtml = populateBirthday(filterBirthday);
              birthdayData.innerHTML = filterFromHtml;
            }; // filter select


            selectForMonth = function selectForMonth(e) {
              var filterSelect = select.value; // const date = new Date(person.birthday);
              // const month = date.toLocaleString('default', { month: 'long' });

              console.log(filterSelect);
              var filterBirthdayByMonth = data.filter(function (data) {
                return data[new Date(data.birthday).toLocaleString('default', {
                  month: 'long'
                }).toLowerCase().includes(filterSelect.toLowerCase())] === data.filterSelect;
              });
              var filterBirthdayByMonthHtml = generatedBirthday(filterBirthdayByMonth);
              birthdayData.innerHTML = filterBirthdayByMonthHtml;
            };

            select.addEventListener('change', selectForMonth);
            input.addEventListener('input', searchInput);
            birthdayData.addEventListener('submit', addPeople);
            window.addEventListener('click', popupBirthday);
            window.addEventListener('click', deletedPopup); // birthdayData.addEventListener('updatedBirthday', updateLocalStorage);

            initLocalStorage();

          case 32:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));
  return _fetchBirthday.apply(this, arguments);
}

fetchBirthday();
},{}],"../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "51006" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","script.js"], null)
//# sourceMappingURL=/script.75da7f30.js.map