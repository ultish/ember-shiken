import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import Table from "ember-light-table";
import { action, computed } from "@ember/object";
import { A } from "@ember/array";
import { dependentKeyCompat } from "@ember/object/compat";

export default class PersonDisplayOctaneComponent extends Component {
  @tracked
  currentPage = 1;

  @tracked
  itemsPerPage = 1;

  // the underlying data for the table rows. This instance cannot change
  data = A([]);

  constructor() {
    super(...arguments);
  }

  /**
   * By making this a getter, it properly tracks this.tableData.
   * But only because a getter is executed every time it's called!
   * @returns {*}
   */
  table = Table.create({
    columns: this.columns,
    rows: this.tableData,
    enableSync: true,
  });

  // @computed()
  // get table() {
  //   console.log("get table");
  //   return Table.create({
  //     columns: this.columns,
  //     rows: this.tableData,
  //     enableSync: true,
  //   });
  // }

  @action
  setPage(page) {
    const totalPages = this.totalPages;
    const currentPage = this.currentPage;
    if (page < 1 || page > totalPages || page == currentPage) {
      return;
    }
    console.log("set page", page);
    this.currentPage = page;

    // force the getter...seems odd we have to do this.
    /**
     * for the getter...seems odd we have to do this. Ember doesn't
     * think anyone is using this.tableData, somehow it's missed in
     * tracking.
     *
     * Can tell as if you put {{this.tableData}} into the template,
     * this is no longer required for updating.
     */
    this.tableData;
  }

  /**
   * adding computed here for caching
   * @returns {*}
   */
  @computed("currentPage", "args.changesetTree.pets.[]")
  get tableData() {
    console.log("tableData fetch", this.currentPage);
    const pets = this.args.changesetTree.pets;
    const currentPage = this.currentPage;
    const itemsPerPage = this.itemsPerPage;

    const currentIndex = currentPage - 1;

    const startIndex = itemsPerPage * currentIndex;
    const endIndex = startIndex + itemsPerPage;

    // Important Note: if we create a new array and return
    // it here, ember light table will lose track of it,
    // preventing the table from updating. When enableSync
    // is turned on, array observers are added to the
    // array that's initially passed in via the
    // Table.create() call. That means the observers are
    // attached *only* to that Array instance. So if this
    // getter returns a different Array instance, say
    // bye bye to that array observer
    this.data.clear();
    if (pets && pets.length) {
      const subset = pets.toArray().slice(startIndex, endIndex);
      this.data.pushObjects(subset);
    }
    return this.data;
  }

  // the changesetTreeOctane.pets is not a @tracked property,
  // so add computed here
  @computed("args.changesetTree.pets.[]")
  get totalPages() {
    const pets = this.args.changesetTree.pets;
    const itemsPerPage = this.itemsPerPage;
    const result = Math.ceil(pets.length / itemsPerPage);
    return result;
  }

  get columns() {
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
  }
}