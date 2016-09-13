// ==UserScript==
// @name         GitLab Hidden Diff
// @namespace    http://ryanleonard.us/
// @version      0.000001
// @description  Hides diffs in merge requests according to user-defined wildcards
// @author       Ryan Leonard
// @match        http*://gitlab.com/*
// @match        http*://codelenny.github.io/*
// @match        http*://gitlab-hidden-diff.codelenny.com/*
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_listValues
// @grant GM_deleteValue
// @require      http://code.jquery.com/jquery-latest.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/bluebird/3.4.5/bluebird.min.js
// @updateURL    https://raw.githubusercontent.com/CodeLenny/gitlab-hidden-diff/master/diff-hider.meta.js
// @downloadURL  https://raw.githubusercontent.com/CodeLenny/gitlab-hidden-diff/master/diff-hider.user.js
// ==/UserScript==