import React from 'react'

class Mouse extends React.Component {
  constructor() {
    super()
    this.state = {
      x: 0,
      y: 0
    }
  }
  updateMouse = (event) => {
    this.setState({
      x: event.clientX,
      y: event.clientY
    })
  }
  componentDidMount() {
    document.addEventListener('mousemove', this.updateMouse)
  }
  componentWillUnmount() {
    document.removeEventListener('mousemove', this.updateMouse)
  }
  render() {
    return (
      <p>X: {this.state.x}, Y: {this.state.y}</p>
    )
  }
}

export default Mouse