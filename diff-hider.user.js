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
semver = "0.0.1";
function gmGet(val) {
  return GM_getValue(val);
}
function gmSet(val, contents) {
  GM_setValue(val, contents);
}
function gmList() {
  return GM_listValues();
}
function gmDelete(val) {
  GM_deleteValue(val);
}
(function() {
  var hideDiffs, isHidden, isSettingsURL, patterns, showSettings, wildcard2regex;

  wildcard2regex = function(wildcard) {
    return new RegExp("^" + (wildcard.split("*").join(".*")) + "$");
  };

  patterns = gmGet("wildcards");

  if (patterns == null) {
    patterns = ["*doc/*"];
  }

  isHidden = function(path) {
    var i, len, search;
    for (i = 0, len = patterns.length; i < len; i++) {
      search = patterns[i];
      if (wildcard2regex(search).test(path)) {
        return true;
      }
    }
    return false;
  };

  hideDiffs = function() {
    return $(".diff-file[data-blob-diff-path]").each(function() {
      var all, link, namespace, parsed, path, project, uid;
      parsed = $(this).data("blob-diff-path").match(/^\/([^\/]+)\/([^\/]+)\/blob\/([^\/]+)\/(.*)\/diff$/);
      if (!parsed) {
        return;
      }
      all = parsed[0], namespace = parsed[1], project = parsed[2], uid = parsed[3], path = parsed[4];
      if (!isHidden(path)) {
        return;
      }
      if ($(this).find(".diff-collapsed:visible").length > 0) {
        return console.log(path + " already hidden!");
      }
      link = $(this).find(".file-title a[href^='#diff-']");
      console.log(link[0]);
      return link.click();
    });
  };

  isSettingsURL = function(url) {
    return url.indexOf("codelenny.gitlab.io") > -1 || url.indexOf("gitlab-hidden-diff.codelenny.com") > -1;
  };

  showSettings = function() {
    var i, latest, len, pattern, ref, results, row;
    $("#notfound").hide();
    latest = $("#latestVersion").text();
    if (latest !== semver) {
      $("#version").show();
      $("#userVersion").text(semver);
    } else {
      $("#isfound").show();
    }
    ref = gmGet("wildcards");
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      pattern = ref[i];
      row = $("#template .row").clone();
      row.find("input").val(pattern);
      row.find(".form-group").addClass("is-filled");
      results.push($("form").prepend(row));
    }
    return results;
  };

  $(function() {
    if (isSettingsURL()) {
      return showSettings();
    } else {
      hideDiffs();
      return $("[data-target='div#diffs'], [data-action='diffs']").click(hideDiffs);
    }
  });

}).call(this);
