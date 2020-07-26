import Cell from "ember-light-table/components/cells/base";
import { computed } from "@ember/object";

export default Cell.extend({
  icon: computed("value", function () {
    const value = this.get("value");
    switch (value) {
      case "Slim": {
        return "🐕";
      }
      case "Normal": {
        return "🍔";
      }
      case "Overweight": {
        return "🚀";
      }
      default: {
        return "🚧";
      }
    }
  }),
});
