Promise = require "bluebird"
fs = Promise.promisifyAll require "fs-extra"
sass = Promise.promisifyAll require "node-sass"
blade = Promise.promisifyAll require "blade"
{spawn, exec} = require "child-process-promise"
chalk = require "chalk"
coffee = require "coffee-script"
stylus = Promise.promisifyAll require "stylus"

pkg = require "./package.json"
semver = pkg.version
meta = pkg.main.replace "user", "meta"

version = ->
  [a,b,c] = semver.split(".")
  "#{a}.#{("00"+b).slice -3}#{("00"+c).slice -3}"

header = """
// ==UserScript==
// @name         GitLab Hidden Diff
// @namespace    http://ryanleonard.us/
// @version      #{version()}
// @description  #{pkg.description}
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
// @updateURL    https://raw.githubusercontent.com/CodeLenny/gitlab-hidden-diff/master/#{meta}
// @downloadURL  https://raw.githubusercontent.com/CodeLenny/gitlab-hidden-diff/master/#{pkg.main}
// ==/UserScript==
"""

userScript = (js) ->
  """
    #{header}
    semver = "#{semver}";
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
    #{js}
  """

tamperMonkey = (options) ->
  fs
    .readFileAsync "#{__dirname}/#{pkg.main.replace ".user.js", ".coffee"}", "utf8"
    .then (src) ->
      Promise.resolve(coffee.compile(src))
    .then userScript
    .then (user) ->
      Promise.join fs.writeFileAsync(pkg.main, user), fs.writeFileAsync(meta, header)
    .then ->
      if options.versionCommit
        exec "git add #{meta} #{pkg.main}; git commit -m 'Updated version.'"

docsSass = ->
  sass
    .renderAsync
      file: "#{__dirname}/_gh-pages/docs.scss"
      includePaths: ['_gh-pages', 'node_modules']
    .then ({css}) ->
      fs.writeFileAsync "#{__dirname}/_gh-pages/docs.css", css

docsBlade = ->
  blade
    .renderFileAsync "#{__dirname}/_gh-pages/index.blade", {semver}
    .then (html) ->
      fs.writeFileAsync "#{__dirname}/_gh-pages/index.html", html

docs = ->
  Promise
    .join docsSass(), docsBlade()
    .then ->
      exec "cd #{__dirname}/_gh-pages; git add .; git commit -m 'Updated documentation.'; git push; cd #{__dirname}; git add _gh-pages; git commit -m 'Updated gh-pages.'"
    .then ({stdout, stderr}) ->
      console.log chalk.gray stdout
      console.log chalk.yellow stderr

option "-c", "--versionCommit", "Add and commit built files, intended to be run on 'version'."

task "build:tampermonkey", "Build assets for TamperMonkey", (options) ->
  tamperMonkey options
    .then -> console.log chalk.blue "Built TamperMonkey."
    .catch console.log

task "docs:sass", "Build SASS stylesheets for the docs", (options) ->
  docsSass()
    .then -> console.log chalk.blue "Built SASS."
    .catch console.log

task "docs:blade", "Build Blade pages for the docs", (options) ->
  docsBlade()
    .then -> console.log chalk.blue "Built Blade."
    .catch console.log

task "docs", "Build assets for the docs", (options) ->
  docs()
    .then ->
      console.log chalk.blue "Built docs."
    .catch console.log

task "all", "Build output and docs", (options) ->
  tamperMonkey options
    .then docs
    .then ->
      console.log chalk.blue "Built project."
    .catch console.log
