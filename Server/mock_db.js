
const tt_tools = require('./tt_tools.js')

module.exports = {
    load_tt: function (tt_id, u_id) {
      return tt_tools.mock_tt();
    }
  };