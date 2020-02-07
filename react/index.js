import React, { Component } from 'react'
import styles from './index.css'

class ExampleTransactionAuthApp extends Component {
  constructor(props) {
    super(props)
    this.state = {
      scriptLoaded: false,
      loading: false,
      customerEmail: "",
      customerDocument: ""
    }

    this.divContainer = React.createRef()
  }

  componentWillMount = () => {
    this.injectScript(
      'google-recaptcha-v2',
      'https://recaptcha.net/recaptcha/api.js?render=explicit',
      this.handleOnLoad
    )

    fetch('https://projetosuvinil.vtexcommercestable.com.br/api/dataentities/CL/search?_fields=email,document&_where=email=renan.servare@vtex.com.br', {
      method: 'GET'
    }).then(res => res.json())
    .then((data) => {
      this.setState({ 
        customerEmail: data[0].email,
        customerDocument: data[0].document
      })

      console.log("Customer Email: "+ data[0].email +"Customer Document: "+ data[0].document)
    })
    .catch(console.log)
  }

  respondTransaction = status => {
    $(window).trigger('transactionValidation.vtex', [status])
  }

  handleOnLoad = () => {
    this.setState({ scriptLoaded: true })
    grecaptcha.ready(() => {
      grecaptcha.render(this.divContainer.current, {
        sitekey: '6LdKHsAUAAAAAHfp_A65BXCjFTkvnXgXS2L7eRp3',
        theme: 'light',
        callback: this.onVerify,
      })
    })
  }

  onVerify = e => {
    const parsedPayload = JSON.parse(this.props.appPayload)
    this.setState({ loading: true })

    fetch(parsedPayload.approvePaymentUrl).then(() => {
      this.respondTransaction(true)
    })
  }

  cancelTransaction = () => {
    const parsedPayload = JSON.parse(this.props.appPayload)
    this.setState({ loading: true })

    fetch(parsedPayload.denyPaymentUrl).then(() => {
      this.respondTransaction(false)
    })
  }

  injectScript = (id, src, onLoad) => {
    if (document.getElementById(id)) {
      return
    }

    const head = document.getElementsByTagName('head')[0]

    const js = document.createElement('script')
    js.id = id
    js.src = src
    js.async = true
    js.defer = true
    js.onload = onLoad

    head.appendChild(js)
  }

  render() {
    const { scriptLoaded, loading, customerEmail, customerDocument } = this.state

    return (
      <div className={styles.wrapper}>
        <p>Customer Email: <strong>{customerEmail}</strong></p>
        <p>Customer Document: <strong>{customerDocument}</strong></p>

        {scriptLoaded && !loading ? (
          <div className="g-recaptcha" ref={this.divContainer}></div>
        ) : (
          <h2>Loading...</h2>
        )}

        {!loading && (
          <button
            onClick={this.cancelTransaction}
            className={styles.buttonDanger}>
            Cancelar
          </button>
        )}
      </div>
    )
  }
}

export default ExampleTransactionAuthApp
