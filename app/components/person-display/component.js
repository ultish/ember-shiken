import Component from "@ember/component";
import Table from "ember-light-table";
import { computed, action } from "@ember/object";
import { A } from "@ember/array";
import { classNames } from "@ember-decorators/component";

/**
 * @param {Object} changesetTree - changesetTree with display data
 */
@classNames("test")
export default class PersonDisplay extends Component {
  canLoadMore = true;

  _data = A();

  get data() {
    return this.get("_data");
  }
  set data(value) {
    this.get("_data").clear();
    this.get("_data").pushObjects(value);
    return this.get("_data");
  }

  constructor() {
    super(...arguments);
  }

  @action
  didInsert() {
    const table = Table.create({
      columns: this.get("columns"),
      rows: this.get("tableData"),
      /* using the tableData directly it's not updating data when page number changes 🤔 */
      // rows: this.get("tableData"),
      enableSync: true,
    });
    this.set("table", table);
  }

  @action
  async onScrolledToBottom() {}

  @action
  refresh() {
    this.notifyPropertyChange("tableData");
  }

  @action
  setPage(page) {
    let totalPages = this.get("totalPages");
    let currPage = this.get("currentPage");

    if (page < 1 || page > totalPages || page === currPage) {
      return;
    }

    this.set("currentPage", page);

    // without this getter Ember doesn't think anyone is using the CP
    this.get("tableData");
  }

  currentPage = 1;
  itemsPerPage = 1;

  @computed("changesetTree.pets.length", "itemsPerPage")
  get totalPages() {
    const pets = this.get("changesetTree.pets");
    const itemsPerPage = this.get("itemsPerPage");
    const totalPages = Math.ceil(pets.get("length") / itemsPerPage);
    return totalPages;
  }

  /**
   * paginate the pets data
   */
  @computed("changesetTree.pets.[]", "currentPage", "itemsPerPage")
  get tableData() {
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

    console.log("tableData", data);
    return data;
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
      {
        label: "Toys",
        valuePath: "changeset.toys",
        cellType: "array-cell",
      },
    ];
  }
}
