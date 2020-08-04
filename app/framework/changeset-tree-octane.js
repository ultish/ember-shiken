import Changeset from "ember-changeset";
import { tracked } from "@glimmer/tracking";

export default class ChangesetTreeOctane {
  @tracked
  changeset;

  @tracked
  model;

  /**
   * If we add this tracked property here,
   * dependencies of this won't need to use
   * computed.
   *
   * TODO: Can we dynamically add properties for tracking?
   */
  // @tracked
  // pets;

  constructor(model) {
    this.model = model;
    this.changeset = new Changeset(this.model);
  }
}
