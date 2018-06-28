class MyComponent extends Component {
  render() {
    return <h1>{this.props.name}</h1>;
  }
}

MyComponent.PROPS = {
  name: Config.string().required()
};
