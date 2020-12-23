import React, { Component } from "react";
import TutorialDataService from "../services/tutorial.service";
import Select from "react-select";

export default class Tutorial extends Component {
  constructor(props) {
    super(props);
    this.onChangeTitle = this.onChangeTitle.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.getTutorial = this.getTutorial.bind(this);
    this.updatePublished = this.updatePublished.bind(this);
    this.updateTutorial = this.updateTutorial.bind(this);
    this.deleteTutorial = this.deleteTutorial.bind(this);
    this.onChangeSortOrder = this.onChangeSortOrder.bind(this);
    this.handleMultiChange = this.handleMultiChange.bind(this);

    this.state = {
      currentTutorial: {
        _id: null,
        name: "",
        description: "",
        sortOrder: 0,
      },
      categories: [],
      selectedCategories: [],
      message: "",
    };
  }

  componentDidMount() {
    this.getTutorial(this.props.match.params.id);
    this.getSubCategories();
  }

  getSubCategories() {
    TutorialDataService.getSelect()
      .then((response) => {
        console.log(response.data);
        this.setState({
          categories: response.data.filter(cat => {
            let isChild = this.checkForChild(this.props.match.params.id, cat.subCategories);
            console.log(isChild);
            return (cat._id !== this.props.match.params.id) && !isChild
          }).map((item) => {
            return { value: item._id, label: item.name }
          }),
        });
      })
      .catch((e) => {
        console.log(e);
      });
  }
  checkForChild(id, subCategories) {
    for (let subCat of subCategories) {
      if (subCat.subCategories && subCat.subCategories.length > 0 && subCat.subCategories.findIndex(x => x._id == this.props.match.params.id) > -1) {
        return true;
      }
      return this.checkForChild(id, subCat.subCategories)
    }
  }
  handleMultiChange(e, option) {
    if (option.removedValue && option.removedValue.isFixed) {
      TutorialDataService.deleteSubCategory(this.props.match.params.id, option.removedValue.value)
        .then((response) => {
          console.log(response.data);
          this.getSubCategories();
        })
        .catch((e) => {
          console.log(e);
        });
    }

    this.setState({
      selectedCategories: e
    });
  }

  onChangeSortOrder(e) {
    const sortOrder = e.target.value;

    this.setState(function (prevState) {
      return {
        currentTutorial: {
          ...prevState.currentTutorial,
          sortOrder: sortOrder,
        },
      };
    });
  }
  onChangeTitle(e) {
    const name = e.target.value;

    this.setState(function (prevState) {
      return {
        currentTutorial: {
          ...prevState.currentTutorial,
          name: name,
        },
      };
    });
  }

  onChangeDescription(e) {
    const description = e.target.value;

    this.setState((prevState) => ({
      currentTutorial: {
        ...prevState.currentTutorial,
        description: description,
      },
    }));
  }

  getTutorial(id) {
    TutorialDataService.get(id)
      .then((response) => {
        let selected = response.data.subCategories.map((item) => {
          return { value: item._id, label: item.name, isFixed: true }
        })
        this.setState({
          currentTutorial: response.data,
          selectedCategories: selected
        });

      })
      .catch((e) => {
        console.log(e);
      });
  }

  updateTutorial() {
    var data = {
      name: this.state.currentTutorial.name,
      description: this.state.currentTutorial.description,
      subCategories: this.state.selectedCategories.filter(x => !x.isFixed).map(x => x.value),
      sortOrder: this.state.currentTutorial.sortOrder
    };
    TutorialDataService.update(this.state.currentTutorial._id, data)
      .then((response) => {
        console.log(response.data);
        this.setState({
          message: "The category was updated successfully!",
        });
      })
      .catch((e) => {
        console.log(e);
      });
  }

  deleteTutorial() {
    TutorialDataService.delete(this.state.currentTutorial.id)
      .then((response) => {
        console.log(response.data);
        this.props.history.push("/tutorials");
      })
      .catch((e) => {
        console.log(e);
      });
  }

  render() {
    const { currentTutorial } = this.state;

    return (
      <div>
        {currentTutorial ? (
          <div className="edit-form">
            <h4>Tutorial</h4>
            <form>
              <div className="form-group">
                <label htmlFor="name">Title</label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  value={currentTutorial.name}
                  onChange={this.onChangeTitle}
                />
              </div>
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <input
                  type="text"
                  className="form-control"
                  id="description"
                  value={currentTutorial.description}
                  onChange={this.onChangeDescription}
                />
              </div>
              <div className="form-group">
                <label htmlFor="sortOrder">Sort Order</label>
                <input
                  type="Number"
                  className="form-control"
                  id="sortOrder"
                  value={currentTutorial.sortOrder}
                  onChange={this.onChangeSortOrder}
                  name="sortOrder"
                />
              </div>
              <div className="form-group">
                <label htmlFor="category">Category</label>

                <Select
                  name="category"
                  value={this.state.selectedCategories}
                  options={this.state.categories}
                  onChange={this.handleMultiChange}
                  isMulti
                />
              </div>

            </form>

            <button
              type="submit"
              className="badge badge-success"
              onClick={this.updateTutorial}
            >
              Update
            </button>
            <p>{this.state.message}</p>
          </div>
        ) : (
            <div>
              <br />
              <p>Please click on a Category...</p>
            </div>
          )}
      </div>
    );
  }
}
