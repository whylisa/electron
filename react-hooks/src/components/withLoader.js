// high order component
import React from 'react'
import axios from 'axios'

const withLoader = (WrappedComponent, url) => {
  return class LoaderComponent extends React.Component {
    constructor(props) {
      super(props)
      this.state = {
        data: null,
        isLoading: false
      }
    }
    componentDidMount() {
      this.setState({
        isLoading: true,
      })
      axios.get(url).then(result => {
        this.setState({
          data: result.data,
          isLoading: false
        })
      })
    }
    render() {
      const { data, isLoading } = this.state
      return (
        <>
          { (isLoading || !data) ? <p>data is loading</p> :
            <WrappedComponent {...this.props} data={data} isLoading={isLoading} />
          }
        </>
      )
    }
  }
}

export default withLoader