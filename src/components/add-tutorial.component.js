import React, { Component } from "react";
import TutorialDataService from "../services/tutorial.service";
import Select from "react-select";

export default class AddTutorial extends Component {
  constructor(props) {
    super(props);
    this.onChangeTitle = this.onChangeTitle.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.onChangeSortOrder = this.onChangeSortOrder.bind(this);
    this.onChangeCategory = this.onChangeCategory.bind(this);
    this.saveTutorial = this.saveTutorial.bind(this);
    this.newTutorial = this.newTutorial.bind(this);
    this.handleMultiChange = this.handleMultiChange.bind(this);

    this.state = {
      id: null,
      name: "",
      description: "",
      sortOrder: 0,
      categories: [],
      selectedCategories: [],
      submitted: false
    };
  }
  componentDidMount() {
    TutorialDataService.getSelect()
      .then((response) => {
        this.setState({
          categories: response.data.map((item) => {
            return { value: item._id, label: item.name }
          }),
        });
        console.log(this.state.categories);
      })
      .catch((e) => {
        console.log(e);
      });
  }
  onChangeTitle(e) {
    this.setState({
      name: e.target.value
    });
  }
  handleMultiChange(option) {
    this.setState({
      selectedCategories: option
    });
  }
  onChangeDescription(e) {
    this.setState({
      description: e.target.value
    });
  }
  onChangeSortOrder(e) {
    this.setState({
      sortOrder: e.target.value
    });
  }
  onChangeCategory(e) {
    this.setState({
      selectedCategory: e.target.id
    });
  }
  saveTutorial() {
    var data = {
      name: this.state.name,
      description: this.state.description,
      sortOrder: this.state.sortOrder,
      subCategories: this.state.selectedCategories.map(item => { return item.value })
    };
    console.log(this.state.selectedCategories);
    TutorialDataService.create(data)
      .then(response => {
        this.setState({
          id: response.data.id,
          title: response.data.title,
          description: response.data.description,
          published: response.data.published,

          submitted: true
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  newTutorial() {
    this.setState({
      id: null,
      title: "",
      description: "",
      published: false,

      submitted: false
    });
  }

  render() {
    return (
      <div className="submit-form">
        {this.state.submitted ? (
          <div>
            <h4>You submitted successfully!</h4>
          </div>
        ) : (
            <div>
              <div className="form-group">
                <label htmlFor="title">Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  required
                  value={this.state.name}
                  onChange={this.onChangeTitle}
                  name="name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <input
                  type="text"
                  className="form-control"
                  id="description"
                  required
                  value={this.state.description}
                  onChange={this.onChangeDescription}
                  name="description"
                />
              </div>
              <div className="form-group">
                <label htmlFor="sortOrder">Sort Order</label>
                <input
                  type="Number"
                  className="form-control"
                  id="sortOrder"
                  value={this.state.sortOrder}
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

              <button onClick={this.saveTutorial} className="btn btn-success">
                Submit
            </button>
            </div>
          )}
      </div>
    );
  }
}
