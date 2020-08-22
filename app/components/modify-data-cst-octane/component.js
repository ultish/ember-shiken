import Component from "@ember/component";
import { inject as service } from "@ember/service";
import { tracked } from "@glimmer/tracking";
import { action } from "@ember/object";

export default class ModifyDataCstOctane extends Component {
  @service store;

  @tracked
  bodyShapes = this.store.findAll("bodyshape");
  //
  // didInsertElement() {
  //   this.loadData();
  // }
  //
  // async loadData() {
  //   this.bodyShapes = await this.store.findAll("bodyshape");
  // }
  @action
  save() {
    this.changesetTree;
  }

  @action
  mutInput(e) {
    this.changesetTree.changeset.name = e.target.value;
  }

  @action
  revert() {
    this.changesetTree.changeset.rollback();
  }
}
