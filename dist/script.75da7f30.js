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
const endpoint = "https://gist.githubusercontent.com/Pinois/e1c72b75917985dc77f5c808e876b67f/raw/b17e08696906abeaac8bc260f57738eaa3f6abb1/birthdayPeople.json";
const addButton = document.querySelector(".add-buttton");
let birthdayData = document.querySelector("div.main-content");
const select = document.querySelector(".select-by-month");
const input = document.querySelector('[name="filter"]');

async function fetchBirthday() {
  const response = await fetch(endpoint);
  let data = await response.json();

  async function destroyPopup(openPopup) {
    openPopup.classList.remove("open");
    openPopup.remove();
    openPopup = null;
  }

  const populateBirthday = people => {
    return people.map(person => {
      const daySuffix = function (df) {
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

      const calculateAge = age => {
        const msDate = Date.now() - age.getTime();
        const ageDate = new Date(msDate);
        return Math.abs(ageDate.getFullYear() - 1970) + 1;
      };

      const year = calculateAge(new Date(person.birthday));
      let date = new Date(person.birthday);
      let month = date.toLocaleString("default", {
        month: "long"
      });
      const birthDay = date.getDate();
      const today = new Date();
      const birthdayDate = new Date(person.birthday);

      if (today > birthdayDate) {
        birthdayDate.setFullYear(today.getFullYear() + 1);
      }

      const diff = Math.floor((birthdayDate - today) / (1000 * 60 * 60 * 24));
      return `
            <nav data-id="${person.id}" class="table-row">
              <img src="${person.picture}" alt="${person.firstName}" class="picture">
              <ul>
                <li class="lastname" data-value="${person.lastName}">${person.lastName} 
                <li class="firstname" data-value="${person.firstName}">${person.firstName}</li>
              </ul>
              
                <span class="birthday">Turns <b>${year}</b> on the ${birthDay}
                <sup>${daySuffix(birthDay)}</sup> 
                  of ${month}</span>
              </li>
              <li class="leftDay">In ${diff} days<br></li>
              <div class="buttons-wrapper">
                <li class="edit-btn">
                  <button class="edit" value="${person.id}">
                    <i class="ri-edit-box-fill icons"></i> 
                  </button>
                </li>
                <li class="delete-btn">
                  <button class="delete" value="${person.id}">
                    <i class="ri-delete-bin-line icons"></i>
                  </button>
                </li>
              </div>
            </nav>
        `;
    }).join("");
  };

  const generatedBirthday = () => {
    const html = populateBirthday(data);
    birthdayData.innerHTML = html;
  };

  generatedBirthday();
  let peopleData = [];

  const addPeople = e => {
    e.preventDefault();
    const el = e.target;
    const newPeople = {
      picture: el.picture.value,
      lastName: el.lastName.value,
      firstName: el.firstName.value,
      birthday: el.birthday.getDay(),
      id: Date.now()
    };
    peopleData.push(newPeople);
    el.reset();
    birthdayData.dispatchEvent(new CustomEvent("updatedBirthday"));
  };

  const addEditPopup = e => {
    if (e.target.closest("button.add-buttton")) {
      editAddPopup(e);
    }
  };

  birthdayData.addEventListener("click", addEditPopup); // open add modal

  const editAddPopup = () => {
    const addFormPopup = document.createElement("form");
    addFormPopup.classList.add("popup");
    addFormPopup.classList.add("open");
    addFormPopup.insertAdjacentHTML("afterbegin", `
            <fieldset> 
                <div class="form-group">
                    <label for="addLastname" class="lastname-label" >Lastname</label>
                    <input type="text" class="form-control" name="lastName" id="addLastname">
                </div>
                <div class="form-group">
                    <label for="addFirstname" class="firstname-label">Firstname</label>
                    <input type="text" class="form-control"  name="firstName" id="addFirstname" aria-describedby="firstnameHelp">
                </div>
                <div class="form-group">
                    <label for="addBirthday" class="birthday-label">Birthday</label>
                    <input type="date" class="form-control" name="birthday" id="addBirthday">
                </div>
                <div class="form-group">
                    <label for="addAvatar" class="avatar">Picture(Url)</label>
                    <input type="url" class="form-control" name="picture" id="addAvatar">
                </div>
                <div class="d-flex flex-row">
                    <button type="submit" class="submit-btn">Save</button>
                    <button class="close-btn" name="close" type="button">Close</button>
                </div>
            </fiedset>
        `); // submit form

    addFormPopup.addEventListener("submit", e => {
      e.preventDefault();
      const submitAddForm = e.target; // submitAddForm.lastName = addFormPopup.addLastname.value;
      // submitAddForm.firstName = addFormPopup.addFirstname.value;
      // //submitAddForm.birthday = addFormPopup.addBirthday.value;
      // submitAddForm.picture = addFormPopup.addAvatar.value;

      const newPeople = {
        picture: submitAddForm.picture.value,
        lastName: submitAddForm.lastName.value,
        firstName: submitAddForm.firstName.value,
        birthday: submitAddForm.birthday.value,
        id: Date.now()
      };
      data.push(newPeople);
      generatedBirthday(data);
      destroyPopup(addFormPopup);
      updateLocalStorage();
    }, {
      once: true
    }); // open form

    document.body.appendChild(addFormPopup);
    addFormPopup.classList.add("open"); // close form

    if (addFormPopup.close) {
      const closeAddBtn = addFormPopup.close;
      closeAddBtn.addEventListener("click", e => {
        destroyPopup(addFormPopup);
      }, {
        once: true
      });
    }
  };

  addButton.addEventListener("click", editAddPopup); // editting popup

  const popupBirthday = e => {
    if (e.target.closest("button.edit")) {
      const tableRow = e.target.closest("nav");
      const id = tableRow.dataset.id;
      editPopup(id);
    }
  }; // open modal


  const editPopup = editId => {
    const editIdPopup = data.find(person => person.id === editId || person.id == editId);
    return new Promise(async function (resolve) {
      const formPopup = document.createElement("form");
      formPopup.classList.add("popup");
      formPopup.classList.add("open");
      formPopup.insertAdjacentHTML("afterbegin", `
                <fieldset> 
                    <div class="form-group">
                        <label for="lastname">Lastname</label>
                        <input type="text" class="form-control" id="lastnameId" value="${editIdPopup.lastName}">
                    </div>
                    <div class="form-group">
                        <label for="firstname">Firstname</label>
                        <input type="text" class="form-control" id="firstnameId" aria-describedby="firstnameHelp" value="${editIdPopup.firstName}">
                    </div>
                    <div class="form-group">
                        <label for="birthday">Birthday</label>
                        <input type="date" class="form-control" id="birthdayId" name="birthday-date">
                    </div>
                    <div class="form-group">
                        <label for="url">Your avatar image</label>
                        <input type="url" class="form-control" id="urlId" value="${editIdPopup.picture}">
                    </div>
                    <div class="d-flex flex-row">
                        <button type="submit" class="submitbtn" name="submit">Submit</button>
                        <button class="close-btn" name="close" type="button">Close</button>
                    </div>
                </fiedset>
            `); // submit form

      formPopup.addEventListener("submit", e => {
        e.preventDefault();
        editIdPopup.lastName = formPopup.lastnameId.value;
        editIdPopup.firstName = formPopup.firstnameId.value;
        editIdPopup.birthday = formPopup.birthdayId.value;
        editIdPopup.picture = formPopup.urlId.value;
        generatedBirthday(editIdPopup); // resolve(e.target.displayList(editIdPopup));

        destroyPopup(formPopup); // birthdayData.dispatchEvent(new CustomEvent('updatedBirthday'));
        // updateLocalStorage();
      }, {
        once: true
      }); // open form

      document.body.appendChild(formPopup);
      formPopup.classList.add("open"); // await wait(50);
      // close form

      if (formPopup.close) {
        const closeBtn = formPopup.close;
        closeBtn.addEventListener("click", e => {
          destroyPopup(formPopup);
        }, {
          once: true
        });
      }
    });
  }; // Confirm delete


  const deletedPopup = e => {
    const deletedTr = e.target.closest("button.delete");

    if (deletedTr) {
      const tr = e.target.closest("nav");
      const deletedFromId = tr.dataset.id;
      deletedData(deletedFromId);
    }
  };

  const deletedData = deletedId => {
    const deletePeople = data.find(person => person.id !== deletedId || person.id != deletedId);
    return new Promise(async function (resolve) {
      const openDiv = document.createElement("article");
      openDiv.classList.add("open");
      openDiv.insertAdjacentHTML("afterbegin", `
                <article class="delete-confirm" data-id="${openDiv.id}">
                    <p>Are you sure you want to delete it!</p>
                    <button class="delete-button" name="deleteBtn" type="button" data-id="${openDiv.id}">Delete</button>
                    <button class="cancel-button cancel" name="cancel" type="button" data-id="${openDiv.id}">Cancel</button>
                </article>
            `);

      const confirmDelete = e => {
        const cancelBtn = e.target.closest("button.cancel-button");

        if (cancelBtn) {
          destroyPopup(openDiv);
        }
      };

      openDiv.addEventListener("click", () => {
        const deletePersonBirthday = data.filter(person => person.id != deletedId);
        const deleteConfirm = document.querySelector("button.delete-button");

        if (deleteConfirm) {
          data = deletePersonBirthday;
          generatedBirthday(data);
          destroyPopup(openDiv); // birthdayData.dispatchEvent(new CustomEvent('updatedBirthday'));

          updateLocalStorage();
        }
      });
      openDiv.addEventListener("click", confirmDelete);
      document.body.appendChild(openDiv); //await wait(20);

      openDiv.classList.add("popup");
    });
  };

  const initLocalStorage = () => {
    const stringForm = localStorage.getItem("data");
    const listItems = JSON.parse(stringForm);

    if (listItems) {
      peopleData = listItems;
    } else {
      peopleData = data;
    }

    generatedBirthday(peopleData);
    updateLocalStorage();
  };

  const updateLocalStorage = () => {
    localStorage.setItem("data", JSON.stringify(data));
  }; // Filter input


  const searchInput = e => {
    const filterInput = input.value;
    const filterBirthday = data.filter(data => data.lastName.toLowerCase().includes(filterInput.toLowerCase()));
    const filterFromHtml = populateBirthday(filterBirthday);
    birthdayData.innerHTML = filterFromHtml;

    if (filterBirthday.length < 0) {
      console.log("Nobody matches that filter options.");
      birthdayData = `<p><i>Nobody matches that filter options.</p>`;
    }
  };

  select.addEventListener("change", function (e) {
    let filteredArr = data.filter(item => {
      let date = new Date(item.birthday);
      let monthName = date.toLocaleString("default", {
        month: "long"
      });
      return monthName == e.target.value;
    });
    let month = populateBirthday(filteredArr);
    birthdayData.innerHTML = month;
  }); // select.addEventListener("change", selectForMonth);

  input.addEventListener("input", searchInput);
  birthdayData.addEventListener("submit", addPeople);
  window.addEventListener("click", popupBirthday);
  window.addEventListener("click", deletedPopup); // birthdayData.addEventListener('updatedBirthday', updateLocalStorage);

  initLocalStorage();
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "62218" + '/');

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