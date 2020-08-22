import classic from "ember-classic-decorator";
import { computed } from "@ember/object";
import Cell from "ember-light-table/components/cells/base";

@classic
export default class CustomCell extends Cell {
  @computed("value.[]")
  get list() {
    const csts = this.value;
    if (csts) {
      return csts.mapBy("changeset.name").join(", ");
    } else {
      return "";
    }
  }
}
