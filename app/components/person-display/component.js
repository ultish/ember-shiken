import Component from "@ember/component";
import Table from "ember-light-table";
import {computed} from "@ember/object";
import {A} from "@ember/array";

export default Component.extend({
  canLoadMore: true,
  data: computed(function () {
    return A();
  }),

  didInsertElement() {
    this._super(...arguments);


    const table = Table.create({
      columns: this.get("columns"),
      rows: this.get("data"),
      enableSync: true
    });

    this.set("table", table);

    this.loadData();
  },

  actions: {
    async onScrolledToBottom() {
      console.log('scrolled to bottom');
      this.loadData();
    },
    refresh() {
      this.set("canLoadMore", true);
      this.loadData();
    },
  },

  async loadData() {
    if (this.get("canLoadMore")) {
      const petChangesetTrees = await this.get("changesetTree").get("pets");
      this.get("data").clear();
      this.get("data").pushObjects(petChangesetTrees.toArray());
      this.set("canLoadMore", false);
    }
  },

  columns: computed(function () {
    return [
      {
        label: "Name",
        valuePath: "changeset.name",
      },
      {
        label: "Age",
        valuePath: "changeset.age",
      },
      {
        label: "Body Shape Changeset",
        valuePath: "changeset.shape.name",
        cellType: "custom-cell",
      },
      {
        label: "Body Shape Model",
        valuePath: "model.shape.name",
        cellType: "custom-cell",
      },
    ];
  }),
});
