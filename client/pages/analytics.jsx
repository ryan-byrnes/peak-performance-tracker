import React from 'react';
import PrGraph from '../components/graph';

export default class Analytics extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      exercises: [],
      prData: [],
      exerciseId: 1,
      showGraph: false,
      isLoading: true,
      failed: false
    };
    this.getExerciseId = this.getExerciseId.bind(this);
    this.getGraphData = this.getGraphData.bind(this);
  }

  componentDidMount() {
    fetch('/api/exercise-list')
      .then(res => res.json())
      .then(exercises => this.setState({
        exercises,
        isLoading: false
      }))
      .catch(err => {
        this.setState({ isLoading: false, failed: true });
        console.error(err);
      });
  }

  getExerciseId(event) {
    for (let i = 0; i < this.state.exercises.length; i++) {
      if (this.state.exercises[i].exercise === event.target.value) {
        const id = this.state.exercises[i].exerciseId;
        this.setState({
          exerciseId: id
        });
      }
    }
  }

  getGraphData(event) {
    event.preventDefault();
    fetch(`/api/prData/${this.state.exerciseId}`)
      .then(res => res.json())
      .then(data => {
        this.setState({
          prData: data,
          showGraph: true
        });
      });
    event.target.reset();
  }

  render() {
    if (this.state.failed) {
      return (
        <div className="row justify-content-center">
          <p className="font-size-medium color-red font-style-italic">Network Error! Please check your internet connection.</p>
        </div>
      );
    }
    if (this.state.isLoading) {
      return (
        <div className="lds-spinner spinner">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      );
    }
    return (
      <div>
        <div className="row justify-content-center margin-top-10">
          <h1 className="font-weight-bold border-bottom-black">PR Tracker</h1>
        </div>
        <div className="row justify-content-center margin-top-30">
          <form className="width-60" onSubmit={this.getGraphData}>
            <select className="font-size-small graph-input" onChange={this.getExerciseId} name="prs">
              <option className="font-style-italic" value="">Choose an Exercise</option>
              {this.state.exercises.map(exercise => {
                return (
                  <option key={exercise.exerciseId}value={exercise.exercise}>{exercise.exercise}</option>
                );
              })}
            </select>
            <button className="graph-button button-width button-height-37 button-height-30 border-radius-5 button-color-primary" type="submit">Submit</button>
          </form>
        </div>
        <div className="row justify-content-center margin-top-30">
          <PrGraph showGraph={this.state.showGraph} prData={this.state.prData} />
        </div>
      </div>
    );
  }
}
