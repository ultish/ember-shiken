import Component from "@ember/component";
import Table from "ember-light-table";
import { computed } from "@ember/object";
import { A } from "@ember/array";

/**
 * @param {Object} changesetTree - changesetTree with display data
 */
export default Component.extend({
  canLoadMore: true,

  _data: A(),
  data: computed({
    get() {
      return this.get("_data");
    },
    set(key, value) {
      this.get("_data").clear();
      this.get("_data").pushObjects(value);
      return this.get("_data");
    },
  }),

  didInsertElement() {
    this._super(...arguments);

    const table = Table.create({
      columns: this.get("columns"),
      rows: this.get("tableData"),
      /* using the tableData directly it's not updating data when page number changes 🤔 */
      // rows: this.get("tableData"),
      enableSync: true,
    });
    this.set("table", table);
  },

  actions: {
    async onScrolledToBottom() {},
    refresh() {
      this.notifyPropertyChange("tableData");
    },
    setPage(page) {
      let totalPages = this.get("totalPages");
      let currPage = this.get("currentPage");

      if (page < 1 || page > totalPages || page === currPage) {
        return;
      }

      this.set("currentPage", page);

      // without this getter Ember doesn't think anyone is using the CP
      this.get("tableData");
    },
  },

  currentPage: 1,
  itemsPerPage: 1,
  totalPages: computed(
    "changesetTree.pets.length",
    "itemsPerPage",
    function () {
      const pets = this.get("changesetTree.pets");
      const itemsPerPage = this.get("itemsPerPage");
      const totalPages = Math.ceil(pets.get("length") / itemsPerPage);
      return totalPages;
    }
  ),

  /**
   * paginate the pets data
   */
  tableData: computed(
    "changesetTree.pets.[]",
    "currentPage",
    "itemsPerPage",
    function () {
      const pets = this.get("changesetTree.pets");
      const currentPage = this.get("currentPage");
      const itemsPerPage = this.get("itemsPerPage");

      const currentIndex = currentPage - 1;

      const startIndex = itemsPerPage * currentIndex;
      const endIndex = startIndex + itemsPerPage;

      const data = this.get("data");
      data.clear();

      if (pets && pets.length) {
        data.pushObjects(pets.toArray().slice(startIndex, endIndex));
      }

      return data;
    }
  ),

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
