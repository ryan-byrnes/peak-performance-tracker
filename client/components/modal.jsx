import React from 'react';
import Search from './search-bar';

export default class TrainingModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: 1,
      exercises: [],
      filteredExercises: [],
      showSuggestions: false,
      userInput: '',
      addExercise: [],
      exerciseId: 1,
      ModalisOpen: this.props.ModalisOpen
    };
    this.onType = this.onType.bind(this);
    this.onClick = this.onClick.bind(this);
    this.addExercise = this.addExercise.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    fetch('/api/exercise-list')
      .then(res => res.json())
      .then(exercises => this.setState({ exercises }));
  }

  addExercise() {
    event.preventDefault();
    for (let i = 0; i < this.state.exercises.length; i++) {
      if (this.state.userInput === this.state.exercises[i].exercise) {
        this.setState({
          exerciseId: this.state.exercises[i].exerciseId
        });
      }
    }
    this.setState({
      addExercise: this.state.userInput,
      userInput: ''
    });
  }

  handleChange() {
    const value = event.target.value;
    this.setState({
      ...this.state,
      [event.target.name]: value
    });
  }

  onType(event) {
    const userInput = event.currentTarget.value;
    const filteredExercises = this.state.exercises.filter(
      exercise => exercise.exercise.toLowerCase().indexOf(userInput.toLowerCase()) > -1
    );
    this.setState({
      activeSuggestions: 0,
      filteredExercises,
      showSuggestions: true,
      userInput: event.target.value
    });
  }

  onClick(event) {
    this.setState({
      activeSuggestions: 0,
      filteredExercises: [],
      showSuggestions: false,
      userInput: event.currentTarget.innerText
    });
  }

  render() {
    if (this.state.addExercise.length > 0) {
      return (
          <div className="modal">
            <div className="modal-content position-relative overflow-scroll">
              <h1>Add Exercise</h1>
              <Search state={this.state} onType={this.onType} click={this.onClick} addExercise={this.addExercise} />
              <div className="row">
                <form onSubmit={this.submitPR}>
                  <div className="row">
                    <h3 className="margin-bottom-5">{this.state.addExercise}</h3>
                  </div>
                  <div className="row justify-content-center align-items-flex-end">
                    <div className="column-third margin-right-10">
                      <h5>Sets</h5>
                      <div className="row justify-content-center align-items-center">
                        <p>1</p>
                      </div>
                    </div>
                    <div className="column-third margin-right-10">
                      <h5>Number of Reps (RM)</h5>
                      <input className="input-width" type="text" name="reps" onChange={this.handleChange}></input>
                    </div>
                    <div className="column-third">
                      <h5>Weight (lbs)</h5>
                      <input className="input-width" type="text" name="weight" onChange={this.handleChange}></input>
                    </div>
                  </div>
                  <div className="margin-top-10">
                    <button className="button-width button-height border-radius-5 button-color-primary add-pr-button-font" type="submit">Submit PR</button>
                  </div>
                </form>
              </div>
              <div>
                <button className="button-color-close button-width button-height position-absolute border-radius-5 add-pr-button-font" onClick={this.props.handleClose}>Close</button>
              </div>
            </div>
          </div>
      );
    }
    return (
        <div className="modal">
          <div className="modal-content position-relative">
            <h1>Add Exercise</h1>
            <Search state={this.state} onType={this.onType} click={this.onClick} addExercise={this.addExercise} />
            <div>
              <button className="button-height button-width border-radius-5 button-color-close position-absolute add-pr-button-font" onClick={this.props.handleClose}>Close</button>
            </div>
          </div>
        </div>
    );
  }
}
