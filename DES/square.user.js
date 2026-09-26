// ==UserScript==
// @name         редизайн кетварчика
// @description  глобальный редизайн
// @license      MIT
// @author       dentaku
// @namespace    http://tampermonkey.net/
// @version      1.0
// @match        *://*.catwar.su/*
// @match        *://*.catwar.net/*
// @updateURL    https://github.com/dirtysystem/catscripts/raw/refs/heads/main/DES/square.user.js
// @downloadURL  https://github.com/dirtysystem/catscripts/raw/refs/heads/main/DES/square.user.js
// @run-at       document-idle
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';
    const customStyles = `
        .dead {
            opacity: 1 !important;
        }
        div[style*="sky"] {
            display: none;
        }
        body {
            overflow-y: scroll !important;
            scrollbar-color: rgba(128, 128, 128, 0.4) transparent !important;
        }
        #compact_info,
        #compact_actions {
            width: 360px !important;
        }
        #app.compact #compact_info,
        #app.compact #compact_actions,
        #app.compact .compact-side,
        #app.compact #compact_left {
            border: 2px solid var(--ds-primary) !important;
            border-radius: 0 !important;
        }
        #chat_float,
        #fightPanel {
            background-color: rgba(var(--ds-info-rgb), 1) !important;
            border: 2px solid var(--ds-primary) !important;
            border-radius: 0 !important;
            max-width: 360px !important;
        }
        #chat_float {
            max-height: 350px !important;
        }
        #fteams-table {
            background-color: rgba(var(--ds-info-rgb), 1) !important;
        }
        .game-topbar {
            background: rgba(var(--ds-info-rgb), 1) !important;
            border: 2px solid var(--ds-primary) !important;
        }
        .game-topbar-chars__menu {
            border: 2px solid var(--ds-primary) !important;
            border-radius: 0 !important;
            background: rgba(var(--ds-info-rgb, 255, 255, 255), 1) !important;
        }
        .view,
        .blog,
        .comment,
        .ui-select,
        .ls-msg-wrap,
        .ui-soft-box,
        .ui-btn,
        .site-quicknav,
        .ui-details,
        .ui-input,
        .tag_box,
        .top-bar,
        .view-comment,
        .profile-act__track,
        .chat-stage,
        .chat-composer,
        .chat-online-bar,
        .top-table-wrap,
        .settings-block,
        .design-settings__card,
        .setting-tab,
        .settings-nav,
        .settings-warning,
        .site-quicknav__chars-menu,
        .ghost-block,
        .rabbits-coupon-card,
        .text-preview-modal__page,
        .site-quicknav__btn,
        #blogs-reload,
        #mit,
        #notepad,
        #site_table,
        #text,
        #top_div,
        #info,
        #footer {
            border-radius: 4px !important;
            border: 1px groove #00000075 !important;
            border-style: solid !important;
        }
        .settings-nav-item {
            border-radius: 4px !important;
        }
        #relatives_block,
        #history_block,
        #parameters_skills_block,
        #buffde {
            border-radius: 5px !important;
        }
        .compact-info-panel {
            max-height: 349px !important;
        }
        .cat_tooltip,
        #error {
            background: rgba(var(--ds-info-rgb), 1) !important;
            border: 2px solid var(--ds-primary) !important;
            border-radius: 0 !important;
            color: var(--ds-info-text) !important; 
        }
        #error {
            z-index: 10001 !important;
            top: 10% !important;
        }
        .cat_tooltip a,
        .online {
            color: var(--ds-info-text) !important; 
        }
    `;

    if (typeof GM_addStyle !== 'undefined') {
        GM_addStyle(customStyles);
    } else {
        const styleSheet = document.createElement('style');
        styleSheet.textContent = customStyles;
        document.head.appendChild(styleSheet);
    }

    let isUpdatingChat = false;

    // чат
    function lockChatStyles(chat) {
        if (isUpdatingChat) return;
        isUpdatingChat = true;

        chat.style.setProperty('position', 'relative', 'important');
        chat.style.setProperty('top', '0px', 'important');
        chat.style.setProperty('left', '0px', 'important');
        chat.style.setProperty('right', 'auto', 'important');
        chat.style.setProperty('bottom', 'auto', 'important');
        chat.style.setProperty('inset', 'auto', 'important');
        chat.style.setProperty('transform', 'none', 'important');
        chat.style.setProperty('width', '100%', 'important');
        chat.style.setProperty('margin', '0 0 8px 0', 'important');
        chat.style.setProperty('box-sizing', 'border-box', 'important');

        if (!chat.classList.contains('minimized') && !chat.classList.contains('hide')) {
            chat.style.setProperty('height', '400px', 'important');
        }

        setTimeout(() => { isUpdatingChat = false; }, 20);
    }

    function preventDragging(elem) {
        const blockDrag = (e) => {
            const interactive = e.target.closest('button, input, a, svg, [role="button"], span, td, th, label, div[id*="btn"], div[class*="btn"]');
            if (interactive) {
                return;
            }
            if (e.clientY - elem.getBoundingClientRect().top < 40) {
                e.stopImmediatePropagation();
                e.preventDefault();
            }
        };
        elem.addEventListener('mousedown', blockDrag, true);
        elem.addEventListener('pointerdown', blockDrag, true);
        elem.addEventListener('touchstart', blockDrag, true);
    }

    // структура
    function setupLayout() {
        // для чата
        const chat = document.getElementById('chat_float');
        const infoWrap = document.getElementById('compact_info_wrap');
        const info = document.getElementById('compact_info');

        if (chat && infoWrap && info && chat.parentNode !== infoWrap) {
            infoWrap.insertBefore(chat, info);
            infoWrap.style.setProperty('width', '360px', 'important');
            infoWrap.style.setProperty('margin-top', '0px', 'important');
            infoWrap.style.setProperty('padding-top', '0px', 'important');

            lockChatStyles(chat);
            preventDragging(chat);

            const chatObserver = new MutationObserver(() => {
                if (!isUpdatingChat && (chat.style.position !== 'relative' || chat.style.top !== '0px')) {
                    lockChatStyles(chat);
                }
            });
            chatObserver.observe(chat, { attributes: true, attributeFilter: ['style'] });
        }

        return Boolean(chat && infoWrap && info);
    }

    if (!setupLayout()) {
        const initObserver = new MutationObserver(() => {
        if (setupLayout()) {
            initObserver.disconnect();
        }
});
initObserver.observe(document.body, { childList: true, subtree: true });
    }
})();
