// Generated by CoffeeScript 1.4.0
(function() {
  var argv, checkforseparateddefinition, endfile, file, filewithext, fs, inputdir, mp, optimist, option, outputter, path, pos1, startfile, wordloader, wordprocessor, _i, _len, _ref;

  optimist = require('./optimist/index');

  path = require("path");

  wordloader = require('./wordloader').wordloader;

  wordprocessor = require("./wordprocessor/main").wordprocessor;

  outputter = require("./outputter").outputter;

  fs = require("fs");

  checkforseparateddefinition = (function() {

    function checkforseparateddefinition() {}

    checkforseparateddefinition.prototype.call = function(arg) {
      if (arg["separated-definition"] && !arg["with-definition"]) {
        return false;
      } else {
        return true;
      }
    };

    checkforseparateddefinition.prototype.toString = function() {
      return 'You cannot enable "separated-definition" without enable "with-definition" first.';
    };

    return checkforseparateddefinition;

  })();

  argv = optimist.usage("A handy tool helps you to deal with new words.\nUsage: $0\nYou can use --no-[option] to diable an option if it is enabled by default.\n").boolean("with-index").describe("with-index", "Give each word an index number.").boolean("strip-comments").describe("strip-comments", "Strip away comments after #.").boolean("shuffle-words").describe("shuffle-words", "Output words into random order.").boolean("with-definition").describe("with-definition", "Search iciba and append definition after each word.").boolean("separated-definition").describe("separated-definition", "Put definitions into a individual file").option("avoid-redundancy", {
    alias: "r",
    "default": true
  }).describe("avoid-redundancy", "Strip away redundant words").boolean("avoid-redundancy").boolean("help").alias("help", "h")["default"]("help", false).describe("help", "Print out this help.").alias("outputdir", "o")["default"]("outputdir", "").describe("outputdir", "Specify the output directory.").alias("inputdir", "e")["default"]("inputdir", "./").describe("inputdir", "Specify where to search for input file.").option("debug", {
    alias: "b",
    "default": false
  }).boolean("debug").describe("debug", "Enable verbose output").option("with-index", {
    alias: "i",
    "default": true
  }).option("strip-comments", {
    alias: "c",
    "default": false
  }).option("shuffle-words", {
    alias: "s",
    "default": false
  }).option("with-definition", {
    alias: "d",
    "default": false
  }).option("separated-definition", {
    alias: "p",
    "default": false
  }).string("data")["default"]("data", "data").describe("data", "Specify where the data file.").check(new checkforseparateddefinition).argv;

  option = {
    argv: argv
  };

  if (argv._.length < 1) {
    if (argv.help) {
      console.log(optimist.help());
    } else {
      console.log("You need to specify the file(s) that contain words and is(are) needed to be processed.\n\n" + (optimist.help()));
    }
  }

  filewithext = [];

  _ref = argv._;
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    file = _ref[_i];
    pos1 = file.indexOf("-");
    startfile = parseInt(file.slice(0, pos1));
    endfile = parseInt(file.slice(pos1 + 1));
    while (startfile <= endfile) {
      filewithext.push("" + startfile + ".txt");
      startfile++;
    }
  }

  option["inputfile"] = "" + argv._ + ".txt";

  inputdir = argv.inputdir;

  inputdir += "/";

  inputdir = path.normalize(inputdir);

  mp = new wordloader(inputdir, filewithext);

  mp.on("end", function(data) {
    var eachword, i, words, wp, _j, _len1;
    words = [];
    for (i = _j = 0, _len1 = data.length; _j < _len1; i = ++_j) {
      eachword = data[i];
      words[i] = new Object();
      words[i]["name"] = eachword;
    }
    wp = new wordprocessor();
    wp.on("end", function() {
      var output;
      if (argv.debug) {
        console.log("raw: ");
        console.log(words);
        console.log("Word processor result:");
        console.log(wp.getresult());
        fs.writeFileSync("debug-data", JSON.stringify(wp.getresult()), "utf8");
      }
      output = new outputter();
      output.on("end", function(x) {
        return console.log(x);
      });
      return output.process(wp.getresult(), option);
    });
    return wp.process(words, option);
  });

}).call(this);
