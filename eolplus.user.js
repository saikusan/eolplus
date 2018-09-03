// ==UserScript==
// @name         EOL+
// @namespace    EOL+
// @description  Mejoras y nuevas funciones para ElOtroLado.net.
// @author       Saikuro
// @copyright    2018+, Saikuro
// @version      0.0.1
// @license      MIT
// @homepageURL  https://github.com/saikusan/eolplus
// @supportURL   https://github.com/saikusan/eolplus/issues
// @updateURL    https://raw.githubusercontent.com/saikusan/eolplus/master/eolplus.meta.js
// @downloadURL  https://raw.githubusercontent.com/saikusan/eolplus/master/eolplus.user.js
// @icon         https://raw.githubusercontent.com/saikusan/eolplus/master/resources/img/eol.png
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.deleteValue
// @run-at       document-end
// @match        https://www.elotrolado.net/*
// ==/UserScript==

(function () {
    'use strict';

    class EOL {
        constructor() {
            this.init();
        }

        init() {
            // General info
            this.getData();

            // Debug
            console.log('User ID', this.user_id);
            console.log('Section ID', this.section_id);
            console.log('Thread ID', this.thread_id);
        }

        getData() {
            this.getUser();
            this.getSection();
            this.getThread();
        }

        getUser() {
            let user = this.performQuery('body');
            if (user) {
                this.user_id = user.dataset.user;
            } else {
                this.user_id = 0;
            }
        }

        getSection() {
            let section = this.performQuery('input[name="fid[]"]');
            if (section) {
                this.section_id = section.value;
            } else {
                this.section_id = 0;
            }
        }

        getThread() {
            let thread = this.performQuery('input[name="t"]');
            if (thread) {
                this.thread_id = thread.value;
            } else {
                this.thread_id = 0;
            }
        }

        performQuery(query, all = false) {
            let node = null;
            if (all) {
                node = document.querySelectorAll(query);
            } else {
                node = document.querySelector(query);
            }
            return node;
        }
    }

    var init = new EOL();
})();
