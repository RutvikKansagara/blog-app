const DataURIParser = require("datauri/parser");
const path = require("path");

const getDatauri = (file) => {
    console.log("uri me se");
    const parser = new DataURIParser();
    const fileExtension = path.extname(file.originalname).toString();
    const filename = parser.format(fileExtension, file.buffer);
    return filename;
};

module.exports = getDatauri;
