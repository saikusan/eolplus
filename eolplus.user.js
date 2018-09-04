// ==UserScript==
// @name         EOL+
// @namespace    EOL+
// @description  Mejoras y nuevas funciones para ElOtroLado.net.
// @author       Saikuro
// @copyright    2018+, Saikuro
// @version      0.4.0
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
            // C/V forums IDs
            this.cv_ids = ['212', '97', '164', '98', '99', '100'];

            // Settings
            this.loadSettings();

            // Start
            this.init();
        }

        init() {
            // General info
            this.getData();

            // Debug
            console.log('User ID', this.user_id);
            console.log('Section ID', this.section_id);
            console.log('Thread ID', this.thread_id);

            // Settings
            this.injectCSS();
            this.cvSettingsHtml();

            // Features
            this.userPostsInSection();
            this.userPostsInThread();
            this.usersPostsInThread();
            this.highlightCVThreads();
        }

        // Features
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
                   let about = post.querySelector('.about');
                    if (about) {
                        let author_url = new URL(post.querySelector('.author').getAttribute('href'), window.location.origin);
                        let author_id = author_url.searchParams.get('u');
                        let author_posts_url = '/search.php?author_id=' + author_id + '&t=' + self.thread_id;
                        about.insertAdjacentHTML("beforeend", '<div class="links"><b><a href="' + author_posts_url + '" target="_blank" title="Mensajes del usuario en el hilo actual">Mensajes</a></b></div>');
                    }
                });
            }
        }

        highlightCVThreads() {
            if (this.cv_ids.includes(this.section_id) && this.cv_highlights) {
                let self = this;
                let html = '<div class="cv-alert" style="position: absolute; right: 0; top: 0; bottom: 0; width: 80px; overflow: hidden;"><i class="fa fa-exclamation-circle" aria-hidden="true" style="color: #395a2f; font-size: 90px; line-height: 1; opacity: 0.15; transform: rotate(20deg); position: absolute; left: 25px; top: -28px;"></i></div>';
                let terms = this.cv_highlights.split(',');
                let threads = document.querySelectorAll('.topic');

                console.log('Buscando los siguientes términos', terms);

                threads.forEach(function (thread, index) {
                    terms.forEach(function (term, index) {
                        let title = thread.querySelector('.title').textContent;
                        if (title.toLowerCase().includes(term.toLowerCase())) {
                            thread.querySelector('.lastpost').style.zIndex = '2';
                            thread.style.backgroundColor = '#d1ecd1';
                            thread.insertAdjacentHTML("beforeend", html);
                        } else {
                            let alert = thread.querySelector('.cv-alert');
                            if (alert) {
                                thread.style.backgroundColor = '#eaf5ea';
                                thread.removeChild(alert);
                            }
                            if (self.cv_hide > 0) {
                                thread.style.display = 'none';
                            } else {
                                thread.style.display = 'block';
                            }
                        }
                    });
                });
            }
        }

        // HTML
        injectCSS() {
            let css = `<style>
                .cv-settings {
                    display: inline-block;
                    position: relative;
                    z-index: 250;
                    margin-top: 20px;
                    padding: 6px 9px;
                    background-color: #eaf5ea;
                }
                .cv-settings .help-block {
                    margin-bottom: 0;
                    color: #777;
                }
            </style>`;
            document.querySelector('head').insertAdjacentHTML("beforeend", css);
        }

        cvSettingsHtml() {
            if (this.cv_ids.includes(this.section_id)) {
                let self = this;
                let html = `<div class="cv-settings">
                    <label>Resaltar hilos con los siguientes términos</label>
                    <div class="input-group">
                        <input type="text" class="form-control" name="cv_highlights" placeholder="Términos" value="${this.cv_highlights ? this.cv_highlights : ''}">
                        <div class="input-group-btn">
                            <button class="btn btn-default" type="submit">Guardar</button>
                        </div>
                    </div>
                    <p class="help-block text-muted"><i>Separa cada término con una coma, p.e.: ps4,switch,xbox one,pokemon</i></p>
                    <div class="checkbox">
                        <label><input type="checkbox" name="cv_hide" value="" ${this.cv_hide > 0 ? 'checked' : ''}>Ocultar hilos que no coincidan con la búsqueda</label>
                    </div>
                </div>`;
                document.querySelector('.forum-actions').insertAdjacentHTML("beforeend", html);
                // Events
                document.querySelector('.cv-settings button').addEventListener('click', () => {
                    this.saveCVSettings();
                })
                document.querySelector('.cv-settings [name="cv_highlights"]').addEventListener('keyup', (e) => {
                    if (e.keyCode == 13) {
                        this.saveCVSettings();
                    }
                });
                document.querySelector('.cv-settings [name="cv_hide"]').addEventListener('click', (e) => {
                    if (this.setSetting('cv_hide', e.target.checked ? 1 : 0)) {
                        self.highlightCVThreads();
                    }
                })
            }
        }

        // Settings
        loadSettings() {
            this.cv_highlights = this.getSetting('cv_highlights');
            this.cv_hide = this.getSetting('cv_hide');

            console.log('Highlights', this.cv_highlights);
            console.log('Hide', this.cv_hide);
        }

        saveCVSettings() {
            let value = document.querySelector('[name="cv_highlights"]').value;
            if (this.setSetting('cv_highlights', value)) {
                this.highlightCVThreads();
            }
        }

        // Data
        getData() {
            this.getUser();
            this.getSection();
            this.getThread();
        }

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
                this.loadSettings();
                return true;
            } catch (e) {
                console.log('Failed to set local storage item ' + name + ', ' + e + '.')
                return false;
            }
        }
    }

    var init = new EOL();
})();
