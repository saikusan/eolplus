// ==UserScript==
// @name         EOL+
// @namespace    EOL+
// @description  Mejoras y nuevas funciones para ElOtroLado.net.
// @author       Saikuro
// @copyright    2018+, Saikuro
// @version      0.2.1
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

            // Features
            this.userPostsInSection();
            this.userPostsInThread();
            this.usersPostsInThread();
        }

        getData() {
            this.getUser();
            this.getSection();
            this.getThread();
        }

        userPostsInSection() {
            if (this.user_id && this.section_id && !this.thread_id) {
                let user_posts_url = 'https://www.elotrolado.net/search.php?author_id=' + this.user_id + '&fid[]=' + this.section_id;
                document.querySelector('.forum-actions .nogutter').insertAdjacentHTML("afterbegin", '<a title="Mis mensajes en el foro actual" href="' + user_posts_url + '" class="action-btn reply">Mis mensajes</a>');
            }
        }

        userPostsInThread() {
            if (this.user_id && this.thread_id) {
                let user_posts_url = '/search.php?author_id=' + this.user_id + '&t=' + this.thread_id;
                document.querySelector('.topic-actions .nogutter').insertAdjacentHTML("afterbegin", '<a title="Mis mensajes en el hilo" href="' + user_posts_url + '" class="action-btn reply">Mis mensajes</a>');
            }
        }

        usersPostsInThread() {
            if (this.thread_id) {
                let self = this;
                let posts = document.querySelectorAll('.post');
                posts.forEach(function (post, index) {
                    let author_url = new URL(post.querySelector('.author').getAttribute('href'), window.location.origin);
                    let author_id = author_url.searchParams.get('u');
                    let author_posts_url = '/search.php?author_id=' + author_id + '&t=' + self.thread_id;
                    post.querySelector('.about').insertAdjacentHTML("beforeend", '<div class="links"><b><a href="' + author_posts_url + '" target="_blank" title="Mensajes del usuario en el hilo actual">Mensajes</a></b></div>');
                });
            }
        }

        // Data
        getUser() {
            let user = document.querySelector('body');
            if (user) {
                this.user_id = user.dataset.user;
            } else {
                this.user_id = 0;
            }
        }

        getSection() {
            let section = document.querySelector('input[name="fid[]"]');
            if (section) {
                this.section_id = section.value;
            } else {
                this.section_id = 0;
            }
        }

        getThread() {
            let thread = document.querySelector('input[name="t"]');
            if (thread) {
                this.thread_id = thread.value;
            } else {
                this.thread_id = 0;
            }
        }

        // Helpers
        getSetting(name) {
            try {
                return localStorage.getItem(name);
            } catch (e) {
                return null;
            }
        }

        setSetting(name, value) {
            try {
                localStorage.setItem(name, value);
                return true;
            } catch (e) {
                console.log('Failed to set local storage item ' + name + ', ' + e + '.')
                return false;
            }
        }
    }

    var init = new EOL();
})();
