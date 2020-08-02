import Component from "@ember/component";
import Table from "ember-light-table";
import { computed, observer } from "@ember/object";
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
      rows: this.get("data"),
      /* using the tableData directly it's not updating data when page number changes 🤔 */
      // rows: this.get("tableData"),
      enableSync: true,
    });

    this.set("table", table);

    // this.loadData();
  },

  /**
   * Without using this observer, ember doesn't think anyone is using tableData
   * as a dependency after the initial request. So when you change page numbers
   * it's not recalculating the computed property
   */
  tableDataObserver: observer("tableData.[]", function () {
    this.set("data", this.get("tableData"));
  }).on("init"),

  actions: {
    async onScrolledToBottom() {
      console.log("scrolled to bottom");
      this.loadData();
    },
    refresh() {
      this.set("canLoadMore", true);
      this.loadData();
    },
    setPage(page) {
      let totalPages = this.get("totalPages");
      let currPage = this.get("currentPage");
      debugger;

      if (page < 1 || page > totalPages || page === currPage) {
        return;
      }

      this.set("currentPage", page);

      this.notifyPropertyChange("tableData");
      // this.get("data").clear();
      // this.get('fetchRecords').perform();
    },
  },

  async loadData() {
    console.log("LOAD DATA");
    if (this.get("canLoadMore")) {
      // const petChangesetTrees = await this.get("changesetTree").get("pets");
      // this.get("data").clear();
      // this.get("data").pushObjects(petChangesetTrees.toArray());
      this.set("canLoadMore", false);
      this.notifyPropertyChange("tableData");
    }
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
    "totalPages",
    function () {
      const pets = this.get("changesetTree.pets");
      const currentPage = this.get("currentPage");
      const itemsPerPage = this.get("itemsPerPage");

      const totalPages = this.get("totalPages");

      const currentIndex = currentPage - 1;

      const startIndex = itemsPerPage * currentIndex;
      const endIndex = startIndex + itemsPerPage;
      debugger;

      if (pets && pets.length) {
        return pets.toArray().slice(startIndex, endIndex);
      } else {
        return [];
      }
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
