import classic from "ember-classic-decorator";
import { computed } from "@ember/object";
import Cell from "ember-light-table/components/cells/base";

@classic
export default class CustomCell extends Cell {
  @computed("value.[]")
  get list() {
    const value = this.value;
    return value.mapBy("name").join(", ");
  }
}
