class Helper {
  static escapeCharactersFormatter(jsonString) {
    jsonString = jsonString.replace('"{', "{");
    jsonString = jsonString.replace(/\\"/g, '"');
    jsonString = jsonString.replace('}"', "}");
    return jsonString;
  }
}

module.exports = {
  Helper: Helper,
};
