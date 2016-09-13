wildcard2regex = (wildcard) ->
  new RegExp "^#{wildcard.split("*").join(".*")}$"

patterns = gmGet "wildcards"
patterns ?= ["*doc/*"]

isHidden = (path) ->
  return yes for search in patterns when wildcard2regex(search).test path
  no

triggerClick = (el) ->
  e = document.createEvent "HTMLEvents"
  e.initEvent "click", yes, yes
  $(el).each -> this.dispatchEvent e

hideDiffs = ->
  $(".diff-file[data-blob-diff-path]").each ->
    parsed = $(this).data("blob-diff-path").match /^\/([^\/]+)\/([^\/]+)\/blob\/([^\/]+)\/(.*)\/diff$/
    return if not parsed
    [all, namespace, project, uid, path] = parsed
    return unless isHidden path
    return console.log "#{path} already hidden!" if $(this).find(".diff-collapsed:visible").length > 0
    link = $(this).find(".file-title a[href^='#diff-']")
    console.log link[0]
    triggerClick link

isSettingsURL = (url) ->
  url.indexOf("codelenny.gitlab.io") > -1 or
  url.indexOf("gitlab-hidden-diff.codelenny.com") > -1

showSettings = (url) ->
  # Configure Alerts
  $("#notfound").hide()
  latest = $("#latestVersion").text()
  if latest isnt semver
    $("#version").show()
    $("#userVersion").text semver
  else
    $("#isfound").show()
  # Populate form
  for pattern in gmGet "wildcards"
    row = $("#template .row").clone()
    row.find("input").val(pattern)
    row.find(".form-group").addClass "is-filled"
    $("form").prepend row

$ ->
  if isSettingsURL window.location.href
    showSettings()
  else
    hideDiffs()
    $("[data-target='div#diffs'], [data-action='diffs']").click hideDiffs
