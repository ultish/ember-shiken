import classic from 'ember-classic-decorator';
import { computed } from '@ember/object';
import Cell from "ember-light-table/components/cells/base";

@classic
export default class CustomCell extends Cell {
  @computed("value")
  get icon() {
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
  }
}
