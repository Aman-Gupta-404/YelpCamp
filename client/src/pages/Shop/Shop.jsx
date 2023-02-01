import React, { useState, useEffect } from 'react';
import "./Shop.css";
import Card from '../../components/Card/Card';
import axios from "axios";
import LoadingBar from 'react-top-loading-bar'

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

function Shop() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [fetchError, setFetchError] = useState(false);
  const [showCardError, setShowCardError] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [cardActionLoading, setCardActionLoading] = useState(false);
  // state to show dialoge if there is any error after performing the action
  const [cardActionError, setCardActionError] = useState({
    error: true,
    message: ""
  });

  useEffect(() => {
    getAllProducts();
  }, [products.length])


  const getAllProducts = async () => {
    await axios.get("/api/product/get/all").then(res => {
      if (res.data.error) {
        return setFetchError(true);
      }
      console.log(res.data.products)
      const tempArray = [...res.data.products]
      setProducts(res.data.products);
      return setLoading(false);
    })
  }

  const renderSkeleton = () => {
    return (
      <>
        <Card skeleton={loading} />
        <Card skeleton={loading} />
        <Card skeleton={loading} />
        <Card skeleton={loading} />
        <Card skeleton={loading} />
        <Card skeleton={loading} />
      </>
    )

  }

  const renderShopCardError = () => {
    // This displays the error message
    if(showCardError) {
      return (
        <div className="shop__error--box">
          <p className="shop__error--text">Please Login to perform this action</p>
          {/* TODO: This is yet to be completed */}
          <LoadingBar
            color='#ff0000'
            progress={loadingProgress}
            height={2}
            onLoaderFinished={() => setLoadingProgress(0)}
          />
        </div>
      )
    } else {
      return null;
    }
  }

  const generateErrorFunction = () => {
    setShowCardError(true);
    // setTimeout(setShowCardError(true), 5000);
  }

  const removeErrorFunction = () => {
    setShowCardError(false)
  }

  const handleCloseCardErrorDialouge = (e) => {
    e.preventDefault();
    setCardActionError({
      ...cardActionError,
      error: false,
      message: "",
    })
  }
  const handleOpenCardErrorDialouge = (e) => {
    e.preventDefault();
    setCardActionError({
      ...cardActionError,
      error: true,
      message: "Some error boss!",
    })
  }

  const displayCardActionLoading = () => {
    return (
      <>
        <Dialog
        open={cardActionError}
        onClose={handleOpenCardErrorDialouge}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Use Google's location service?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Let Google help apps determine location. This means sending anonymous
            location data to Google, even when no apps are running.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <button>Disagree</button>
          <button autoFocus>
            Agree
          </button>
        </DialogActions>
      </Dialog>
      </>
    )
  }

  return (
    <div className='shopPage'>
      {renderShopCardError()}
      <div className="shopProducts">
        {/* {loading? renderSkeleton(): renderProducts()} */}
        {!loading? products.map((product, index) => {
          return (
            <>
              <Card key={index} skeleton={false} product={product} errorFunction={generateErrorFunction} errorUnloadFunction={removeErrorFunction}/>
            </>
          )
        }): renderSkeleton()}
      </div>
    </div>
  )
}

export default Shop